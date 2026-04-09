/**
 * Oblicza efektywne statystyki postaci uwzględniając:
 * 1. Base stats (character.stats)
 * 2. Flat bonusy z skill trees (unlockedNodes)
 * 3. Flat bonusy z założonych itemów
 * 4. Procenty z itemów + admin statMultipliers (po flat)
 *
 * Wzór: final = (base + treeFlat + itemFlat) * (1 + sum_all_percent / 100)
 */

import { calcTreeFlatBonus } from './skillTreeLogic'
import { DEFAULT_SKILL_TREES } from './defaultSkillTrees'

const STAT_KEYS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']

export function calcEffectiveStats(character, items = [], allTreesOverride = null) {
  const base    = character.stats ?? {}
  const multipliers = character.statMultipliers ?? []

  // Build nazo tree from character.nazoNodes if present
  const nazoTree = {
    stat: 'nazo', nodes: character.nazoNodes ?? [], edges: [],
  }
  // Use provided trees (from Firestore) or fall back to defaults
  const allTrees = allTreesOverride
    ? { ...allTreesOverride, nazo: nazoTree }
    : { ...DEFAULT_SKILL_TREES, nazo: nazoTree }

  const effective  = {}
  const breakdown  = {}

  for (const stat of STAT_KEYS) {
    const baseVal = base[stat] ?? 0

    // Flat bonusy z drzewek
    const treeBonus = calcTreeFlatBonus(stat, character.unlockedNodes ?? {}, allTrees)
    const treeSources = treeBonus > 0 ? [{ value: treeBonus, source: 'Skill Tree', type: 'flat' }] : []

    // Flat bonusy z itemów
    const itemFlatSources = []
    let itemFlat = 0
    for (const item of items) {
      if (!item.equipped) continue
      for (const bonus of (item.statBonuses ?? [])) {
        if (bonus.stat === stat && bonus.flat) {
          itemFlat += bonus.flat
          itemFlatSources.push({ value: bonus.flat, source: item.name, type: 'flat' })
        }
      }
    }

    const totalFlat = treeBonus + itemFlat
    const flatSources = [...treeSources, ...itemFlatSources]
    const afterFlat = baseVal + totalFlat

    // % bonusy z itemów
    const percentSources = []
    let totalPercent = 0
    for (const item of items) {
      if (!item.equipped) continue
      for (const bonus of (item.statBonuses ?? [])) {
        if (bonus.stat === stat && bonus.percent) {
          totalPercent += bonus.percent
          percentSources.push({ value: bonus.percent, source: item.name, type: 'percent' })
        }
      }
    }
    for (const m of multipliers) {
      if (m.stat === stat) {
        totalPercent += m.percent
        percentSources.push({ value: m.percent, source: m.source, type: 'percent' })
      }
    }

    // afterPercent — bez zaokrąglenia żeby mode mnożniki nie traciły precyzji
    const afterPercent = afterFlat * (1 + totalPercent / 100)

    // Modes — finalne mnożniki (po wszystkich flat i %)
    const activeModes = (character.modes ?? []).filter(m => m.active)
    let modeMultiplier = 1
    const modeSources = []
    for (const mode of activeModes) {
      for (const m of (mode.multipliers ?? [])) {
        if (m.stat === stat) {
          modeMultiplier *= m.factor
          modeSources.push({ name: mode.name, factor: m.factor })
        }
      }
    }

    // Precise float — zaokrąglamy tylko przy wyświetlaniu w UI
    const finalPrecise = afterPercent * modeMultiplier

    effective[stat] = finalPrecise   // float do dalszych obliczeń (HP/RP, formuły)

    breakdown[stat] = {
      base: baseVal,
      treeFlat: treeBonus,
      flat: totalFlat,
      percent: totalPercent,
      afterFlat: Math.floor(afterFlat),
      modeMultiplier,
      modeSources,
      final: finalPrecise,           // precyzyjny float — UI sam zaokrągla przez Math.floor
      flatSources,
      percentSources,
      hasBonus: totalFlat !== 0 || totalPercent !== 0 || modeMultiplier !== 1,
    }
  }

  return { effective, breakdown }
}
