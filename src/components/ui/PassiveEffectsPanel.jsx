import { useState, useMemo, useRef } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { parseSegments } from '../../data/techMarkup'

function getSnippet(text, maxWords = 8) {
  if (!text) return ''
  const words = text.split(/\s+/).slice(0, maxWords).join(' ')
  return words.length < text.length ? words + '…' : words
}

// Renderer inline formuł — obsługuje hover na liczbie
function SegmentText({ text, stats }) {
  const segs = useMemo(() => parseSegments(text ?? '', stats ?? {}), [text, stats])
  return (
    <>
      {segs.map((seg, i) => {
        if (seg.isFormula) {
          return (
            <FormulaValue key={i} seg={seg} />
          )
        }
        return <span key={i}>{seg.text}</span>
      })}
    </>
  )
}

// Liczba z własnym tooltipem (niezależnym od karty)
function FormulaValue({ seg }) {
  const [show, setShow] = useState(false)
  const timer = useRef(null)

  function handleEnter() {
    clearTimeout(timer.current)
    setShow(true)
  }
  function handleLeave() {
    timer.current = setTimeout(() => setShow(false), 120)
  }

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ color: '#80c0e0', fontWeight: 600, cursor: 'help', borderBottom: '1px dotted #80c0e0' }}
      >
        {seg.value}
      </span>
      {show && (
        <span
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          style={{
            position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%',
            transform: 'translateX(-50%)', zIndex: 10000,
            background: '#0e0e18', border: '1px solid #4060a0',
            borderRadius: '4px', padding: '4px 8px',
            fontSize: '0.52rem', color: '#a0c0e0',
            whiteSpace: 'nowrap', pointerEvents: 'auto',
            boxShadow: '0 2px 10px rgba(0,0,0,0.7)',
          }}
        >
          {seg.formulaRaw} = {seg.value}
          <span style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #4060a0' }} />
        </span>
      )}
    </span>
  )
}

// ── Karta efektu ─────────────────────────────────────────────────────────
function EffectCard({ effect, pinned, onTogglePin, effectiveStats, onEdit, onDelete, isAdmin }) {
  const [hoverCard, setHoverCard] = useState(false)
  const [hoverTip,  setHoverTip]  = useState(false)
  const [tipPos,    setTipPos]    = useState({ top: 0, left: 0 })
  const cardRef   = useRef(null)
  const cardTimer = useRef(null)
  const tipTimer  = useRef(null)

  const showTooltip = (hoverCard || hoverTip) && effect.description

  function handleCardEnter() {
    clearTimeout(cardTimer.current)
    // Oblicz pozycję relative do viewport (fixed)
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setTipPos({
        top:  rect.top - 8,          // tuż nad kartą
        left: rect.left + rect.width / 2,
      })
    }
    setHoverCard(true)
  }
  function handleCardLeave() { cardTimer.current = setTimeout(() => setHoverCard(false), 100) }
  function handleTipEnter()  { clearTimeout(cardTimer.current); clearTimeout(tipTimer.current); setHoverTip(true) }
  function handleTipLeave()  { tipTimer.current = setTimeout(() => setHoverTip(false), 100) }

  const snippet = getSnippet(effect.description)

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={cardRef}
        onMouseEnter={handleCardEnter}
        onMouseLeave={handleCardLeave}
        style={{
          background: pinned ? 'rgba(200,160,0,0.07)' : 'var(--color-bo-elevated)',
          border: `1px solid ${pinned ? 'rgba(200,160,0,0.3)' : 'var(--color-bo-border)'}`,
          borderRadius: '4px', padding: '0.5rem 0.65rem',
          minWidth: '120px', maxWidth: '200px', cursor: 'default',
          transition: 'border-color 0.15s',
        }}
      >
        {/* Pin + actions */}
        <div style={{ position: 'absolute', top: 3, right: 4, display: 'flex', gap: '3px', opacity: hoverCard || pinned ? 1 : 0, transition: 'opacity 0.15s' }}>
          {isAdmin && onEdit   && <button onClick={e => { e.stopPropagation(); onEdit(effect)   }} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.6rem', padding: '0 1px', lineHeight: 1 }}>✎</button>}
          {isAdmin && onDelete && <button onClick={e => { e.stopPropagation(); onDelete(effect.id) }} style={{ background: 'none', border: 'none', color: 'var(--color-bo-red)', cursor: 'pointer', fontSize: '0.6rem', padding: '0 1px', lineHeight: 1 }}>×</button>}
          <button onClick={e => { e.stopPropagation(); onTogglePin(effect.id) }} title={pinned ? 'Odepnij' : 'Przypnij'} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.62rem', color: pinned ? '#c8a000' : 'var(--color-bo-border)', padding: '0 1px', lineHeight: 1 }}>
            {pinned ? '★' : '☆'}
          </button>
        </div>

        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-bo-text)', fontFamily: 'var(--font-body)', marginBottom: '3px', paddingRight: '38px' }}>
          {effect.name}
        </div>
        {effect.description && (
          <div style={{ fontSize: '0.56rem', color: 'var(--color-bo-text-dim)', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
            <SegmentText text={snippet} stats={effectiveStats} />
          </div>
        )}
        {effect.source && (
          <div style={{ fontSize: '0.48rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', marginTop: '4px' }}>{effect.source}</div>
        )}
      </div>

      {/* Tooltip — position: fixed żeby nie był zasłonięty przez sidebar */}
      {showTooltip && (
        <div
          onMouseEnter={handleTipEnter}
          onMouseLeave={handleTipLeave}
          style={{
            position: 'fixed',
            bottom: `calc(100vh - ${tipPos.top}px + 6px)`,
            left: tipPos.left,
            transform: 'translateX(-50%)',
            zIndex: 99999, width: 260,
            background: '#0e0e18', border: '1px solid var(--color-bo-border)',
            borderRadius: '6px', padding: '10px 12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.75)',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--color-bo-border)' }} />
          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-bo-text)', fontFamily: 'var(--font-body)', marginBottom: '5px' }}>{effect.name}</div>
          <div style={{ fontSize: '0.56rem', color: '#a0a0c0', lineHeight: 1.65, fontFamily: 'var(--font-body)', whiteSpace: 'pre-wrap' }}>
            <SegmentText text={effect.description} stats={effectiveStats} />
          </div>
          {effect.source && <div style={{ marginTop: '6px', fontSize: '0.5rem', color: 'var(--color-bo-muted)' }}>Źródło: {effect.source}</div>}
        </div>
      )}
    </div>
  )
}

// ── Panel edycji efektu ───────────────────────────────────────────────────
function EditModal({ effect, onSave, onClose }) {
  const [name, setName] = useState(effect.name || '')
  const [desc, setDesc] = useState(effect.description || '')
  const [src,  setSrc]  = useState(effect.source || '')
  const inp = {
    background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
    color: 'var(--color-bo-text)', padding: '0.35rem 0.5rem',
    fontSize: '0.72rem', fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box', outline: 'none',
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', borderRadius: '6px', padding: '1.25rem', width: '340px', maxWidth: '95vw' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--color-bo-red)', marginBottom: '0.75rem' }}>EDYTUJ EFEKT PASYWNY</div>
        <div style={{ marginBottom: '0.4rem' }}><label style={{ fontSize: '0.5rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', display: 'block', marginBottom: '0.2rem' }}>NAZWA</label><input value={name} onChange={e => setName(e.target.value)} style={inp} /></div>
        <div style={{ marginBottom: '0.4rem' }}><label style={{ fontSize: '0.5rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', display: 'block', marginBottom: '0.2rem' }}>OPIS</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} style={{ ...inp, resize: 'vertical' }} /></div>
        <div style={{ marginBottom: '0.75rem' }}><label style={{ fontSize: '0.5rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', display: 'block', marginBottom: '0.2rem' }}>ŹRÓDŁO</label><input value={src} onChange={e => setSrc(e.target.value)} style={inp} /></div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.4rem 0.8rem', fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>ANULUJ</button>
          <button onClick={() => onSave({ ...effect, name: name.trim(), description: desc.trim(), source: src.trim() })} disabled={!name.trim()} style={{ flex: 1, background: 'rgba(96,192,128,0.1)', border: '1px solid rgba(96,192,128,0.3)', color: '#60c080', padding: '0.4rem', fontSize: '0.6rem', cursor: !name.trim() ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>ZAPISZ</button>
        </div>
      </div>
    </div>
  )
}

// ── Główny komponent ──────────────────────────────────────────────────────
export default function PassiveEffectsPanel({ character, allTrees, effectiveStats, isAdmin }) {
  const [sortMode, setSortMode] = useState('alpha')
  const [search,   setSearch]   = useState('')
  const [editing,  setEditing]  = useState(null) // effect being edited

  const pinnedIds = character?.pinnedPassiveIds ?? []

  // Efekty z węzłów drzewka (tag "passive")
  const treeEffects = useMemo(() => {
    const result = []
    for (const [treeStat, treeData] of Object.entries(allTrees ?? {})) {
      const unlocked = character?.unlockedNodes?.[treeStat] ?? {}
      for (const [nodeId, count] of Object.entries(unlocked)) {
        if (!count) continue
        const node = treeData?.nodes?.find(n => n.id === nodeId)
        if (!node?.tags?.includes('passive')) continue
        result.push({
          id:          nodeId,
          name:        node.passiveName || node.label || nodeId,
          description: node.longDescription || node.description || '',
          source:      `Drzewko: ${node.label || nodeId}`,
          grantedAt:   0,
          fromTree:    true,
        })
      }
    }
    return result
  }, [character?.unlockedNodes, allTrees])

  const adminEffects = useMemo(() =>
    (character?.passiveEffects ?? []).map(e => ({ ...e, grantedAt: e.grantedAt ?? 0 }))
  , [character?.passiveEffects])

  const allEffects = [...treeEffects, ...adminEffects]

  // Filtrowanie wyszukiwarką — najpierw po nazwie, potem po opisie
  const filtered = useMemo(() => {
    if (!search.trim()) return allEffects
    const q = search.toLowerCase().trim()
    const byName = allEffects.filter(e => e.name?.toLowerCase().includes(q))
    const byDesc = allEffects.filter(e => !e.name?.toLowerCase().includes(q) && e.description?.toLowerCase().includes(q))
    return [...byName, ...byDesc]
  }, [allEffects, search])

  const pinned   = pinnedIds.map(pid => filtered.find(e => e.id === pid)).filter(Boolean)
  const unpinned = filtered.filter(e => !pinnedIds.includes(e.id))

  const sortedUnpinned = [...unpinned].sort((a, b) =>
    sortMode === 'alpha'
      ? (a.name ?? '').localeCompare(b.name ?? '')
      : (a.grantedAt ?? 0) - (b.grantedAt ?? 0)
  )

  const displayed = [...pinned, ...sortedUnpinned]

  async function handleTogglePin(effectId) {
    if (!character?.id) return
    const current = character.pinnedPassiveIds ?? []
    const newPinned = current.includes(effectId)
      ? current.filter(x => x !== effectId)
      : [...current, effectId]
    await updateDoc(doc(db, 'characters', character.id), { pinnedPassiveIds: newPinned })
  }

  async function handleDelete(effectId) {
    if (!character?.id || !window.confirm('Usunąć ten efekt pasywny?')) return
    const updated = (character.passiveEffects ?? []).filter(e => e.id !== effectId)
    await updateDoc(doc(db, 'characters', character.id), { passiveEffects: updated })
  }

  async function handleSaveEdit(updated) {
    if (!character?.id) return
    const newEffects = (character.passiveEffects ?? []).map(e => e.id === updated.id ? updated : e)
    await updateDoc(doc(db, 'characters', character.id), { passiveEffects: newEffects })
    setEditing(null)
  }

  if (allEffects.length === 0) return null

  return (
    <>
      {editing && <EditModal effect={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />}

      <div style={{ marginTop: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', flexShrink: 0 }}>EFEKTY PASYWNE</div>
          {/* Wyszukiwarka */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="szukaj…"
            style={{ flex: 1, maxWidth: '160px', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '2px 7px', fontSize: '0.6rem', fontFamily: 'var(--font-body)', outline: 'none', borderRadius: '2px' }}
          />
          {/* Sort */}
          <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
            {[['alpha','A–Z'],['chrono','⏱']].map(([mode, label]) => (
              <button key={mode} onClick={() => setSortMode(mode)} style={{ background: sortMode === mode ? 'rgba(220,50,50,0.12)' : 'none', border: `1px solid ${sortMode === mode ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`, color: sortMode === mode ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', padding: '1px 7px', fontSize: '0.52rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{label}</button>
            ))}
          </div>
        </div>

        {displayed.length === 0 && search && (
          <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', padding: '0.4rem 0' }}>Brak wyników dla „{search}"</div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {displayed.map(effect => (
            <EffectCard
              key={effect.id}
              effect={effect}
              pinned={pinnedIds.includes(effect.id)}
              onTogglePin={handleTogglePin}
              effectiveStats={effectiveStats}
              isAdmin={isAdmin}
              onEdit={!effect.fromTree ? setEditing : null}
              onDelete={!effect.fromTree ? handleDelete : null}
            />
          ))}
        </div>
      </div>
    </>
  )
}
