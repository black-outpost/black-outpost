import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCharacter } from '../../hooks/useCharacter'
import { useAuth } from '../../contexts/AuthContext'
import { calcEffectiveStats } from '../../data/statCalc'
import PageShell, { Card } from '../../components/ui/PageShell'
import NDRBreakdown from '../../components/ui/NDRBreakdown'

const STAT_NAMES = {
  bujutsu:   { 'Soul Reaper':'Hakuda','Arrancar':'Hakuda','Quincy':'Hakuda','Fullbringer':'Hakuda',default:'Bujutsu' },
  bukijutsu: { 'Soul Reaper':'Zanjutsu','Arrancar':'Zanjutsu','Quincy':'Kyudo','Fullbringer':'Bukijutsu',default:'Bukijutsu' },
  tamashi:   { 'Soul Reaper':'Zanpakuto Mastery','Arrancar':'Zanpakuto Mastery','Quincy':'Blood Mastery','Fullbringer':'Fullbring Mastery',default:'Tamashi' },
}
function getStatName(stat, race) {
  return STAT_NAMES[stat]?.[race] ?? STAT_NAMES[stat]?.default ?? stat.toUpperCase()
}

// Tooltip na statystyce z rozpisanym bonusem
function StatRow({ label, statKey, baseValue = 0, breakdown }) {
  const [hover, setHover] = useState(false)
  const bd      = breakdown?.[statKey]
  const final   = bd?.final ?? baseValue
  const hasBonus = bd?.hasBonus

  const pct = Math.round((Math.min(final, 500) / 500) * 100)

  // Buduj treść tooltipa
  function tooltipContent() {
    if (!bd || !hasBonus) return null
    const lines = []
    lines.push(`Base: ${bd.base}`)
    if (bd.flat !== 0) {
      lines.push(`Flat bonuses: ${bd.flat > 0 ? '+' : ''}${bd.flat}`)
      for (const s of bd.flatSources) lines.push(`  • ${s.value > 0 ? '+' : ''}${s.value} from ${s.source}`)
    }
    if (bd.percent !== 0) {
      if (bd.flat !== 0) lines.push(`After flat: ${bd.afterFlat}`)
      lines.push(`Multipliers: ${bd.percent > 0 ? '+' : ''}${bd.percent}%`)
      for (const s of bd.percentSources) lines.push(`  • ${s.value > 0 ? '+' : ''}${s.value}% — ${s.source}`)
    }
    lines.push(`Total: ${bd.final}`)
    return lines
  }

  const tipLines = tooltipContent()

  return (
    <div style={{ marginBottom: '0.9rem', position: 'relative' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', cursor: hasBonus ? 'help' : 'default' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={{
          fontSize: '0.68rem', letterSpacing: '0.12em',
          color: 'var(--color-bo-text-dim)',
          borderBottom: hasBonus ? '1px dashed var(--color-bo-muted)' : 'none',
        }}>
          {label}
        </span>
        <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-display)', color: hasBonus ? '#60c080' : 'var(--color-bo-text)' }}>
          {final}
          {hasBonus && bd.flat !== 0 && (
            <span style={{ fontSize: '0.6rem', color: 'var(--color-bo-red)', marginLeft: '4px' }}>
              ({bd.base}{bd.flat > 0 ? '+' : ''}{bd.flat})
            </span>
          )}
        </span>
      </div>
      <div style={{ height: '2px', background: 'var(--color-bo-elevated)' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: hasBonus ? '#60c080' : 'var(--color-bo-red)', opacity: final > 0 ? 1 : 0.2, transition: 'width 0.3s' }} />
      </div>

      {/* Tooltip */}
      {hover && tipLines && (
        <div style={{
          position: 'absolute', right: 0, bottom: '100%', marginBottom: '6px',
          background: '#0a0a0f', border: '1px solid var(--color-bo-border)',
          padding: '0.55rem 0.75rem', zIndex: 50,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          minWidth: '200px', pointerEvents: 'none',
        }}>
          {tipLines.map((line, i) => (
            <div key={i} style={{
              fontSize: line.startsWith('  •') ? '0.6rem' : '0.65rem',
              color: line.startsWith('Total') ? '#60c080' : line.startsWith('  •') ? 'var(--color-bo-text-dim)' : 'var(--color-bo-text)',
              fontWeight: line.startsWith('Total') ? 700 : 400,
              lineHeight: 1.6,
              borderTop: line.startsWith('Total') ? '1px solid var(--color-bo-border)' : 'none',
              marginTop: line.startsWith('Total') ? '4px' : 0,
              paddingTop: line.startsWith('Total') ? '4px' : 0,
            }}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DataRow({ label, value = 0, unit = '' }) {
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


const STAT_DISPLAY = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi']

function PDRModal({ character, onClose }) {
  const [pending, setPending] = useState({})
  const [saving,  setSaving]  = useState(false)
  const pdr = character.pdr ?? 0
  const totalAllocated = Object.values(pending).reduce((s, v) => s + v, 0)
  const remaining = pdr - totalAllocated

  function adjust(stat, delta) {
    const cur = pending[stat] ?? 0
    const next = Math.max(0, cur + delta)
    // Can't allocate more than remaining
    if (delta > 0 && remaining <= 0) return
    setPending(p => ({ ...p, [stat]: next }))
  }

  async function handleConfirm() {
    if (totalAllocated === 0) return
    setSaving(true)
    try {
      const newStats = { ...character.stats }
      for (const [stat, val] of Object.entries(pending)) {
        if (val > 0) newStats[stat] = (newStats[stat] ?? 0) + val
      }
      await updateDoc(doc(db, 'characters', character.id), {
        stats: newStats,
        pdr: pdr - totalAllocated,
      })
      onClose()
    } finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--color-bo-dark)', border: '1px solid var(--color-bo-border)', width: '420px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-bo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--color-bo-text)' }}>DISTRIBUTE STAT POINTS</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', marginTop: '2px', letterSpacing: '0.1em' }}>PDR available: {pdr}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>

        <div style={{ padding: '1rem 1.25rem' }}>
          {/* Remaining indicator */}
          <div style={{ padding: '0.6rem 0.85rem', background: remaining > 0 ? 'rgba(220,50,50,0.08)' : 'rgba(50,200,100,0.08)', border: '1px solid ' + (remaining > 0 ? 'var(--color-bo-red-dim)' : 'rgba(50,200,100,0.3)'), marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-bo-text-dim)', letterSpacing: '0.1em' }}>POINTS REMAINING</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: remaining > 0 ? 'var(--color-bo-red)' : '#60c080', fontWeight: 700 }}>{remaining}</span>
          </div>

          {STAT_DISPLAY.map(stat => {
            const cur    = character.stats?.[stat] ?? 0
            const alloc  = pending[stat] ?? 0
            return (
              <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
                <span style={{ flex: 1, fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--color-bo-text-dim)' }}>{stat.toUpperCase()}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-bo-muted)', minWidth: '24px', textAlign: 'right' }}>{cur}</span>
                {alloc > 0 && <span style={{ fontSize: '0.72rem', color: 'var(--color-bo-red)' }}>+{alloc}</span>}
                {alloc > 0 && <span style={{ fontSize: '0.72rem', color: '#60c080', minWidth: '28px' }}>={cur + alloc}</span>}
                <div style={{ display: 'flex', gap: '2px' }}>
                  <button onClick={() => adjust(stat, -1)} disabled={alloc === 0} style={{ width: '26px', height: '26px', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', cursor: alloc === 0 ? 'not-allowed' : 'pointer', fontSize: '0.9rem', opacity: alloc === 0 ? 0.3 : 1 }}>−</button>
                  <button onClick={() => adjust(stat, 1)} disabled={remaining === 0} style={{ width: '26px', height: '26px', background: remaining === 0 ? 'var(--color-bo-elevated)' : 'rgba(220,50,50,0.1)', border: '1px solid ' + (remaining === 0 ? 'var(--color-bo-border)' : 'var(--color-bo-red-dim)'), color: remaining === 0 ? 'var(--color-bo-muted)' : 'var(--color-bo-red)', cursor: remaining === 0 ? 'not-allowed' : 'pointer', fontSize: '0.9rem', opacity: remaining === 0 ? 0.3 : 1 }}>+</button>
                </div>
              </div>
            )
          })}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.45rem 1rem', fontSize: '0.62rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>CANCEL</button>
            <button onClick={handleConfirm} disabled={saving || totalAllocated === 0} style={{ background: totalAllocated > 0 ? 'rgba(220,50,50,0.12)' : 'none', border: '1px solid ' + (totalAllocated > 0 ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: totalAllocated > 0 ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', padding: '0.45rem 1.5rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: totalAllocated === 0 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: totalAllocated === 0 ? 0.5 : 1 }}>
              {saving ? 'SAVING...' : 'CONFIRM (' + totalAllocated + ' pts)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StatsView() {
  const { character: c, loading } = useCharacter()
  const [items, setItems] = useState([])
  const [showPDR, setShowPDR] = useState(false)

  // Nasłuchuj na itemy żeby mieć aktualne bonusy
  useEffect(() => {
    if (!c?.id) return
    const ref = collection(db, 'characters', c.id, 'items')
    return onSnapshot(ref, snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [c?.id])

  if (loading) return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>
  if (!c)      return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>NO CHARACTER ASSIGNED</div>

  const race = c.race ?? ''
  const s    = c.stats ?? {}
  const { breakdown } = calcEffectiveStats(c, items)

  return (
    <PageShell title="STATISTICS" subtitle={`${c.alias ? c.alias + ' · ' : ''}${race || '—'}`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        <Card title="COMBAT STATISTICS">
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', marginBottom: '0.75rem' }}>
            Hover a stat to see bonus breakdown
          </div>
          <StatRow label="STRENGTH"                      statKey="strength"  baseValue={s.strength}  breakdown={breakdown} />
          <StatRow label="VITALITY"                      statKey="vitality"  baseValue={s.vitality}  breakdown={breakdown} />
          <StatRow label="SPEED"                         statKey="speed"     baseValue={s.speed}     breakdown={breakdown} />
          <StatRow label="DEFENSE"                       statKey="defense"   baseValue={s.defense}   breakdown={breakdown} />
          <StatRow label="REIATSU"                       statKey="reiatsu"   baseValue={s.reiatsu}   breakdown={breakdown} />
          <StatRow label="REIRYOKU"                      statKey="reiryoku"  baseValue={s.reiryoku}  breakdown={breakdown} />
          <StatRow label={getStatName('bujutsu',  race)} statKey="bujutsu"   baseValue={s.bujutsu}   breakdown={breakdown} />
          <StatRow label={getStatName('bukijutsu',race)} statKey="bukijutsu" baseValue={s.bukijutsu} breakdown={breakdown} />
          <StatRow label={getStatName('tamashi',  race)} statKey="tamashi"   baseValue={s.tamashi}   breakdown={breakdown} />
          <StatRow label={c.nazoUnlocked ? (c.nazoName ?? '???') : '???'} statKey="nazo" baseValue={s.nazo} breakdown={breakdown} />
        </Card>

        <div>
          <Card title="NODE POINTS (NDR)">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-bo-border)', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: 'var(--color-bo-text-dim)' }}>PDR — STAT POINTS TO DISTRIBUTE</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-display)', color: (c.pdr ?? 0) > 0 ? 'var(--color-bo-red)' : 'var(--color-bo-text)' }}>{c.pdr ?? 0}</span>
                {(c.pdr ?? 0) > 0 && (
                  <button onClick={() => setShowPDR(true)} style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.2rem 0.6rem', fontSize: '0.58rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    DISTRIBUTE
                  </button>
                )}
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <NDRBreakdown character={c} />
            </div>
          </Card>

          <Card title="CURRENCIES & RESOURCES">
            <DataRow label="REISEN (IN HAND)"   value={c.reisenHand ?? 0}     unit="₹" />
            <DataRow label="REISEN ABSORBED"    value={c.reisenAbsorbed ?? 0} unit="₹" />
            <DataRow label="REISEN BANKED"      value={c.reisenBanked ?? 0}   unit="₹" />
            <DataRow label="LOYALTY"            value={c.loyalty ?? 0}         unit="✦" />
            <DataRow label="YEN"                value={c.yen ?? 0}             unit="¥" />
          </Card>

          <Card title="PERSONNEL INFO">
            {c.alias    && <InfoRow label="ALIAS"    value={c.alias} />}
            <InfoRow label="RACE"     value={c.race} />
            <InfoRow label="RANK"     value={c.rank} />
            <InfoRow label="POSITION" value={c.position} />
            <InfoRow label="SLV"      value={c.slv} />
            <InfoRow label="SCA"      value={c.sca} />
            {c.height   && <InfoRow label="HEIGHT"  value={`${c.height} cm`} />}
            {c.weight   && <InfoRow label="WEIGHT"  value={`${c.weight} kg`} />}
          </Card>
        </div>
      </div>
      {showPDR && <PDRModal character={c} onClose={() => setShowPDR(false)} />}
    </PageShell>
  )
}
