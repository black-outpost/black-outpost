import { useState, useMemo } from 'react'
import { useCharacter } from '../../hooks/useCharacter'
import { useSkillTrees } from '../../hooks/useSkillTrees'
import PageShell from '../../components/ui/PageShell'
import SkillTreeCanvas from '../../components/skill-tree/SkillTreeCanvas'
import { calcNDRFromReisen, calcSpentNDR, isTierUnlocked } from '../../data/skillTreeLogic'
import { calcEffectiveStats } from '../../data/statCalc'
import { TIER_THRESHOLDS } from '../../data/statThresholds'
import { getStatName } from '../../data/statDisplayNames'

const COMBAT_STATS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi']

export default function SkillTreeView() {
  const { character, loading: charLoading } = useCharacter()
  const { trees: globalTrees, loading: treesLoading } = useSkillTrees()
  const [active, setActive] = useState('strength')

  const nazoUnlocked = character?.nazoUnlocked ?? false
  const nazoName     = character?.nazoName ?? '???'
  const race         = character?.race ?? ''

  // Build nazo tree from character.nazoNodes
  const nazoTree = useMemo(() => ({
    stat:        'nazo',
    isDefault:   false,
    characterId: character?.id,
    nodes:       character?.nazoNodes ?? [],
    edges:       buildNazoEdges(character?.nazoNodes ?? []),
    thresholds:  character?.nazoThresholds ?? { 1: 0 },
  }), [character?.nazoNodes, character?.id, character?.nazoThresholds])

  function buildNazoEdges(nodes) {
    const edges = []
    for (const node of nodes) {
      for (const req of (node.requires ?? [])) {
        edges.push({ id: `ne_${req}__${node.id}`, source: req, target: node.id })
      }
    }
    return edges
  }

  // Merge global trees (Firestore > defaults) + nazo
  const allTrees = useMemo(() => ({ ...globalTrees, nazo: nazoTree }), [globalTrees, nazoTree])
  const treeData = allTrees[active]

  const totalNDRFromReisen = calcNDRFromReisen(character?.reisenAbsorbed ?? 0)
  const adminNDR           = character?.ndr ?? 0
  const spentNDR           = calcSpentNDR(character?.unlockedNodes ?? {})
  const availableNDR       = totalNDRFromReisen + adminNDR - spentNDR

  const tabs = [
    ...COMBAT_STATS.map(k => ({
      key:   k,
      label: getStatName(k, race) || k.toUpperCase(),
    })),
    { key: 'nazo', label: nazoUnlocked ? nazoName.toUpperCase() : '???' },
  ]

  if (charLoading || treesLoading) return (
    <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>
      LOADING...
    </div>
  )

  const tier2threshold = TIER_THRESHOLDS[active]?.[2]
  const { effective: effectiveStats } = calcEffectiveStats(character ?? {}, [], globalTrees)
  const statVal        = effectiveStats[active] ?? 0
  const tier2unlocked  = isTierUnlocked(2, active, character ?? {}, treeData)

  return (
    <PageShell title="SKILL TREES" subtitle="DEVELOPMENT PATHWAYS & NODE ACQUISITION">

      {/* NDR counter */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)' }}>
          NODE POINTS:
          <span style={{ color: availableNDR > 0 ? 'var(--color-bo-text)' : 'var(--color-bo-red)', fontSize: '0.82rem', marginLeft: '0.5rem', fontWeight: 700 }}>
            {availableNDR}
          </span>
          <span style={{ color: 'var(--color-bo-muted)', marginLeft: '0.35rem', fontSize: '0.55rem' }}>
            reisen: {totalNDRFromReisen} + admin: {adminNDR} − spent: {spentNDR}
          </span>
        </div>
        {active !== 'nazo' && tier2threshold !== undefined && (
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', color: tier2unlocked ? '#60c080' : 'var(--color-bo-muted)' }}>
            TIER 2: {tier2unlocked ? '✓ UNLOCKED' : `${statVal} / ${tier2threshold} ${active.toUpperCase()}`}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const isLocked = t.key === 'nazo' && !nazoUnlocked
          return (
            <button
              key={t.key}
              onClick={() => !isLocked && setActive(t.key)}
              style={{
                background: active === t.key ? 'rgba(220,50,50,0.15)' : 'var(--color-bo-surface)',
                border: '1px solid ' + (active === t.key ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'),
                color:   active === t.key ? 'var(--color-bo-red)' : isLocked ? 'var(--color-bo-border)' : 'var(--color-bo-text-dim)',
                padding: '0.4rem 0.85rem', fontSize: '0.62rem', letterSpacing: '0.15em',
                fontFamily: 'var(--font-body)', cursor: isLocked ? 'not-allowed' : 'pointer',
              }}
            >{t.label}</button>
          )
        })}
      </div>

      {/* Canvas */}
      {active === 'nazo' && !nazoUnlocked ? (
        <div style={{ border: '1px dashed var(--color-bo-border)', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bo-surface)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--color-bo-border)', marginBottom: '0.5rem' }}>???</div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)' }}>THIS PATH REMAINS HIDDEN</div>
          </div>
        </div>
      ) : treeData ? (
        <SkillTreeCanvas
          key={active}
          treeData={treeData}
          character={character ?? {}}
          allTrees={allTrees}
          readOnly={false}
          adminFree={false}
          onUnlocked={() => {}}
        />
      ) : (
        <div style={{ border: '1px solid var(--color-bo-border)', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)' }}>NO TREE DATA</span>
        </div>
      )}
    </PageShell>
  )
}
