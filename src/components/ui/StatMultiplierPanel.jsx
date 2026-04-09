import { useState } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { logAdminAction } from '../../data/adminLog'

const STAT_KEYS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']

const inp = {
  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)', padding: '0.45rem 0.6rem',
  fontSize: '0.82rem', fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box',
}

/**
 * Panel zarządzania mnożnikami statystyk — osadzony w CharacterView (admin).
 * Mnożniki są przechowywane w character.statMultipliers = [{id, stat, percent, source}]
 */
export default function StatMultiplierPanel({ character, onUpdate }) {
  const [stat,    setStat]    = useState('strength')
  const [percent, setPercent] = useState('')
  const [source,  setSource]  = useState('')
  const [saving,  setSaving]  = useState(false)
  const [hover,   setHover]   = useState(null)
  const { identifier: adminIdentifier, currentUser } = useAuth()

  const multipliers = character?.statMultipliers ?? []

  const targetName = `${character?.firstName ?? ''} ${character?.lastName ?? ''} (${character?.identifier ?? character?.id ?? ''})`.trim()

  async function handleAdd(e) {
    e.preventDefault()
    const pct = parseFloat(percent)
    if (isNaN(pct) || !source.trim()) return
    setSaving(true)
    try {
      const entry = { id: `m_${Date.now()}`, stat, percent: pct, source: source.trim() }
      await updateDoc(doc(db, 'characters', character.id), { statMultipliers: arrayUnion(entry) })
      await logAdminAction({
        adminIdentifier, adminUid: currentUser?.uid ?? '',
        action: 'add_stat_multiplier',
        targetId: character.id,
        targetName,
        category: 'character',
        changes: [{ field: `statMultipliers.${stat}`, before: null, after: `${pct > 0 ? '+' : ''}${pct}% (${source.trim()})` }],
      })
      setPercent('')
      setSource('')
      onUpdate?.()
    } finally { setSaving(false) }
  }

  async function handleRemove(entry) {
    await updateDoc(doc(db, 'characters', character.id), { statMultipliers: arrayRemove(entry) })
    await logAdminAction({
      adminIdentifier, adminUid: currentUser?.uid ?? '',
      action: 'remove_stat_multiplier',
      targetId: character.id,
      targetName,
      category: 'character',
      changes: [{ field: `statMultipliers.${entry.stat}`, before: `${entry.percent > 0 ? '+' : ''}${entry.percent}% (${entry.source})`, after: null }],
    })
    onUpdate?.()
  }

  // Podsumowanie per statystyka
  const summary = {}
  for (const m of multipliers) {
    if (!summary[m.stat]) summary[m.stat] = 0
    summary[m.stat] += m.percent
  }

  return (
    <div>
      {/* Formularz dodawania */}
      <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr auto', gap: '0.5rem', alignItems: 'end', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>STAT</div>
          <select value={stat} onChange={e => setStat(e.target.value)} style={inp}>
            {STAT_KEYS.map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>% VALUE</div>
          <input
            type="number" value={percent} onChange={e => setPercent(e.target.value)}
            placeholder="+5 or -10" style={inp} step="0.1"
          />
        </div>
        <div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>SOURCE / REASON</div>
          <input value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Bankai passive, Node XV" style={inp} />
        </div>
        <button
          type="submit" disabled={saving || !percent || !source}
          style={{
            background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)',
            color: 'var(--color-bo-red)', padding: '0.45rem 0.85rem',
            fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer',
            fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
            opacity: (!percent || !source) ? 0.4 : 1,
          }}
        >
          {saving ? '...' : '+ ADD'}
        </button>
      </form>

      {/* Lista aktywnych mnożników */}
      {multipliers.length === 0 ? (
        <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em', textAlign: 'center', padding: '1.5rem 0', border: '1px solid var(--color-bo-border)' }}>
          NO MULTIPLIERS ACTIVE
        </div>
      ) : (
        <div>
          {multipliers.map((m, i) => (
            <div
              key={m.id ?? i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.5rem 0.75rem', marginBottom: '2px',
                background: hover === i ? 'rgba(220,50,50,0.04)' : 'var(--color-bo-surface)',
                border: '1px solid var(--color-bo-border)',
                transition: 'background 0.1s',
              }}
            >
              {/* Stat badge */}
              <div style={{
                padding: '2px 6px', flexShrink: 0,
                background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
                fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--color-bo-text-dim)',
              }}>
                {m.stat.toUpperCase()}
              </div>

              {/* Percent */}
              <div style={{
                fontSize: '0.95rem', fontFamily: 'var(--font-display)', fontWeight: 700,
                color: m.percent > 0 ? '#60c080' : m.percent < 0 ? 'var(--color-bo-red)' : 'var(--color-bo-muted)',
                minWidth: '50px', flexShrink: 0,
              }}>
                {m.percent > 0 ? '+' : ''}{m.percent}%
              </div>

              {/* Source */}
              <div style={{ flex: 1, fontSize: '0.72rem', color: 'var(--color-bo-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.source}
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemove(m)}
                style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.8rem', padding: '0 0.25rem', flexShrink: 0 }}
              >✕</button>
            </div>
          ))}

          {/* Podsumowanie per statystyka */}
          {Object.keys(summary).length > 0 && (
            <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.75rem', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>TOTALS PER STAT</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Object.entries(summary).map(([s, pct]) => (
                  <div key={s} style={{ fontSize: '0.68rem', color: pct > 0 ? '#60c080' : 'var(--color-bo-red)' }}>
                    {s}: {pct > 0 ? '+' : ''}{pct}%
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
