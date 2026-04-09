/**
 * skillTreeLogic.js
 *
 * ARCHITEKTURA:
 *   character.stats    = bazowe statystyki (PDR / admin-set). Nie zawiera bonusów drzewka.
 *   calcEffectiveStats = base + treeFlat + itemFlat + % — jedyne źródło wyświetlanych statów.
 *   applyUnlock / revokeUnlock — modyfikują unlockedNodes + blockedNodes, NIE stats.
 *
 * PROGI TIERÓW:
 *   Używamy treeData.thresholds (z Firestore) lub TIER_THRESHOLDS[treeStat] jako fallback.
 *   Sprawdzenie = base stat + suma bonusów węzłów tego drzewka dla treeStat.
 */

import { TIER_THRESHOLDS } from './statThresholds'
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

// ── Pobierz próg tiera (Firestore > hardcoded) ───────────────────────────
export function getTierThreshold(tier, treeStat, treeData) {
  const t = treeData?.thresholds
  if (t) {
    if (t[tier]         !== undefined) return Number(t[tier])
    if (t[String(tier)] !== undefined) return Number(t[String(tier)])
  }
  return TIER_THRESHOLDS[treeStat]?.[tier]
}

// ── Efektywna wartość statu = base + bonusy wszystkich węzłów drzewka ────
function effectiveStat(treeStat, character, treeData) {
  const base = character.stats?.[treeStat] ?? 0
  const unlocked = character.unlockedNodes?.[treeStat] ?? {}
  let bonus = 0
  for (const [nodeId, count] of Object.entries(unlocked)) {
    const n = treeData?.nodes?.find(x => x.id === nodeId)
    if (n?.type === 'stat' && n.statGrants?.[treeStat]) {
      bonus += Number(n.statGrants[treeStat]) * (count ?? 0)
    }
  }
  return base + bonus
}

// ── OR requires: wystarczy 1 z poprzedników ──────────────────────────────
function requiresSatisfied(node, unlockedInTree) {
  const reqs = node.requires ?? []
  if (reqs.length === 0) return true
  return reqs.some(r => (unlockedInTree[r] ?? 0) > 0)
}

// ── canUnlock ─────────────────────────────────────────────────────────────
export function canUnlock(nodeId, treeStat, character, treeData, useNDR = true) {
  const node = treeData?.nodes?.find(n => n.id === nodeId)
  if (!node) return { ok: false, reason: 'node_not_found' }

  const unlockedInTree = character.unlockedNodes?.[treeStat] ?? {}
  const blockedInTree  = character.blockedNodes?.[treeStat]  ?? []

  if (blockedInTree.includes(nodeId)) return { ok: false, reason: 'blocked' }

  const threshold = getTierThreshold(node.tier, treeStat, treeData)
  if (threshold !== undefined && effectiveStat(treeStat, character, treeData) < threshold)
    return { ok: false, reason: 'tier_locked' }

  if (!requiresSatisfied(node, unlockedInTree))
    return { ok: false, reason: 'requires_node' }

  if (node.type === 'stat') {
    if ((unlockedInTree[nodeId] ?? 0) >= (node.maxPurchases ?? 1))
      return { ok: false, reason: 'max_purchases' }
  }

  if (node.type === 'skill' && unlockedInTree[nodeId])
    return { ok: false, reason: 'already_owned' }

  if (useNDR) {
    const avail = calcNDRFromReisen(character.reisenAbsorbed ?? 0)
               + (character.ndr ?? 0)
               - calcSpentNDR(character.unlockedNodes ?? {})
    if (avail <= 0) return { ok: false, reason: 'no_ndr' }
  }

  return { ok: true }
}

// ── applyUnlock ───────────────────────────────────────────────────────────
// Jeśli węzeł ma tag "admin_action" → tworzy wpis w adminTasks
export async function applyUnlock(nodeId, treeStat, character, allTrees, adminFree = false) {
  const treeData = allTrees[treeStat]
  const node = treeData?.nodes?.find(n => n.id === nodeId)
  if (!node) throw new Error('Node not found: ' + nodeId)

  const newUnlocked = JSON.parse(JSON.stringify(character.unlockedNodes ?? {}))
  if (!newUnlocked[treeStat]) newUnlocked[treeStat] = {}
  newUnlocked[treeStat][nodeId] = (newUnlocked[treeStat][nodeId] ?? 0) + 1

  const newBlocked = JSON.parse(JSON.stringify(character.blockedNodes ?? {}))

  // ── Pomocnik: zlicz ile node'ów z danym tagiem jest już odblokowanych ──
  function countUnlockedWithTag(tag, trees) {
    let count = 0
    for (const t of trees) {
      const td = allTrees[t]
      const unl = newUnlocked[t] ?? {}
      for (const [nid, cnt] of Object.entries(unl)) {
        if (!cnt) continue
        const n = td?.nodes?.find(x => x.id === nid)
        if (n?.tags?.includes(tag)) count += 1
      }
    }
    return count
  }

  // ── Zlicz dodatkowe sloty nadane przez extraTagSlot/extraTagSlots node'ów ──
  function countExtraSlots(tag) {
    let extra = 0
    for (const [t, td] of Object.entries(allTrees)) {
      const unl = newUnlocked[t] ?? {}
      for (const [nid, cnt] of Object.entries(unl)) {
        if (!cnt) continue
        const n = td?.nodes?.find(x => x.id === nid)
        // obsługa zarówno extraTagSlot (string) jak i extraTagSlots (array)
        const slots = n?.extraTagSlots ?? (n?.extraTagSlot ? [n.extraTagSlot] : [])
        if (slots.includes(tag)) extra += 1
      }
    }
    return extra
  }

  for (const rule of (node.blocks ?? [])) {
    const trees = rule.tree === '*' ? Object.keys(allTrees) : [rule.tree]
    const maxTagCount = rule.maxTagCount ?? 1  // domyślnie: 1 = blokuj od razu

    // Sprawdź ile już jest odblokowanych node'ów z tymi tagami (po tym zakupie)
    let alreadyCount = 0
    for (const tag of (rule.tags ?? [])) {
      alreadyCount = Math.max(alreadyCount, countUnlockedWithTag(tag, trees))
    }

    const extraSlots = countExtraSlots((rule.tags ?? [])[0])
    const effectiveMax = maxTagCount + extraSlots

    // Zablokuj tylko gdy osiągnięto limit
    if (alreadyCount >= effectiveMax) {
      for (const tree of trees) {
        if (!newBlocked[tree]) newBlocked[tree] = []
        const toBlock = (allTrees[tree]?.nodes ?? [])
          .filter(n => n.tags?.some(t => rule.tags?.includes(t)))
          .filter(n => !rule.excludeNodeId || n.id !== rule.excludeNodeId)
          .filter(n => !(newUnlocked[tree]?.[n.id]))  // nie blokuj już kupionych
          .map(n => n.id)
        newBlocked[tree] = [...new Set([...newBlocked[tree], ...toBlock])]
      }
    }
  }

  // ── Jeśli node ma extraTagSlot/extraTagSlots — odblokuj jeden node z każdej grupy ──
  const extraSlotTags = node.extraTagSlots ?? (node.extraTagSlot ? [node.extraTagSlot] : [])
  for (const tag of extraSlotTags) {
    // Usuń jeden zablokowany node z tej grupy (daj graczowi dodatkowy slot)
    let unblocked = false
    for (const [tree, blocked] of Object.entries(newBlocked)) {
      if (unblocked) break
      const td = allTrees[tree]
      const toUnblock = blocked.find(bid => {
        const bn = td?.nodes?.find(x => x.id === bid)
        return bn?.tags?.includes(tag) && !(newUnlocked[tree]?.[bid])
      })
      if (toUnblock) {
        newBlocked[tree] = newBlocked[tree].filter(b => b !== toUnblock)
        unblocked = true
      }
    }
  }

  await updateDoc(doc(db, 'characters', character.id), {
    unlockedNodes: newUnlocked,
    blockedNodes:  newBlocked,
  })

  // Utwórz admin task jeśli node ma tag "admin_action"
  // Dotyczy zarówno zakupów gracza jak i admin-granted (bo admin_action = wymaga uwagi admina)
  if (node.tags?.includes('admin_action')) {
    try {
      const desc = node.longDescription ?? node.description ?? node.shortDescription ?? ''
      await addDoc(collection(db, 'adminTasks'), {
        type:                'node_purchase',
        status:              'pending',
        characterId:         character.id,
        characterIdentifier: character.identifier ?? '?',
        characterFirstName:  character.firstName  ?? '',
        characterLastName:   character.lastName   ?? '',
        treeStat,
        nodeId,
        nodeName:   node.label ?? nodeId,
        nodeDesc:   desc,
        title:      `${character.firstName ?? ''} ${character.lastName ?? ''} (${character.identifier ?? '?'}) — ${node.label ?? nodeId}`,
        body:       `Zakupił(a) node: **${node.label ?? nodeId}** [${treeStat}]\n\n${desc}`,
        readBy:     [],
        doneAt:     null,
        doneBy:     null,
        createdAt:  serverTimestamp(),
      })
    } catch (e) {
      console.warn('Failed to create admin task:', e)
    }
  }

  return { newUnlocked, newBlocked }
}

// ── revokeUnlock — usuwa WSZYSTKIE zakupy ────────────────────────────────
export async function revokeUnlock(nodeId, treeStat, character, allTrees) {
  const treeData = allTrees[treeStat]
  const node = treeData?.nodes?.find(n => n.id === nodeId)
  if (!node) throw new Error('Node not found: ' + nodeId)

  const newUnlocked = JSON.parse(JSON.stringify(character.unlockedNodes ?? {}))
  if ((newUnlocked[treeStat]?.[nodeId] ?? 0) <= 0) throw new Error('Node not purchased')
  delete newUnlocked[treeStat][nodeId]

  // Przebuduj blokady
  const newBlocked = {}
  for (const tStat of Object.keys(allTrees)) newBlocked[tStat] = []
  for (const [tStat, treeUnlocked] of Object.entries(newUnlocked)) {
    const td = allTrees[tStat]; if (!td) continue
    for (const [nid] of Object.entries(treeUnlocked)) {
      const n = td.nodes?.find(x => x.id === nid)
      if (!n?.blocks?.length) continue
      for (const rule of n.blocks) {
        const trees = rule.tree === '*' ? Object.keys(allTrees) : [rule.tree]
        for (const tree of trees) {
          if (!newBlocked[tree]) newBlocked[tree] = []
          const toBlock = (allTrees[tree]?.nodes ?? [])
            .filter(x => x.tags?.some(t => rule.tags?.includes(t)))
            .filter(x => x.id !== rule.excludeNodeId)
            .map(x => x.id)
          newBlocked[tree] = [...new Set([...newBlocked[tree], ...toBlock])]
        }
      }
    }
  }

  await updateDoc(doc(db, 'characters', character.id), {
    unlockedNodes: newUnlocked,
    blockedNodes:  newBlocked,
  })
  return { newUnlocked, newBlocked }
}

// ── Helpers ───────────────────────────────────────────────────────────────
export function calcSpentNDR(unlockedNodes) {
  let spent = 0
  for (const tree of Object.values(unlockedNodes))
    for (const count of Object.values(tree)) spent += (count ?? 0)
  return spent
}

export function calcNDRFromReisen(reisenAbsorbed) {
  let remaining = reisenAbsorbed, ndr = 0, cost = 4, countAtCost = 0
  while (remaining >= cost) {
    remaining -= cost; ndr++; countAtCost++
    if (countAtCost % 3 === 0) cost++
  }
  return ndr
}

export function calcTreeFlatBonus(stat, unlockedNodes, allTrees) {
  let total = 0
  for (const [treeStat, treeData] of Object.entries(allTrees)) {
    const treeUnlocked = unlockedNodes?.[treeStat] ?? {}
    for (const [nodeId, count] of Object.entries(treeUnlocked)) {
      const node = treeData?.nodes?.find(n => n.id === nodeId)
      if (node?.type === 'stat' && node.statGrants?.[stat]) {
        total += Number(node.statGrants[stat]) * (count ?? 0)
      }
    }
  }
  return total
}

export function isTierUnlocked(tier, treeStat, character, treeData) {
  const threshold = getTierThreshold(tier, treeStat, treeData)
  if (threshold === undefined) return true
  return effectiveStat(treeStat, character, treeData) >= threshold
}
