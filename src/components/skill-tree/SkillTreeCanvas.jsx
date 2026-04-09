import { useMemo, useCallback, useRef } from 'react'
import { ReactFlow, Background, Controls, BaseEdge, getStraightPath } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import StatNode  from './StatNode'
import SkillNode from './SkillNode'
import { canUnlock, applyUnlock, revokeUnlock, calcTreeFlatBonus, getTierThreshold } from '../../data/skillTreeLogic'

const TREE_STROKE = {
  strength:  '#e07030', vitality: '#c03030', speed: '#30a050', defense: '#c0a020',
  reiatsu:   '#3060c0', reiryoku: '#8030b0', tamashi: '#b0b0b0',
  bukijutsu: '#6060a0', bujutsu:  '#a07850', nazo: '#dc3232',
}

function DashedEdge({ id, sourceX, sourceY, targetX, targetY, data }) {
  const [p] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const treeColor = TREE_STROKE[data?.treeStat] ?? '#dc3232'
  return (
    <BaseEdge id={id} path={p}
      style={{ stroke: data?.purchased ? treeColor : data?.available ? '#5a5a7a' : '#2e2e3f', strokeWidth: data?.purchased ? 1.5 : 1, strokeDasharray: '6 4', opacity: data?.blocked ? 0.15 : 0.75 }}
    />
  )
}

function TierSeparatorNode({ data }) {
  const { lowerTier = 1, higherTier = 2, threshold = 50, statKey = '', statVal = 0, width = 2400 } = data
  const reached = statVal >= threshold
  const col = reached ? 'rgba(96,192,128,0.3)' : 'rgba(255,255,255,0.14)'
  const textCol = reached ? 'rgba(96,192,128,0.55)' : 'rgba(255,255,255,0.22)'
  return (
    <div style={{ width, height: 44, pointerEvents: 'none', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: `1px dashed ${col}`, transform: 'translateY(-50%)' }} />
      <div style={{ position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)', fontSize: '0.44rem', letterSpacing: '0.28em', color: textCol, fontFamily: "'Cinzel', serif", whiteSpace: 'nowrap', background: 'rgba(10,10,15,0.9)', padding: '1px 14px' }}>
        ▲ TIER {higherTier} — {statKey.toUpperCase()} ≥ {threshold} {reached ? '✓' : ''}
      </div>
      <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', fontSize: '0.44rem', letterSpacing: '0.28em', color: textCol, fontFamily: "'Cinzel', serif", whiteSpace: 'nowrap', background: 'rgba(10,10,15,0.9)', padding: '1px 14px' }}>
        TIER {lowerTier} ▼
      </div>
    </div>
  )
}

const nodeTypes = { stat: StatNode, skill: SkillNode, tierSeparator: TierSeparatorNode }
const edgeTypes = { dashed: DashedEdge }

export default function SkillTreeCanvas({ treeData, character, allTrees, readOnly, adminFree, onUnlocked, effectiveStats }) {
  const treeStat       = treeData?.stat ?? ''
  const unlockedInTree = character?.unlockedNodes?.[treeStat] ?? {}
  const blockedInTree  = character?.blockedNodes?.[treeStat]  ?? []

  // Efektywna wartość statu = base + bonusy węzłów drzewka
  const baseStatVal    = character?.stats?.[treeStat] ?? 0
  const treeBonusVal   = calcTreeFlatBonus(treeStat, character?.unlockedNodes ?? {}, { [treeStat]: treeData })
  const effectiveStatVal = baseStatVal + treeBonusVal

  const processing = useRef(false)

  function getNodeState(node) {
    const purchases  = unlockedInTree[node.id] ?? 0
    const maxP       = node.maxPurchases ?? 1
    const fullyBought = node.type === 'stat' ? purchases >= maxP : purchases > 0
    const threshold   = getTierThreshold(node.tier, treeStat, treeData)

    if (adminFree) {
      if (fullyBought) return 'revocable'
      if (node.type === 'stat' && purchases > 0) return 'purchased'
      const tierOk     = threshold === undefined || effectiveStatVal >= threshold
      const reqs       = node.requires ?? []
      const reqOk      = reqs.length === 0 || reqs.some(r => (unlockedInTree[r] ?? 0) > 0)
      const notBlocked = !blockedInTree.includes(node.id)
      return (tierOk && reqOk && notBlocked) ? 'available' : 'admin_available'
    }

    if (blockedInTree.includes(node.id)) return 'blocked'
    if (threshold !== undefined && effectiveStatVal < threshold) return 'locked'
    if (fullyBought) return 'purchased'
    const reqs = node.requires ?? []
    if (reqs.length > 0 && !reqs.some(r => (unlockedInTree[r] ?? 0) > 0)) return 'locked'
    return 'available'
  }

  const flowNodes = useMemo(() => {
    if (!treeData?.nodes) return []
    const result = []

    // Unikalne tiery w drzewie
    const allTiers = [...new Set(treeData.nodes.map(n => n.tier ?? 1))].sort((a, b) => a - b)

    for (const node of treeData.nodes) {
      // Gracz: ukryj węzły wyższych tierów gdy za niski stat
      if (!adminFree) {
        const thr = getTierThreshold(node.tier, treeStat, treeData)
        if (thr !== undefined && effectiveStatVal < thr) continue
      }

      const state     = getNodeState(node)
      const purchases = unlockedInTree[node.id] ?? 0

      let unlockFn = undefined
      if (!readOnly) {
        if (adminFree) {
          unlockFn = () => {
            if (processing.current) return
            processing.current = true
            const fullyBought = node.type === 'stat'
              ? purchases >= (node.maxPurchases ?? 1)
              : purchases > 0
            ;(fullyBought
              ? revokeUnlock(node.id, treeStat, character, allTrees)
              : applyUnlock(node.id, treeStat, character, allTrees, true)
            )
              .then(() => { if (onUnlocked) onUnlocked() })
              .catch(e => console.error('node op:', e))
              .finally(() => { processing.current = false })
          }
        } else if (state === 'available') {
          unlockFn = () => {
            if (processing.current) return
            const check = canUnlock(node.id, treeStat, character, treeData, true)
            if (!check.ok) return
            processing.current = true
            applyUnlock(node.id, treeStat, character, allTrees, false)
              .then(() => { if (onUnlocked) onUnlocked() })
              .catch(e => console.error('applyUnlock:', e))
              .finally(() => { processing.current = false })
          }
        }
      }

      result.push({
        id: node.id, type: node.type, position: node.position,
        draggable: false, selectable: false, zIndex: 1,
        data: {
          label:            node.label,
          shortDescription: node.shortDescription ?? node.description ?? '',
          longDescription:  node.longDescription ?? '',
          description:      node.description ?? '',
          maxPurchases:     node.maxPurchases ?? 1,
          currentPurchases: purchases,
          state,
          onUnlock: unlockFn,
          effectiveStats:   effectiveStats ?? {},
          treeStat,
        },
      })
    }

    // Separatory tierów — dla każdej granicy (np. T1→T2, T2→T3)
    for (let i = 0; i < allTiers.length - 1; i++) {
      const lowerTier  = allTiers[i]
      const higherTier = allTiers[i + 1]
      const higherThreshold = getTierThreshold(higherTier, treeStat, treeData)
      if (higherThreshold === undefined) continue

      const lowerNodes  = treeData.nodes.filter(n => (n.tier ?? 1) === lowerTier)
      const higherNodes = treeData.nodes.filter(n => (n.tier ?? 1) === higherTier)
      if (lowerNodes.length === 0 || higherNodes.length === 0) continue

      // Widoczne wyższe węzły (adminFree = wszystkie, inaczej tylko odblokowane)
      const visibleHigher = adminFree
        ? higherNodes
        : higherNodes.filter(n => effectiveStatVal >= (getTierThreshold(n.tier, treeStat, treeData) ?? Infinity))
      if (visibleHigher.length === 0 && !adminFree) continue

      const sourceNodes = adminFree ? higherNodes : visibleHigher
      const t2maxY = Math.max(...sourceNodes.map(n => n.position.y))
      const t1minY = Math.min(...lowerNodes.map(n => n.position.y))
      const sepY   = Math.round((t2maxY + t1minY) / 2) - 22

      // Separator — szerokość i pozycja X centrowana na root node
      const rootNode = treeData.nodes.find(n => (n.requires ?? []).length === 0)
      const rootX = rootNode?.position?.x ?? 0
      const sepWidth = 2400

      result.push({
        id: `__sep_${lowerTier}_${higherTier}`, type: 'tierSeparator',
        position: { x: rootX - sepWidth / 2, y: sepY },
        draggable: false, selectable: false,
        data: { lowerTier, higherTier, threshold: higherThreshold, statKey: treeStat, statVal: effectiveStatVal, width: sepWidth },
      })
    }

    return result
  }, [treeData, character, readOnly, adminFree, treeStat, effectiveStatVal, effectiveStats])

  const flowEdges = useMemo(() => {
    if (!treeData?.edges) return []
    return treeData.edges.map(edge => {
      const ss = getNodeState(treeData.nodes.find(n => n.id === edge.source) ?? { id: '', tier: 1 })
      const ts = getNodeState(treeData.nodes.find(n => n.id === edge.target) ?? { id: '', tier: 1 })
      return {
        id: edge.id, source: edge.source, target: edge.target, type: 'dashed',
        zIndex: -1,
        data: {
          purchased: (ss === 'purchased' || ss === 'revocable') && (ts === 'purchased' || ts === 'revocable'),
          available: (ss === 'purchased' || ss === 'revocable') && ts !== 'locked' && ts !== 'blocked',
          blocked: ss === 'blocked' || ts === 'blocked',
          treeStat,
        },
      }
    })
  }, [treeData, character, treeStat, effectiveStatVal])

  const handleNodeClick = useCallback((_e, node) => { node.data?.onUnlock?.() }, [])

  // Tier info overlay — wszystkie tiery (2, 3, 4...)
  const allTierNums = treeData?.nodes?.length
    ? [...new Set(treeData.nodes.map(n => n.tier ?? 1))].sort((a,b) => a-b).filter(t => t > 1)
    : []

  return (
    <div style={{ width: '100%', height: '700px', background: '#0a0a0f', position: 'relative' }}>
      <ReactFlow nodes={flowNodes} edges={flowEdges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
        fitView fitViewOptions={{ padding: 0.15, nodes: (() => {
          const root = treeData?.nodes?.find(n => (n.requires ?? []).length === 0)
          return root ? [{ id: root.id }] : undefined
        })() }}
        nodesDraggable={false} nodesConnectable={false}
        onNodeClick={handleNodeClick} panOnScroll zoomOnScroll minZoom={0.3} maxZoom={1.5}
        nodeOrigin={[0.5, 0.5]}
        proOptions={{ hideAttribution: true }}>
        <Background color="#2a2a3a" gap={40} size={1} />
        <Controls showInteractive={false} style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)' }} />
      </ReactFlow>
      <div style={{ position: 'absolute', top: 8, right: 12, display: 'flex', flexDirection: 'column', gap: '4px', pointerEvents: 'none', zIndex: 10 }}>
        {adminFree && <div style={{ fontSize: '0.48rem', letterSpacing: '0.12em', color: '#4060a0', background: 'rgba(0,0,0,0.8)', padding: '2px 7px', border: '1px solid #2a3060' }}>ADMIN — klik = unlock / ↩ = cofnij wszystko</div>}
        {allTierNums.map(tier => {
          const thr = getTierThreshold(tier, treeStat, treeData)
          if (thr === undefined) return null
          const reached = effectiveStatVal >= thr
          return (
            <div key={tier} style={{ fontSize: '0.48rem', letterSpacing: '0.12em', color: reached ? '#60c080' : 'var(--color-bo-muted)', background: 'rgba(0,0,0,0.7)', padding: '2px 7px', border: '1px solid var(--color-bo-border)' }}>
              TIER {tier} — {treeStat.toUpperCase()} {reached ? `✓ (${effectiveStatVal})` : `${effectiveStatVal} / ${thr}`}
            </div>
          )
        })}
      </div>
    </div>
  )
}
