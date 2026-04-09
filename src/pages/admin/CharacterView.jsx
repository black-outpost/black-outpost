import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, collection, onSnapshot, updateDoc, deleteDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import PageShell, { Card } from '../../components/ui/PageShell'
import IdentifierCard from '../../components/ui/IdentifierCard'
import NDRBreakdown from '../../components/ui/NDRBreakdown'
import StatMultiplierPanel from '../../components/ui/StatMultiplierPanel'
import TechMarkupRenderer from '../../components/ui/TechMarkupRenderer'
import SkillTreeCanvas from '../../components/skill-tree/SkillTreeCanvas'
import { useSkillTrees } from '../../hooks/useSkillTrees'
import PassiveEffectsPanel from '../../components/ui/PassiveEffectsPanel'
import { calcEffectiveStats } from '../../data/statCalc'
import { DEFAULT_SKILL_TREES } from '../../data/defaultSkillTrees'
import { logAdminAction } from '../../data/adminLog'
import { calcHP, calcRP, DEFAULT_HP_FORMULA, DEFAULT_RP_FORMULA } from '../../data/hpRpCalc'

const STAT_NAMES = {
  bujutsu:   { 'Soul Reaper':'Hakuda','Arrancar':'Hakuda','Quincy':'Hakuda','Fullbringer':'Hakuda',default:'Bujutsu' },
  bukijutsu: { 'Soul Reaper':'Zanjutsu','Arrancar':'Zanjutsu','Quincy':'Kyudo','Fullbringer':'Bukijutsu',default:'Bukijutsu' },
  tamashi:   { 'Soul Reaper':'Zanpakuto Mastery','Arrancar':'Zanpakuto Mastery','Quincy':'Blood Mastery','Fullbringer':'Fullbring Mastery',default:'Tamashi' },
}
function getStatName(stat, race) {
  const name = STAT_NAMES[stat]?.[race] ?? STAT_NAMES[stat]?.default ?? stat
  return name.toUpperCase()
}

function StatRow({ label, value = 0, bd }) {
  const [hover, setHover] = useState(false)
  const finalRaw = bd?.final ?? value
  const final    = Math.floor(finalRaw)
  const hasBonus = bd?.hasBonus
  const pct      = Math.round((Math.min(finalRaw, 500) / 500) * 100)

  function tooltipLines() {
    if (!bd || !hasBonus) return null
    const lines = ['Base: ' + bd.base]
    if ((bd.flat ?? 0) !== 0) {
      lines.push('Flat bonuses: ' + (bd.flat > 0 ? '+' : '') + bd.flat)
      for (const s of (bd.flatSources ?? [])) lines.push('  • ' + (s.value > 0 ? '+' : '') + s.value + ' from ' + s.source)
    }
    if ((bd.percent ?? 0) !== 0) {
      if ((bd.flat ?? 0) !== 0) lines.push('After flat: ' + bd.afterFlat)
      lines.push('Multipliers: ' + (bd.percent > 0 ? '+' : '') + bd.percent + '%')
      for (const s of (bd.percentSources ?? [])) lines.push('  • ' + (s.value > 0 ? '+' : '') + s.value + '% — ' + s.source)
    }
    const modeSrc = bd.modeSources ?? []
    if (modeSrc.length > 0) {
      lines.push('Mode multipliers:')
      for (const m of modeSrc) lines.push('  • ×' + m.factor + ' — ' + m.name)
    } else if ((bd.modeMultiplier ?? 1) !== 1) {
      lines.push('Mode multiplier: ×' + bd.modeMultiplier)
    }
    const precise = Number.isInteger(finalRaw) ? String(finalRaw) : finalRaw.toFixed(4).replace(/\.?0+$/, '')
    lines.push('Total: ' + final + ' (' + precise + ' exact)')
    return lines
  }
  const tipLines = tooltipLines()

  return (
    <div style={{ marginBottom: '0.9rem', position: 'relative' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', cursor: hasBonus ? 'help' : 'default' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--color-bo-text-dim)', borderBottom: hasBonus ? '1px dashed var(--color-bo-muted)' : 'none' }}>{label}</span>
        <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-display)', color: hasBonus ? '#60c080' : 'var(--color-bo-text)' }}>
          {final}
          {hasBonus && (bd.flat ?? 0) !== 0 && (
            <span style={{ fontSize: '0.6rem', color: 'var(--color-bo-red)', marginLeft: '4px' }}>
              ({value}{bd.flat > 0 ? '+' : ''}{bd.flat})
            </span>
          )}
        </span>
      </div>
      <div style={{ height: '2px', background: 'var(--color-bo-elevated)' }}>
        <div style={{ height: '100%', width: pct + '%', background: hasBonus ? '#60c080' : 'var(--color-bo-red)', opacity: final > 0 ? 1 : 0.2 }} />
      </div>
      {hover && tipLines && (
        <div style={{ position: 'absolute', right: 0, bottom: '100%', marginBottom: '6px', background: '#0a0a0f', border: '1px solid var(--color-bo-border)', padding: '0.55rem 0.75rem', zIndex: 50, boxShadow: '0 4px 20px rgba(0,0,0,0.6)', minWidth: '200px', pointerEvents: 'none' }}>
          {tipLines.map((line, i) => (
            <div key={i} style={{ fontSize: line.startsWith('Total') ? '0.65rem' : line.startsWith('  •') ? '0.6rem' : '0.65rem', color: line.startsWith('Total') ? '#60c080' : line.startsWith('  •') ? 'var(--color-bo-text-dim)' : 'var(--color-bo-text)', fontWeight: line.startsWith('Total') ? 700 : 400, lineHeight: 1.6, borderTop: line.startsWith('Total') ? '1px solid var(--color-bo-border)' : 'none', marginTop: line.startsWith('Total') ? '4px' : 0, paddingTop: line.startsWith('Total') ? '4px' : 0 }}>{line}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function DataRow({ label, value = 0, unit }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
      <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: 'var(--color-bo-text-dim)' }}>{label}</span>
      <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-display)', color: 'var(--color-bo-text)' }}>
        {value}{unit && <span style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', marginLeft: '3px' }}>{unit}</span>}
      </span>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
      <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)' }}>{label}</span>
      <span style={{ fontSize: '0.78rem', color: 'var(--color-bo-text)' }}>{value || '—'}</span>
    </div>
  )
}

const TABS = [
  { key: 'stats',       label: 'STATISTICS' },
  { key: 'multipliers', label: 'MULTIPLIERS' },
  { key: 'skill_trees', label: 'SKILL TREES' },
  { key: 'equipment',   label: 'EQUIPMENT' },
  { key: 'techniques',  label: 'TECHNIQUES' },
  { key: 'identifier',  label: 'IDENTIFIER CARD' },
  { key: 'history',     label: 'HISTORY & LORE' },
]

/* Admin skill tree view
 * Klik na węzeł:
 *   — available / admin_available (✦ niebieski) → unlock za darmo (bypass checks)
 *   — revocable (↩ pomarańczowy, pełny zakup)  → cofnij 1 zakup + stat bonusy
 *   — purchased częściowy (stat ×N)             → dokup 1 etap
 */
function AdminSkillTreeView({ char, globalTrees }) {
  const navigate = useNavigate()
  const [activeStat, setActiveStat] = useState('strength')

  const nazoTree = {
    stat: 'nazo', isDefault: false, characterId: char?.id,
    nodes: char?.nazoNodes ?? [],
    edges: (char?.nazoNodes ?? []).flatMap(n =>
      (n.requires ?? []).map(r => ({ id: 'ne_' + r + '__' + n.id, source: r, target: n.id }))
    ),
    thresholds: char?.nazoThresholds ?? { 1: 0 },
  }
  const allTrees = { ...globalTrees, nazo: nazoTree }
  const treeData  = allTrees[activeStat]

  const STAT_LABELS = {
    strength: 'STRENGTH', vitality: 'VITALITY', speed: 'SPEED', defense: 'DEFENSE',
    reiatsu: 'REIATSU', reiryoku: 'REIRYOKU', bujutsu: 'BUJUTSU', bukijutsu: 'BUKIJUTSU', tamashi: 'TAMASHI',
  }
  const nazoLabel = char?.nazoName?.toUpperCase() ?? '???'
  const currentTreeData = allTrees[activeStat]

  return (
    <div>
      <div style={{ marginBottom: '0.65rem', padding: '0.4rem 0.75rem', background: 'rgba(30,40,80,0.35)', border: '1px solid #2a3060', fontSize: '0.58rem', letterSpacing: '0.1em', color: '#6080c0', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <span>✦ <b style={{ color: '#80a0d0' }}>Niebieski</b> = tylko admin · ↩ <b style={{ color: '#e8c080' }}>Pomarańczowy</b> = cofnij · <b style={{ color: '#dc3232' }}>Czerwony</b> = wykupiony</span>
      </div>

      <div style={{ display: 'flex', gap: '2px', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.keys(STAT_LABELS).map(k => (
          <button key={k} onClick={() => setActiveStat(k)} style={{
            background: activeStat === k ? 'rgba(220,50,50,0.15)' : 'var(--color-bo-surface)',
            border: `1px solid ${activeStat === k ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`,
            color: activeStat === k ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)',
            padding: '0.35rem 0.7rem', fontSize: '0.58rem', letterSpacing: '0.15em',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>{STAT_LABELS[k]}</button>
        ))}
        {/* Nazo tab */}
        <button onClick={() => setActiveStat('nazo')} style={{
          background: activeStat === 'nazo' ? 'rgba(160,80,220,0.15)' : 'var(--color-bo-surface)',
          border: `1px solid ${activeStat === 'nazo' ? '#8840cc' : 'var(--color-bo-border)'}`,
          color: activeStat === 'nazo' ? '#c080ff' : char.nazoUnlocked ? '#8840cc' : 'var(--color-bo-muted)',
          padding: '0.35rem 0.7rem', fontSize: '0.58rem', letterSpacing: '0.15em',
          cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}>{nazoLabel}</button>
        {/* Button to nazo editor */}
        <button onClick={() => navigate('/admin/nazo/' + char.id)} style={{
          background: 'none', border: '1px solid var(--color-bo-border)',
          color: 'var(--color-bo-muted)',
          padding: '0.35rem 0.65rem', fontSize: '0.55rem', letterSpacing: '0.12em',
          cursor: 'pointer', fontFamily: 'var(--font-body)', marginLeft: '4px',
        }}>✎ EDYTOR NAZO</button>
      </div>

      {currentTreeData && (
        <SkillTreeCanvas
          key={activeStat + (char.id ?? '')}
          treeData={currentTreeData}
          character={char}
          allTrees={allTrees}
          readOnly={false}
          adminFree={true}
          onUnlocked={() => {}}
        />
      )}

      {/* Cheatsheet — max stats per tier vs gracz */}
      {currentTreeData?.nodes?.length > 0 && (() => {
        const nodes = currentTreeData.nodes
        const unlockedInTree = char.unlockedNodes?.[activeStat] ?? {}
        const tierMap = {}
        for (const n of nodes) {
          const tier = n.tier ?? 1
          if (!tierMap[tier]) tierMap[tier] = { max: {}, got: {} }
          if (n.type === 'stat') {
            for (const [stat, val] of Object.entries(n.statGrants ?? {})) {
              const maxVal = Number(val) * (n.maxPurchases ?? 1)
              const gotVal = Number(val) * Math.min(unlockedInTree[n.id] ?? 0, n.maxPurchases ?? 1)
              tierMap[tier].max[stat] = (tierMap[tier].max[stat] ?? 0) + maxVal
              tierMap[tier].got[stat] = (tierMap[tier].got[stat] ?? 0) + gotVal
            }
          }
        }
        const tiers = Object.keys(tierMap).map(Number).sort((a,b)=>a-b)
        if (tiers.every(t => Object.keys(tierMap[t].max).length === 0)) return null
        return (
          <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)' }}>
            <div style={{ fontSize: '0.48rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>TREE PROGRESS</div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {tiers.map(tier => {
                const entries = Object.entries(tierMap[tier].max)
                if (entries.length === 0) return null
                return (
                  <div key={tier}>
                    <div style={{ fontSize: '0.44rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>TIER {tier}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {entries.map(([stat, maxVal]) => {
                        const gotVal = tierMap[tier].got[stat] ?? 0
                        const pct = maxVal > 0 ? gotVal / maxVal : 0
                        const col = pct >= 1 ? '#60c080' : pct > 0 ? '#e0a000' : 'var(--color-bo-text-dim)'
                        return (
                          <span key={stat} style={{ fontSize: '0.6rem', color: col, background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', padding: '1px 6px', whiteSpace: 'nowrap' }}>
                            {stat}: {gotVal}/{maxVal}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {activeStat === 'nazo' && (!char.nazoNodes || char.nazoNodes.length === 0) && (
        <div style={{ border: '1px dashed var(--color-bo-border)', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bo-surface)' }}>
          <div style={{ textAlign: 'center', color: 'var(--color-bo-muted)', fontSize: '0.65rem', letterSpacing: '0.14em' }}>
            NAZO TREE PUSTY — wejdź w edytor żeby dodać węzły
          </div>
        </div>
      )}
    </div>
  )
}

function AdminTechRow({ tech, charStats }) {
  const [expanded, setExpanded] = useState(false)
  const [imgOk,    setImgOk]    = useState(false)

  return (
    <div style={{ border: '1px solid ' + (expanded ? 'var(--color-bo-muted)' : 'var(--color-bo-border)'), marginBottom: '3px', background: 'var(--color-bo-surface)', transition: 'border-color 0.15s' }}>
      <button onClick={() => setExpanded(e => !e)} style={{ width: '100%', background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'stretch', cursor: 'pointer', textAlign: 'left' }}>
        {tech.imageUrl && (
          <div style={{ width: '64px', flexShrink: 0, overflow: 'hidden', background: 'var(--color-bo-elevated)' }}>
            <img src={tech.imageUrl} alt="" onLoad={() => setImgOk(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: imgOk ? 'block' : 'none', minHeight: '64px' }} />
            {!imgOk && <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bo-border)', fontSize: '1.1rem' }}>◈</div>}
          </div>
        )}
        <div style={{ flex: 1, padding: '0.55rem 0.85rem', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            {tech.classification && <span style={{ fontSize: '0.5rem', letterSpacing: '0.12em', color: 'var(--color-bo-red)', background: 'rgba(220,50,50,0.08)', border: '1px solid var(--color-bo-red-dim)', padding: '1px 5px' }}>CLASS {tech.classification}</span>}
            {tech.stat && <span style={{ fontSize: '0.5rem', letterSpacing: '0.1em', color: '#5090d0', background: 'rgba(80,144,208,0.08)', border: '1px solid rgba(80,144,208,0.25)', padding: '1px 5px' }}>{tech.stat.toUpperCase()}</span>}
            {tech.origin && <span style={{ fontSize: '0.5rem', color: 'var(--color-bo-muted)', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', padding: '1px 5px' }}>{tech.origin}</span>}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-bo-text)', fontWeight: 600, lineHeight: 1.3 }}>{tech.name}</div>
          {!expanded && tech.description && (
            <div style={{ fontSize: '0.68rem', color: 'var(--color-bo-text-dim)', marginTop: '0.2rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {tech.description.replace(/\*\*(.*?)\*\*/g,'$1').replace(/\{[^|{}]+\|([^}]+)\}/g,'$1')}
            </div>
          )}
        </div>
        <div style={{ padding: '0.55rem 0.7rem', display: 'flex', alignItems: 'center', color: 'var(--color-bo-muted)', fontSize: '0.65rem', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</div>
      </button>
      {expanded && (
        <div style={{ padding: '0.7rem 0.85rem 0.85rem', borderTop: '1px solid var(--color-bo-border)' }}>
          {tech.imageUrl && (
            <div style={{ height: '160px', overflow: 'hidden', marginBottom: '0.75rem', border: '1px solid var(--color-bo-border)' }}>
              <img src={tech.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          {tech.description && <TechMarkupRenderer text={tech.description} stats={charStats} />}
          {tech.technicalDetails && (
            <div style={{ marginTop: '0.75rem', background: 'rgba(220,50,50,0.04)', border: '1px solid var(--color-bo-border)', borderLeft: '3px solid var(--color-bo-red-dim)', padding: '0.6rem 0.8rem' }}>
              <div style={{ fontSize: '0.52rem', letterSpacing: '0.18em', color: 'var(--color-bo-red)', marginBottom: '0.4rem' }}>TECHNICAL DETAILS</div>
              <TechMarkupRenderer text={tech.technicalDetails} stats={charStats} isTechDetails />
            </div>
          )}
        </div>
      )}
    </div>
  )
}


/* Admin: nadawanie efektów pasywnych ręcznie */
function AdminGrantPassive({ char }) {
  const { identifier: adminIdentifier, currentUser } = useAuth()
  const [show, setShow]     = useState(false)
  const [name, setName]     = useState('')
  const [desc, setDesc]     = useState('')
  const [src,  setSrc]      = useState('')
  const [saving, setSaving] = useState(false)

  const inp2 = {
    background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
    color: 'var(--color-bo-text)', padding: '0.35rem 0.5rem',
    fontSize: '0.72rem', fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box', outline: 'none',
  }

  async function handleGrant() {
    if (!name.trim() || !char?.id) return
    setSaving(true)
    const newEffect = {
      id:        'pe_' + Date.now(),
      name:      name.trim(),
      description: desc.trim(),
      source:    src.trim() || 'Admin Grant',
      grantedAt: Date.now(),
    }
    const current = char.passiveEffects ?? []
    try {
      await updateDoc(doc(db, 'characters', char.id), {
        passiveEffects: [...current, newEffect],
      })
      await logAdminAction({
        adminIdentifier, adminUid: currentUser?.uid ?? '',
        action: 'add_passive_effect',
        targetId: char.id,
        targetName: `${char.firstName ?? ''} ${char.lastName ?? ''} (${char.identifier ?? char.id})`,
        category: 'character',
        changes: [{ field: 'passiveEffects', before: null, after: newEffect.name }],
        note: `Opis: ${newEffect.description || '—'}`,
      })
      setName(''); setDesc(''); setSrc(''); setShow(false)
    } finally { setSaving(false) }
  }

  async function handleRemove(effectId) {
    if (!char?.id) return
    const effect = (char.passiveEffects ?? []).find(e => e.id === effectId)
    const updated = (char.passiveEffects ?? []).filter(e => e.id !== effectId)
    await updateDoc(doc(db, 'characters', char.id), { passiveEffects: updated })
    await logAdminAction({
      adminIdentifier, adminUid: currentUser?.uid ?? '',
      action: 'remove_passive_effect',
      targetId: char.id,
      targetName: `${char.firstName ?? ''} ${char.lastName ?? ''} (${char.identifier ?? char.id})`,
      category: 'character',
      changes: [{ field: 'passiveEffects', before: effect?.name ?? effectId, after: null }],
    })
  }

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <button onClick={() => setShow(s => !s)} style={{
        background: 'rgba(96,128,192,0.08)', border: '1px solid #2a3060',
        color: '#6080c0', padding: '0.35rem 0.85rem', fontSize: '0.58rem',
        letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)',
      }}>
        {show ? '▲ UKRYJ' : '+ NADAJ EFEKT PASYWNY'}
      </button>

      {show && (
        <div style={{ marginTop: '0.5rem', padding: '0.65rem 0.75rem', background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.5rem' }}>
            <div style={{ marginBottom: '0.4rem' }}>
              <label style={{ display: 'block', fontSize: '0.5rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', marginBottom: '0.2rem' }}>NAZWA EFEKTU</label>
              <input value={name} onChange={e => setName(e.target.value)} style={inp2} placeholder="np. Badacz" />
            </div>
            <div style={{ marginBottom: '0.4rem' }}>
              <label style={{ display: 'block', fontSize: '0.5rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', marginBottom: '0.2rem' }}>ŹRÓDŁO (opcjonalne)</label>
              <input value={src} onChange={e => setSrc(e.target.value)} style={inp2} placeholder="Admin Grant" />
            </div>
          </div>
          <div style={{ marginBottom: '0.4rem' }}>
            <label style={{ display: 'block', fontSize: '0.5rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', marginBottom: '0.2rem' }}>OPIS EFEKTU</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} style={{ ...inp2, resize: 'vertical' }} placeholder="Pełny opis efektu pasywnego. Obsługuje formuły: 0.2x[Strength]" />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => setShow(false)} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.35rem 0.75rem', fontSize: '0.58rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>ANULUJ</button>
            <button onClick={handleGrant} disabled={!name.trim() || saving} style={{ flex: 1, background: 'rgba(96,192,128,0.08)', border: '1px solid rgba(96,192,128,0.3)', color: '#60c080', padding: '0.35rem', fontSize: '0.58rem', letterSpacing: '0.1em', cursor: !name.trim() ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: !name.trim() ? 0.5 : 1 }}>
              {saving ? 'ZAPISYWANIE...' : '✓ NADAJ EFEKT'}
            </button>
          </div>

          {/* Lista istniejących admin-granted */}
          {(char?.passiveEffects ?? []).length > 0 && (
            <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--color-bo-border)', paddingTop: '0.5rem' }}>
              <div style={{ fontSize: '0.5rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.35rem' }}>NADANE EFEKTY</div>
              {(char.passiveEffects ?? []).map(e => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3px' }}>
                  <span style={{ flex: 1, fontSize: '0.65rem', color: 'var(--color-bo-text-dim)' }}>{e.name} <span style={{ fontSize: '0.55rem', color: 'var(--color-bo-muted)' }}>({e.source})</span></span>
                  <button onClick={() => handleRemove(e.id)} style={{ background: 'none', border: 'none', color: 'var(--color-bo-red)', cursor: 'pointer', fontSize: '0.7rem', padding: '0 2px' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


/* ── Admin Modes Panel ───────────────────────────────────────────────────── */
const STAT_KEYS_MODE = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']

function AdminModePanel({ char }) {
  const { identifier: adminIdentifier, currentUser } = useAuth()
  const [show,    setShow]    = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [modeName,setModeName]= useState('')
  const [modeDesc,setModeDesc]= useState('')
  const [mults,   setMults]   = useState([{ stat: 'vitality', factor: '1' }])

  const mi = { background:'var(--color-bo-elevated)', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-text)', padding:'0.32rem 0.45rem', fontSize:'0.68rem', fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' }

  async function handleAdd() {
    if (!modeName.trim() || !char?.id) return
    setSaving(true)
    const newMode = {
      id: 'mode_' + Date.now(),
      name: modeName.trim(),
      description: modeDesc.trim(),
      active: false,
      multipliers: mults.filter(m => m.factor !== '').map(m => ({ stat: m.stat, factor: parseFloat(m.factor) || 1 })),
    }
    const updated = [...(char.modes ?? []), newMode]
    try {
      await updateDoc(doc(db, 'characters', char.id), { modes: updated })
      await logAdminAction({ adminIdentifier, adminUid: currentUser?.uid ?? '', action: 'add_mode', targetId: char.id, targetName: `${char.firstName ?? ''} ${char.lastName ?? ''} (${char.identifier ?? char.id})`, category: 'character', changes: [{ field: 'modes', before: null, after: newMode.name }] })
      setModeName(''); setModeDesc(''); setMults([{ stat: 'vitality', factor: '1' }]); setShow(false)
    } finally { setSaving(false) }
  }

  async function handleToggle(modeId) {
    const mode = (char.modes ?? []).find(m => m.id === modeId)
    if (!mode || !char?.id) return
    const updated = (char.modes ?? []).map(m => m.id === modeId ? { ...m, active: !m.active } : m)
    await updateDoc(doc(db, 'characters', char.id), { modes: updated })
  }

  async function handleRemove(modeId) {
    if (!char?.id) return
    const mode = (char.modes ?? []).find(m => m.id === modeId)
    const updated = (char.modes ?? []).filter(m => m.id !== modeId)
    await updateDoc(doc(db, 'characters', char.id), { modes: updated })
    await logAdminAction({ adminIdentifier, adminUid: currentUser?.uid ?? '', action: 'remove_mode', targetId: char.id, targetName: `${char.firstName ?? ''} ${char.lastName ?? ''} (${char.identifier ?? char.id})`, category: 'character', changes: [{ field: 'modes', before: mode?.name ?? modeId, after: null }] })
  }

  const modes = char?.modes ?? []
  return (
    <div style={{ marginTop: '0.75rem' }}>
      {/* Lista aktywnych mode'ów */}
      {modes.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          {modes.map(mode => (
            <div key={mode.id} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.4rem 0.65rem', background:'var(--color-bo-surface)', border:'1px solid var(--color-bo-border)', marginBottom:'2px' }}>
              {/* Toggle */}
              <button
                onClick={() => handleToggle(mode.id)}
                title={mode.active ? 'Aktywny — kliknij by wyłączyć' : 'Nieaktywny — kliknij by włączyć'}
                style={{ flexShrink:0, width:34, height:18, borderRadius:9, background: mode.active ? '#60c080' : 'var(--color-bo-muted)', border:'none', cursor:'pointer', position:'relative', transition:'background 0.2s' }}
              >
                <span style={{ position:'absolute', top:2, left: mode.active ? 18 : 2, width:14, height:14, borderRadius:'50%', background:'white', transition:'left 0.2s' }} />
              </button>
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ fontSize:'0.72rem', color: mode.active ? '#60c080' : 'var(--color-bo-text-dim)', fontWeight:600 }}>{mode.name}</span>
                {mode.multipliers?.length > 0 && (
                  <span style={{ fontSize:'0.55rem', color:'var(--color-bo-muted)', marginLeft:'0.5rem' }}>
                    {mode.multipliers.map(m => `${m.stat} ×${m.factor}`).join(', ')}
                  </span>
                )}
                {mode.description && <div style={{ fontSize:'0.58rem', color:'var(--color-bo-muted)' }}>{mode.description}</div>}
              </div>
              <button onClick={() => handleRemove(mode.id)} style={{ background:'none', border:'none', color:'var(--color-bo-red)', cursor:'pointer', fontSize:'0.8rem', padding:'0 2px' }}>×</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setShow(s => !s)} style={{ background:'rgba(96,128,192,0.08)', border:'1px solid #2a3060', color:'#6080c0', padding:'0.35rem 0.85rem', fontSize:'0.58rem', letterSpacing:'0.12em', cursor:'pointer', fontFamily:'var(--font-body)' }}>
        {show ? '▲ UKRYJ' : '+ DODAJ MODE'}
      </button>

      {show && (
        <div style={{ marginTop:'0.5rem', padding:'0.65rem 0.75rem', background:'var(--color-bo-surface)', border:'1px solid var(--color-bo-border)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 0.5rem', marginBottom:'0.4rem' }}>
            <div><label style={{ display:'block', fontSize:'0.48rem', letterSpacing:'0.14em', color:'var(--color-bo-muted)', marginBottom:2 }}>NAZWA MODE</label><input value={modeName} onChange={e=>setModeName(e.target.value)} style={{ ...mi, width:'100%' }} placeholder="np. Bankai" /></div>
            <div><label style={{ display:'block', fontSize:'0.48rem', letterSpacing:'0.14em', color:'var(--color-bo-muted)', marginBottom:2 }}>OPIS (opcjonalny)</label><input value={modeDesc} onChange={e=>setModeDesc(e.target.value)} style={{ ...mi, width:'100%' }} /></div>
          </div>
          <div style={{ marginBottom:'0.5rem' }}>
            <label style={{ display:'block', fontSize:'0.48rem', letterSpacing:'0.14em', color:'var(--color-bo-muted)', marginBottom:'0.3rem' }}>FINALNE MNOŻNIKI (po wszystkich flat i % bonusach)</label>
            {mults.map((m, i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 100px auto', gap:'0.3rem', marginBottom:'0.3rem', alignItems:'center' }}>
                <select value={m.stat} onChange={e=>setMults(prev=>prev.map((x,j)=>j===i?{...x,stat:e.target.value}:x))} style={{ ...mi, width:'100%' }}>
                  {STAT_KEYS_MODE.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="number" step="0.01" value={m.factor} onChange={e=>setMults(prev=>prev.map((x,j)=>j===i?{...x,factor:e.target.value}:x))} style={{ ...mi, width:'100%' }} placeholder="np. 2.0" />
                <button onClick={()=>setMults(prev=>prev.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'var(--color-bo-muted)', cursor:'pointer', fontSize:'0.85rem' }}>✕</button>
              </div>
            ))}
            <button type="button" onClick={()=>setMults(prev=>[...prev,{stat:'vitality',factor:'1'}])} style={{ background:'none', border:'1px dashed var(--color-bo-border)', color:'var(--color-bo-muted)', padding:'0.2rem', fontSize:'0.58rem', cursor:'pointer', fontFamily:'var(--font-body)', width:'100%' }}>+ ADD MULTIPLIER</button>
          </div>
          <div style={{ fontSize:'0.52rem', color:'var(--color-bo-muted)', marginBottom:'0.5rem' }}>Np. mnożnik 2.0 dla vitality = finalny vitality ×2. Mode można włączać/wyłączać po dodaniu.</div>
          <div style={{ display:'flex', gap:'0.4rem' }}>
            <button onClick={()=>setShow(false)} style={{ background:'none', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-muted)', padding:'0.35rem 0.75rem', fontSize:'0.58rem', cursor:'pointer', fontFamily:'var(--font-body)' }}>ANULUJ</button>
            <button onClick={handleAdd} disabled={!modeName.trim()||saving} style={{ flex:1, background:'rgba(96,192,128,0.08)', border:'1px solid rgba(96,192,128,0.3)', color:'#60c080', padding:'0.35rem', fontSize:'0.58rem', letterSpacing:'0.1em', cursor:!modeName.trim()?'not-allowed':'pointer', fontFamily:'var(--font-body)', opacity:!modeName.trim()?0.5:1 }}>
              {saving?'ZAPISYWANIE...':'✓ DODAJ MODE'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── HP / RP Formula Editor (admin) ─────────────────────────────────────── */
function AdminHpRpPanel({ char }) {
  const [hpF, setHpF] = useState(char?.hpFormula ?? '')
  const [rpF, setRpF] = useState(char?.rpFormula ?? '')
  const [saving, setSaving] = useState(false)
  const mi = { background:'var(--color-bo-elevated)', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-text)', padding:'0.32rem 0.45rem', fontSize:'0.68rem', fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box', width:'100%' }

  useEffect(() => {
    setHpF(char?.hpFormula ?? '')
    setRpF(char?.rpFormula ?? '')
  }, [char?.id])

  async function save() {
    if (!char?.id) return
    setSaving(true)
    try {
      await updateDoc(doc(db, 'characters', char.id), {
        hpFormula: hpF.trim() || null,
        rpFormula: rpF.trim() || null,
      })
    } finally { setSaving(false) }
  }

  return (
    <div style={{ marginTop:'0.75rem', padding:'0.65rem 0.75rem', background:'var(--color-bo-surface)', border:'1px solid var(--color-bo-border)' }}>
      <div style={{ fontSize:'0.5rem', letterSpacing:'0.18em', color:'var(--color-bo-muted)', marginBottom:'0.5rem' }}>HP / RP FORMULAS</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 0.5rem', marginBottom:'0.4rem' }}>
        <div><label style={{ display:'block', fontSize:'0.48rem', letterSpacing:'0.14em', color:'var(--color-bo-muted)', marginBottom:2 }}>HEALTH POINTS (domyślnie: 1x[Vitality])</label><input value={hpF} onChange={e=>setHpF(e.target.value)} style={mi} placeholder="1x[Vitality]" /></div>
        <div><label style={{ display:'block', fontSize:'0.48rem', letterSpacing:'0.14em', color:'var(--color-bo-muted)', marginBottom:2 }}>REIATSU POINTS (domyślnie: 1x[Reiatsu])</label><input value={rpF} onChange={e=>setRpF(e.target.value)} style={mi} placeholder="1x[Reiatsu]" /></div>
      </div>
      <button onClick={save} disabled={saving} style={{ background:'rgba(220,50,50,0.08)', border:'1px solid var(--color-bo-red-dim)', color:'var(--color-bo-red)', padding:'0.32rem 0.85rem', fontSize:'0.58rem', letterSpacing:'0.1em', cursor:'pointer', fontFamily:'var(--font-body)' }}>
        {saving ? 'ZAPISYWANIE...' : 'ZAPISZ FORMUŁY'}
      </button>
    </div>
  )
}


/* ── Admin Items Tab — edit/delete per-character items ──────────────────── */
function AdminItemsTab({ char, items, charId, effectiveStats }) {
  const { identifier: adminIdentifier, currentUser } = useAuth()
  const [equipmentTypes, setEquipmentTypes] = useState([])
  const [expandedId,  setExpandedId]  = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [form,        setForm]        = useState({})
  const [saving,      setSaving]      = useState(false)

  useEffect(() => {
    getDocs(collection(db, 'equipmentTypes')).then(snap =>
      setEquipmentTypes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
  }, [])

  function startEdit(item) {
    setEditingItem(item.id)
    setExpandedId(item.id)
    setForm({
      name: item.name ?? '',
      rank: item.rank ?? '',
      description: item.description ?? '',
      imageUrl: item.imageUrl ?? '',
      quantity: item.quantity ?? 1,
      equipmentTypeId: item.equipmentTypeId ?? '',
    })
  }

  async function saveEdit() {
    if (!editingItem) return
    setSaving(true)
    try {
      const item = items.find(i => i.id === editingItem)
      const data = { name: form.name.trim() }
      if (form.rank?.trim())        data.rank            = form.rank.trim()
      if (form.description?.trim()) data.description     = form.description.trim()
      if (form.imageUrl?.trim())    data.imageUrl        = form.imageUrl.trim()
      if (item?.itemType !== 'equipment') data.quantity = Number(form.quantity)
      if (item?.itemType === 'equipment') data.equipmentTypeId = form.equipmentTypeId || null
      await updateDoc(doc(db, 'characters', charId, 'items', editingItem), data)
      const targetName = `${char?.firstName ?? ''} ${char?.lastName ?? ''} (${char?.identifier ?? charId})`
      await logAdminAction({
        adminIdentifier, adminUid: currentUser?.uid ?? '',
        action: 'edit_character_item',
        targetId: charId,
        targetName,
        category: 'item',
        note: `Item: ${data.name ?? item?.name ?? editingItem}`,
        changes: Object.entries(data).map(([field, after]) => ({ field, before: item?.[field] ?? null, after })),
      })
      setEditingItem(null)
    } finally { setSaving(false) }
  }

  async function removeItem(itemId) {
    if (!window.confirm('Remove this item?')) return
    const item = items.find(i => i.id === itemId)
    await deleteDoc(doc(db, 'characters', charId, 'items', itemId))
    await logAdminAction({
      adminIdentifier, adminUid: currentUser?.uid ?? '',
      action: 'delete_character_item',
      targetId: charId,
      targetName: `${char?.firstName ?? ''} ${char?.lastName ?? ''} (${char?.identifier ?? charId})`,
      category: 'item',
      changes: [{ field: 'item', before: item?.name ?? itemId, after: null }],
    })
    if (editingItem === itemId) setEditingItem(null)
    if (expandedId  === itemId) setExpandedId(null)
  }

  const mi = { background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '0.35rem 0.5rem', fontSize: '0.72rem', fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box', outline: 'none' }
  const lbl = (text) => <label style={{ fontSize: '0.46rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', display: 'block', marginBottom: 2 }}>{text}</label>

  // Slot counts
  const equippedCountByType = {}
  let handSlotsUsed = 0
  for (const item of items.filter(i => i.equipped && i.itemType === 'equipment')) {
    equippedCountByType[item.equipmentTypeId] = (equippedCountByType[item.equipmentTypeId] ?? 0) + 1
    const td = equipmentTypes.find(t => t.id === item.equipmentTypeId)
    handSlotsUsed += td?.handSlots ?? 0
  }

  const equipItems  = items.filter(i => i.itemType === 'equipment')
  const simpleItems = items.filter(i => i.itemType !== 'equipment')

  function ItemRow({ item }) {
    const isExpanded = expandedId === item.id
    const isEditing  = editingItem === item.id
    const typeName   = equipmentTypes.find(t => t.id === item.equipmentTypeId)?.name
    const bonuses    = (item.statBonuses ?? []).filter(b => b.flat || b.percent)

    return (
      <div style={{ border: '1px solid ' + (isExpanded ? 'var(--color-bo-muted)' : 'var(--color-bo-border)'), marginBottom: '3px', background: isEditing ? 'rgba(220,50,50,0.04)' : 'var(--color-bo-surface)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', cursor: 'pointer' }}
          onClick={() => { if (!isEditing) setExpandedId(isExpanded ? null : item.id) }}>
          <div style={{ width: 26, height: 26, flexShrink: 0, background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: item.equipped ? 'var(--color-bo-red)' : 'var(--color-bo-muted)' }}>
            {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (item.itemType === 'equipment' ? '⚔' : '◻')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-bo-text)', fontWeight: item.equipped ? 600 : 400 }}>
              {item.name}
              {item.rank && <span style={{ marginLeft: 5, fontSize: '0.58rem', color: '#d4a840' }}>({item.rank})</span>}
              {item.equipped && <span style={{ marginLeft: 6, fontSize: '0.5rem', color: 'var(--color-bo-red)', border: '1px solid var(--color-bo-red-dim)', padding: '0 3px' }}>EQUIPPED</span>}
            </div>
            <div style={{ fontSize: '0.58rem', color: 'var(--color-bo-muted)', display: 'flex', gap: '0.35rem', marginTop: 1, flexWrap: 'wrap' }}>
              {typeName && <span style={{ color: 'var(--color-bo-text-dim)' }}>{typeName}</span>}
              {item.itemType !== 'equipment' && (item.quantity ?? 1) > 1 && <span>×{item.quantity}</span>}
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); isEditing ? setEditingItem(null) : startEdit(item) }} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.22rem 0.45rem', fontSize: '0.58rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{isEditing ? 'CANCEL' : '✎'}</button>
          <button onClick={e => { e.stopPropagation(); removeItem(item.id) }} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-red)', padding: '0.22rem 0.45rem', fontSize: '0.58rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>✕</button>
          <span style={{ color: 'var(--color-bo-muted)', fontSize: '0.55rem', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
        </div>

        {/* Expanded — read view */}
        {isExpanded && !isEditing && (
          <div style={{ padding: '0 0.75rem 0.7rem', borderTop: '1px solid var(--color-bo-border)' }}>
            {item.imageUrl && (
              <div style={{ height: 120, overflow: 'hidden', margin: '0.5rem 0', border: '1px solid var(--color-bo-border)' }}>
                <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            {item.description && (
              <div style={{ marginTop: '0.5rem' }}>
                <TechMarkupRenderer text={item.description} stats={effectiveStats ?? {}} />
              </div>
            )}
            {bonuses.length > 0 && (
              <div style={{ marginTop: '0.4rem', borderTop: item.description ? '1px solid var(--color-bo-border)' : 'none', paddingTop: item.description ? '0.4rem' : 0 }}>
                <div style={{ fontSize: '0.5rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>BONUSES</div>
                {bonuses.map((b, i) => (
                  <div key={i} style={{ fontSize: '0.68rem', color: item.equipped ? '#60c080' : 'var(--color-bo-text-dim)', lineHeight: 1.5 }}>
                    {b.flat    ? `${b.flat    > 0 ? '+' : ''}${b.flat} ${b.stat} ` : ''}
                    {b.percent ? `${b.percent > 0 ? '+' : ''}${b.percent}% ${b.stat}` : ''}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit form */}
        {isExpanded && isEditing && (
          <div style={{ padding: '0 0.75rem 0.75rem', borderTop: '1px solid var(--color-bo-border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 0.5rem', marginTop: '0.4rem' }}>
            <div>{lbl('NAME')}<input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={mi} /></div>
            <div>{lbl('RANK')}<input value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))} style={mi} placeholder="A, S…" /></div>
            {item.itemType !== 'equipment' && <div>{lbl('QUANTITY')}<input type="number" min={1} value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} style={{ ...mi, width: '80px' }} /></div>}
            {item.itemType === 'equipment' && equipmentTypes.length > 0 && (
              <div style={{ gridColumn: 'span 2' }}>
                {lbl('EQUIPMENT TYPE (SLOT)')}
                <select value={form.equipmentTypeId} onChange={e => setForm(f => ({ ...f, equipmentTypeId: e.target.value }))} style={mi}>
                  <option value="">— none —</option>
                  {equipmentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            )}
            <div style={{ gridColumn: 'span 2' }}>
              {lbl('DESCRIPTION')}
              <textarea value={form.description}
                onChange={e => { setForm(f => ({ ...f, description: e.target.value })); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
                onFocus={e => { e.target.style.height = 'auto'; e.target.style.height = Math.max(e.target.scrollHeight, 60) + 'px' }}
                rows={3} style={{ ...mi, resize: 'none', overflow: 'hidden', minHeight: '60px' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>{lbl('IMAGE URL')}<input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} style={mi} /></div>
            <div style={{ gridColumn: 'span 2' }}>
              <button onClick={saveEdit} disabled={saving} style={{ width: '100%', background: 'rgba(96,192,128,0.1)', border: '1px solid rgba(96,192,128,0.3)', color: '#60c080', padding: '0.38rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {saving ? 'SAVING...' : '✓ SAVE CHANGES'}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (items.length === 0) return (
    <div style={{ border: '1px dashed var(--color-bo-border)', padding: '3rem 2rem', textAlign: 'center', background: 'var(--color-bo-surface)' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>NO ITEMS ASSIGNED</div>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div>
        <div style={{ fontSize: '0.52rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>EQUIPMENT ({equipItems.length})</div>
        {equipItems.length === 0 ? <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.65rem', padding: '0.5rem 0' }}>NONE</div> : equipItems.map(item => <ItemRow key={item.id} item={item} />)}

        {/* Slot status */}
        {equipmentTypes.length > 0 && equipItems.length > 0 && (
          <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.7rem', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)' }}>
            <div style={{ fontSize: '0.5rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>SLOT STATUS</div>
            {/* Hands */}
            {equipmentTypes.some(t => (t.handSlots ?? 0) > 0) && (
              <div style={{ marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-bo-text-dim)' }}>Hands</span>
                  <span style={{ fontSize: '0.6rem', color: handSlotsUsed >= 2 ? 'var(--color-bo-red)' : 'var(--color-bo-muted)' }}>{handSlotsUsed}/2</span>
                </div>
                <div style={{ height: '3px', background: 'var(--color-bo-surface)' }}><div style={{ height: '100%', width: Math.min(100, handSlotsUsed * 50) + '%', background: handSlotsUsed >= 2 ? 'var(--color-bo-red)' : '#60a0c0', transition: 'width 0.3s' }} /></div>
              </div>
            )}
            {/* Non-hand slots */}
            {equipmentTypes.filter(t => (t.handSlots ?? 0) === 0).map(type => {
              const count = equippedCountByType[type.id] ?? 0
              const pct   = Math.min(100, Math.round(count / type.limit * 100))
              return (
                <div key={type.id} style={{ marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--color-bo-text-dim)' }}>{type.name}</span>
                    <span style={{ fontSize: '0.6rem', color: count >= type.limit ? 'var(--color-bo-red)' : 'var(--color-bo-muted)' }}>{count}/{type.limit}</span>
                  </div>
                  <div style={{ height: '3px', background: 'var(--color-bo-surface)' }}><div style={{ height: '100%', width: pct + '%', background: count >= type.limit ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', transition: 'width 0.3s' }} /></div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '0.52rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>INVENTORY ({simpleItems.length})</div>
        {simpleItems.length === 0 ? <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.65rem', padding: '0.5rem 0' }}>NONE</div> : simpleItems.map(item => <ItemRow key={item.id} item={item} />)}
      </div>
    </div>
  )
}

/* ── Admin Tech Tab — view/edit/delete per-character techniques ─────────── */
function AdminTechTab({ char, techniques, charId, charStats }) {
  const { identifier: adminIdentifier, currentUser } = useAuth()
  const [expandedId, setExpandedId] = useState(null)
  const [editingTech, setEditingTech] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  function startEdit(tech) {
    setEditingTech(tech.id)
    setExpandedId(tech.id)
    setForm({ name: tech.name ?? '', origin: tech.origin ?? '', description: tech.description ?? '', technicalDetails: tech.technicalDetails ?? '', imageUrl: tech.imageUrl ?? '' })
  }

  async function saveEdit() {
    if (!editingTech) return
    setSaving(true)
    const tech = techniques.find(t => t.id === editingTech)
    try {
      const data = {
        name: form.name.trim(),
        origin: form.origin.trim() || null,
        description: form.description.trim(),
        technicalDetails: form.technicalDetails.trim(),
        imageUrl: form.imageUrl.trim() || null,
      }
      await updateDoc(doc(db, 'characters', charId, 'techniques', editingTech), data)
      await logAdminAction({
        adminIdentifier, adminUid: currentUser?.uid ?? '',
        action: 'edit_technique',
        targetId: charId,
        targetName: `${char?.firstName ?? ''} ${char?.lastName ?? ''} (${char?.identifier ?? charId})`,
        category: 'technique',
        note: `Technika: ${data.name}`,
        changes: Object.entries(data).map(([field, after]) => ({ field, before: tech?.[field] ?? null, after })),
      })
      setEditingTech(null)
    } finally { setSaving(false) }
  }

  async function removeTech(techId) {
    if (!window.confirm('Usunąć tę technikę?')) return
    const tech = techniques.find(t => t.id === techId)
    await deleteDoc(doc(db, 'characters', charId, 'techniques', techId))
    await logAdminAction({
      adminIdentifier, adminUid: currentUser?.uid ?? '',
      action: 'delete_technique',
      targetId: charId,
      targetName: `${char?.firstName ?? ''} ${char?.lastName ?? ''} (${char?.identifier ?? charId})`,
      category: 'technique',
      changes: [{ field: 'technique', before: tech?.name ?? techId, after: null }],
    })
    if (editingTech === techId) setEditingTech(null)
    if (expandedId === techId) setExpandedId(null)
  }

  const mi = { background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '0.35rem 0.5rem', fontSize: '0.72rem', fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box', outline: 'none' }

  if (techniques.length === 0) return (
    <div style={{ border: '1px dashed var(--color-bo-border)', padding: '3rem 2rem', textAlign: 'center', background: 'var(--color-bo-surface)' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>NO TECHNIQUES REGISTERED</div>
    </div>
  )

  return (
    <div>
      {[...techniques].sort((a, b) => a.name.localeCompare(b.name)).map(tech => {
        const isExpanded = expandedId === tech.id
        const isEditing  = editingTech === tech.id
        return (
          <div key={tech.id} style={{ border: '1px solid ' + (isExpanded ? 'var(--color-bo-muted)' : 'var(--color-bo-border)'), marginBottom: '3px', background: isEditing ? 'rgba(220,50,50,0.04)' : 'var(--color-bo-surface)' }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.85rem', cursor: 'pointer' }} onClick={() => { setExpandedId(isExpanded ? null : tech.id); if (isEditing && isExpanded) setEditingTech(null) }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', fontWeight: 600 }}>
                  {tech.name}
                  {tech.classification && <span style={{ marginLeft: 6, fontSize: '0.55rem', color: 'var(--color-bo-red)', border: '1px solid var(--color-bo-red-dim)', padding: '0 4px', letterSpacing: '0.1em' }}>CLASS {tech.classification}</span>}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', display: 'flex', gap: '0.4rem', marginTop: 1 }}>
                  {tech.stat && <span>{tech.stat.toUpperCase()}</span>}
                  {tech.origin && <span>{tech.origin}</span>}
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); startEdit(tech) }} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.25rem 0.5rem', fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>✎</button>
              <button onClick={e => { e.stopPropagation(); removeTech(tech.id) }} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-red)', padding: '0.25rem 0.5rem', fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>✕</button>
              <span style={{ color: 'var(--color-bo-muted)', fontSize: '0.6rem' }}>{isExpanded ? '▲' : '▼'}</span>
            </div>

            {/* Expanded — read mode */}
            {isExpanded && !isEditing && (
              <div style={{ padding: '0 0.85rem 0.85rem', borderTop: '1px solid var(--color-bo-border)' }}>
                {tech.imageUrl && (
                  <div style={{ height: 120, overflow: 'hidden', marginBottom: '0.6rem', marginTop: '0.6rem', border: '1px solid var(--color-bo-border)' }}>
                    <img src={tech.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                {tech.description && (
                  <div style={{ marginTop: '0.6rem' }}>
                    <TechMarkupRenderer text={tech.description} stats={charStats ?? {}} />
                  </div>
                )}
                {tech.technicalDetails && (
                  <div style={{ marginTop: '0.5rem', background: 'rgba(220,50,50,0.04)', borderLeft: '3px solid var(--color-bo-red-dim)', padding: '0.5rem 0.7rem' }}>
                    <div style={{ fontSize: '0.5rem', letterSpacing: '0.18em', color: 'var(--color-bo-red)', marginBottom: '0.3rem' }}>TECHNICAL DETAILS</div>
                    <TechMarkupRenderer text={tech.technicalDetails} stats={charStats ?? {}} isTechDetails />
                  </div>
                )}
              </div>
            )}

            {/* Edit mode */}
            {isExpanded && isEditing && (
              <div style={{ padding: '0 0.85rem 0.75rem', borderTop: '1px solid var(--color-bo-border)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ marginTop: '0.5rem' }}><label style={{ fontSize: '0.46rem', color: 'var(--color-bo-muted)', display: 'block', marginBottom: 2 }}>NAZWA</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={mi} /></div>
                <div><label style={{ fontSize: '0.46rem', color: 'var(--color-bo-muted)', display: 'block', marginBottom: 2 }}>ORIGIN (node / ability name)</label><input value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))} style={mi} placeholder="np. Brutal Force" /></div>
                <div><label style={{ fontSize: '0.46rem', color: 'var(--color-bo-muted)', display: 'block', marginBottom: 2 }}>IMAGE URL</label><input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} style={mi} placeholder="https://..." /></div>
                <div><label style={{ fontSize: '0.46rem', color: 'var(--color-bo-muted)', display: 'block', marginBottom: 2 }}>OPIS</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...mi, resize: 'vertical' }} /></div>
                <div><label style={{ fontSize: '0.46rem', color: 'var(--color-bo-muted)', display: 'block', marginBottom: 2 }}>SZCZEGÓŁY TECHNICZNE</label><textarea value={form.technicalDetails} onChange={e => setForm(f => ({ ...f, technicalDetails: e.target.value }))} rows={2} style={{ ...mi, resize: 'vertical' }} /></div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => setEditingTech(null)} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.38rem 0.7rem', fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>ANULUJ</button>
                  <button onClick={saveEdit} disabled={saving} style={{ flex: 1, background: 'rgba(96,192,128,0.1)', border: '1px solid rgba(96,192,128,0.3)', color: '#60c080', padding: '0.38rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    {saving ? 'ZAPISYWANIE...' : '✓ ZAPISZ ZMIANY'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CharacterView() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { trees: globalTrees } = useSkillTrees()
  const [char,    setChar]    = useState(null)
  const [items,      setItems]      = useState([])
  const [techniques, setTechniques] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('stats')

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(doc(db, 'characters', id), snap => {
      if (snap.exists()) setChar({ id: snap.id, ...snap.data() })
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [id])

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(collection(db, 'characters', id, 'items'),
      snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [id])

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(collection(db, 'characters', id, 'techniques'),
      snap => setTechniques(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [id])

  if (loading) return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>
  if (!char)   return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>CHARACTER NOT FOUND</div>

  const race = char.race ?? ''
  const s    = char.stats ?? {}
  const { effective, breakdown } = calcEffectiveStats(char, items, globalTrees)

  return (
    <PageShell title={'VIEW: ' + char.identifier} subtitle="ADMIN CHARACTER OVERVIEW">
      <div style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid var(--color-bo-red-dim)', padding: '0.5rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'var(--color-bo-red)' }}>▲ ADMIN VIEW</span>
        <button onClick={() => navigate('/admin/edit/' + id)} style={{ background: 'none', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.3rem 0.85rem', fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>✎ EDIT</button>
      </div>

      <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ background: tab === t.key ? 'rgba(220,50,50,0.15)' : 'var(--color-bo-surface)', border: '1px solid ' + (tab === t.key ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: tab === t.key ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.4rem 1rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{t.label}</button>
        ))}
      </div>

      {tab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
          <div><Card title="COMBAT STATISTICS">
            <StatRow label="STRENGTH"                       value={s.strength}  bd={breakdown.strength}  />
            <StatRow label="VITALITY"                       value={s.vitality}  bd={breakdown.vitality}  />
            <StatRow label="SPEED"                          value={s.speed}     bd={breakdown.speed}     />
            <StatRow label="DEFENSE"                        value={s.defense}   bd={breakdown.defense}   />
            <StatRow label="REIATSU"                        value={s.reiatsu}   bd={breakdown.reiatsu}   />
            <StatRow label="REIRYOKU"                       value={s.reiryoku}  bd={breakdown.reiryoku}  />
            <StatRow label={getStatName('bujutsu',   race)} value={s.bujutsu}   bd={breakdown.bujutsu}   />
            <StatRow label={getStatName('bukijutsu', race)} value={s.bukijutsu} bd={breakdown.bukijutsu} />
            <StatRow label={getStatName('tamashi',   race)} value={s.tamashi}   bd={breakdown.tamashi}   />
            <StatRow label={char.nazoUnlocked ? (char.nazoName ?? '???').toUpperCase() : '???'} value={s.nazo} bd={breakdown.nazo} />
          </Card>
          <PassiveEffectsPanel character={char} allTrees={{ ...globalTrees, nazo: { stat: 'nazo', nodes: char?.nazoNodes ?? [], edges: [] } }} effectiveStats={effective} isAdmin={true} />
          <AdminGrantPassive char={char} />
          <AdminModePanel char={char} />
          <AdminHpRpPanel char={char} />
        </div>
          <div>
            {/* HP / RP display */}
            <Card title="HEALTH & REIATSU POINTS" style={{ marginBottom: '1rem' }}>
              {[
                { label: 'HEALTH POINTS', val: calcHP(char, effective), formula: char.hpFormula || DEFAULT_HP_FORMULA, color: '#c04040' },
                { label: 'REIATSU POINTS', val: calcRP(char, effective), formula: char.rpFormula || DEFAULT_RP_FORMULA, color: '#3060c0' },
              ].map(({ label, val, formula, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
                  <div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)' }}>{label}</div>
                    <div style={{ fontSize: '0.52rem', color: 'var(--color-bo-muted)', marginTop: '1px' }}>{formula}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color, fontWeight: 700 }}>{val}</span>
                </div>
              ))}
            </Card>
            <Card title="NODE POINTS (NDR)">
              <DataRow label="PDR — STAT POINTS" value={char.pdr ?? 0} />
              <div style={{ marginTop: '0.5rem' }}><NDRBreakdown character={char} /></div>
            </Card>
            <Card title="CURRENCIES">
              <DataRow label="REISEN (IN HAND)"  value={char.reisenHand ?? 0}     unit="₹" />
              <DataRow label="REISEN ABSORBED"   value={char.reisenAbsorbed ?? 0} unit="₹" />
              <DataRow label="REISEN BANKED"     value={char.reisenBanked ?? 0}   unit="₹" />
              <DataRow label="LOYALTY"           value={char.loyalty ?? 0}         unit="✦" />
              <DataRow label="YEN"               value={char.yen ?? 0}             unit="¥" />
            </Card>
            <Card title="PERSONNEL INFO">
              <InfoRow label="RACE"     value={char.race} />
              <InfoRow label="RANK"     value={char.rank} />
              <InfoRow label="POSITION" value={char.position} />
              <InfoRow label="SLV"      value={char.slv} />
              <InfoRow label="SCA"      value={char.sca} />
              {char.height && <InfoRow label="HEIGHT" value={char.height + ' cm'} />}
              {char.weight && <InfoRow label="WEIGHT" value={char.weight + ' kg'} />}
              {char.age    && <InfoRow label="AGE"    value={String(char.age)}    />}
              {char.ostUrl && <InfoRow label="OST"    value="✓ Skonfigurowane"    />}
            </Card>
          </div>
        </div>
      )}

      {tab === 'multipliers' && (
        <div style={{ maxWidth: '700px' }}>
          <Card title="STAT MULTIPLIERS">
            <div style={{ fontSize: '0.65rem', color: 'var(--color-bo-muted)', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Percentage modifiers applied after flat equipment bonuses. Add a source description so the player knows where the bonus comes from.
            </div>
            <StatMultiplierPanel character={char} />
          </Card>
        </div>
      )}

      {tab === 'skill_trees' && (
        <AdminSkillTreeView char={char} globalTrees={globalTrees} />
      )}


      {tab === 'equipment' && <AdminItemsTab char={char} items={items} charId={id} effectiveStats={effective} />}

      {tab === 'techniques' && <AdminTechTab char={char} techniques={techniques} charId={id} charStats={effective} />}
      {tab === 'identifier' && (
        <div>
          <IdentifierCard char={char} />
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(220,50,50,0.06)', border: '1px solid var(--color-bo-red-dim)', display: 'inline-block' }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--color-bo-red)' }}>
              ADMIN NOTE — DID: {char.did ?? '—'} · Login ID: {char.identifier}
            </span>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Card title="APPEARANCE"><p style={{ color: char.appearance ? 'var(--color-bo-text)' : 'var(--color-bo-muted)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{char.appearance || '— No data —'}</p></Card>
            <Card title="PERSONALITY"><p style={{ color: char.personality ? 'var(--color-bo-text)' : 'var(--color-bo-muted)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{char.personality || '— No data —'}</p></Card>
          </div>
          <Card title="HISTORY"><p style={{ color: char.history ? 'var(--color-bo-text)' : 'var(--color-bo-muted)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{char.history || '— No data —'}</p></Card>
          {char.additionalInfo && (
            <Card title="ADDITIONAL INFO" style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>Widoczne dla gracza w History &amp; Lore.</div>
              <p style={{ color: 'var(--color-bo-text)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{char.additionalInfo}</p>
            </Card>
          )}
          {char.publicInfo && (
            <Card title="PUBLIC INFO" style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>Widoczne dla graczy z wymaganym Security Clearance w Personnel Search.</div>
              <p style={{ color: 'var(--color-bo-text)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{char.publicInfo}</p>
            </Card>
          )}
          {char.privateInfo && (
            <Card title="▲ PRIVATE INFO — TYLKO ADMIN" style={{ marginTop: '1rem', borderColor: 'var(--color-bo-red-dim)' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'var(--color-bo-red)', marginBottom: '0.4rem' }}>Niewidoczne dla gracza. Wyłącznie do użytku administracyjnego.</div>
              <p style={{ color: 'var(--color-bo-text)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{char.privateInfo}</p>
            </Card>
          )}
        </div>
      )}
    </PageShell>
  )
}
