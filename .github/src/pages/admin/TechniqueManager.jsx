import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, onSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'

const CLASSIFICATIONS = ['I','II','III','IV','V','VI','VII','VIII','IX','X']
const STAT_KEYS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']

const inp = {
  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)', padding: '0.45rem 0.6rem',
  fontSize: '0.82rem', fontFamily: 'var(--font-body)',
  width: '100%', boxSizing: 'border-box',
}
const F = ({ label, children }) => (
  <div style={{ marginBottom: '0.65rem' }}>
    <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>{label}</label>
    {children}
  </div>
)

function ImagePreview({ url }) {
  const [ok, setOk] = useState(false)
  useEffect(() => { setOk(false) }, [url])
  if (!url) return null
  return (
    <div style={{ marginTop: '0.35rem', width: '100%', height: '80px', border: '1px solid var(--color-bo-border)', overflow: 'hidden', background: 'var(--color-bo-elevated)' }}>
      <img src={url} alt="preview" onLoad={() => setOk(true)} onError={() => setOk(false)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: ok ? 'block' : 'none' }} />
      {!ok && <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>INVALID URL</div>}
    </div>
  )
}

/* ── Słowniczek składni markupu ─────────────────────── */
function MarkupCheatsheet() {
  const [open, setOpen] = useState(false)
  const rows = [
    { syntax: '**tekst**',              result: <strong>pogrubienie</strong>,              desc: 'Bold text' },
    { syntax: '{red|tekst}',            result: <span style={{color:'var(--color-bo-red)'}}>czerwony</span>, desc: 'Named color' },
    { syntax: '{gold|tekst}',           result: <span style={{color:'#d4a840'}}>złoty</span>,               desc: '' },
    { syntax: '{green|tekst}',          result: <span style={{color:'#60c080'}}>zielony</span>,             desc: '' },
    { syntax: '{blue|tekst}',           result: <span style={{color:'#5090d0'}}>niebieski</span>,           desc: '' },
    { syntax: '{orange|tekst}',         result: <span style={{color:'#e07840'}}>pomarańczowy</span>,        desc: '' },
    { syntax: '{cyan|tekst}',           result: <span style={{color:'#40c0c0'}}>cyan</span>,                desc: '' },
    { syntax: '{dim|tekst}',            result: <span style={{color:'var(--color-bo-text-dim)'}}>wyciszony</span>, desc: '' },
    { syntax: '{muted|tekst}',          result: <span style={{color:'var(--color-bo-muted)'}}>szary</span>, desc: '' },
    { syntax: '{#ff6644|tekst}',        result: <span style={{color:'#ff6644'}}>dowolny hex</span>,         desc: 'Any CSS color/hex' },
    { syntax: '0.2x[Tamashi]',          result: <span style={{color:'#d4a840',borderBottom:'1px dashed rgba(212,168,64,0.5)'}}>10</span>, desc: 'Auto-formula (hover = breakdown)' },
    { syntax: '0.2x[A]+0.3x[B]',       result: <span style={{color:'#d4a840',borderBottom:'1px dashed rgba(212,168,64,0.5)'}}>wynik</span>, desc: 'Multi-stat formula' },
    { syntax: '[Speed] x 2',            result: <span style={{color:'#d4a840',borderBottom:'1px dashed rgba(212,168,64,0.5)'}}>wynik</span>, desc: 'Stat × multiplier' },
    { syntax: '**{red|pogrubiony}**',   result: <strong style={{color:'var(--color-bo-red)'}}>pogrubiony kolor</strong>, desc: 'Stacking works' },
  ]
  return (
    <div style={{ marginTop: '0.75rem', border: '1px solid var(--color-bo-border)', overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: open ? 'var(--color-bo-elevated)' : 'none', border: 'none', padding: '0.45rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: 'var(--color-bo-muted)' }}
      >
        <span style={{ fontSize: '0.55rem', letterSpacing: '0.18em' }}>MARKUP SYNTAX REFERENCE</span>
        <span style={{ fontSize: '0.65rem' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid var(--color-bo-border)', padding: '0.5rem 0.75rem', background: 'var(--color-bo-surface)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.68rem' }}>
            <thead>
              <tr>
                {['SYNTAX','RESULT','NOTE'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '0.52rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', padding: '0.2rem 0.4rem 0.4rem', borderBottom: '1px solid var(--color-bo-border)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(46,46,63,0.5)' }}>
                  <td style={{ padding: '0.28rem 0.4rem', fontFamily: 'monospace', color: 'var(--color-bo-text-dim)', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>{row.syntax}</td>
                  <td style={{ padding: '0.28rem 0.4rem', fontFamily: 'var(--font-body)' }}>{row.result}</td>
                  <td style={{ padding: '0.28rem 0.4rem', color: 'var(--color-bo-muted)', fontSize: '0.6rem' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '0.5rem', fontSize: '0.6rem', color: 'var(--color-bo-muted)', lineHeight: 1.7 }}>
            Linie z <code style={{color:'var(--color-bo-text-dim)',background:'var(--color-bo-elevated)',padding:'0 3px'}}>:</code> lub <code style={{color:'var(--color-bo-text-dim)',background:'var(--color-bo-elevated)',padding:'0 3px'}}>[</code> w Technical Details dostają czerwone wcięcie. Linie kończące się <code style={{color:'var(--color-bo-text-dim)',background:'var(--color-bo-elevated)',padding:'0 3px'}}>:</code> to nagłówki.
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Formularz techniki (shared: bank + per-char) ──── */
function TechForm({ initial, onSave, onCancel, saving, mode = 'bank' }) {
  const [name,             setName]             = useState(initial?.name ?? '')
  const [classification,   setClassification]   = useState(initial?.classification ?? 'I')
  const [stat,             setStat]             = useState(initial?.stat ?? '')
  const [origin,           setOrigin]           = useState(initial?.origin ?? '')
  const [description,      setDescription]      = useState(initial?.description ?? '')
  const [technicalDetails, setTechnicalDetails] = useState(initial?.technicalDetails ?? '')
  const [imageUrl,         setImageUrl]         = useState(initial?.imageUrl ?? '')

  function buildData() {
    return {
      name: name.trim(), classification,
      stat: stat || null, origin: origin.trim() || null,
      description: description.trim() || null,
      technicalDetails: technicalDetails.trim() || null,
      imageUrl: imageUrl.trim() || null,
    }
  }

  return (
    <form onSubmit={e => { e.preventDefault(); if (name.trim()) onSave(buildData()) }}>
      <F label="TECHNIQUE NAME">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Shikai: Luminate, Nagoshi" style={inp} />
      </F>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.5rem' }}>
        <F label="THREAT CLASSIFICATION">
          <select value={classification} onChange={e => setClassification(e.target.value)} style={inp}>
            {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </F>
        <F label="PRIMARY STAT (player filter)">
          <select value={stat} onChange={e => setStat(e.target.value)} style={inp}>
            <option value="">— none —</option>
            {STAT_KEYS.map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
          </select>
        </F>
      </div>
      <F label="ORIGIN (node / ability name, e.g. Brutal Force)">
        <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="e.g. Brutal Force" style={inp} />
      </F>
      <F label="DESCRIPTION (main text — markup supported)">
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Describe the technique..." rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
      </F>
      <F label="TECHNICAL DETAILS (stats, formulas, timing — markup supported)">
        <textarea value={technicalDetails} onChange={e => setTechnicalDetails(e.target.value)}
          placeholder={'Range: 20m\nActivation: Main action + move action\nFormula: 0.2x[Tamashi]+0.2x[Reiatsu]'} rows={5} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
      </F>
      <F label="IMAGE URL (optional)">
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://i.imgur.com/..." style={inp} />
        <ImagePreview url={imageUrl} />
      </F>

      <MarkupCheatsheet />

      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ flex: '0 0 auto', background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.5rem 0.75rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>CANCEL</button>
        )}
        <button type="submit" disabled={saving || !name.trim()} style={{ flex: 1, background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: !name.trim() ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: !name.trim() ? 0.5 : 1 }}>
          {saving ? 'SAVING...' : mode === 'edit' ? 'SAVE CHANGES' : mode === 'char' ? 'ADD TO CHARACTER' : 'ADD TO BANK'}
        </button>
      </div>
    </form>
  )
}

/* ── Modal nadawania techniki z banku ──────────────── */
function GrantModal({ tech, characters, onClose }) {
  const [charId,   setCharId]   = useState('')
  const [granting, setGranting] = useState(false)
  const [granted,  setGranted]  = useState(false)

  async function handleGrant() {
    if (!charId) return
    setGranting(true)
    try {
      const { id: _id, createdAt: _c, ...data } = tech
      await addDoc(collection(db, 'characters', charId, 'techniques'), { ...data, createdAt: serverTimestamp() })
      setGranted(true)
      setTimeout(() => { setGranted(false); setCharId('') }, 1500)
    } finally { setGranting(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--color-bo-dark)', border: '1px solid var(--color-bo-border)', width: '340px', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}>
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--color-bo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', letterSpacing: '0.15em', color: 'var(--color-bo-text)' }}>GRANT TECHNIQUE</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', marginTop: '2px' }}>{tech.name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>
        {tech.imageUrl && (
          <div style={{ height: '90px', overflow: 'hidden', borderBottom: '1px solid var(--color-bo-border)' }}>
            <img src={tech.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ padding: '0.85rem 1rem' }}>
          <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.3rem' }}>SELECT CHARACTER</label>
          <select value={charId} onChange={e => setCharId(e.target.value)} style={{ ...inp, marginBottom: '0.75rem' }}>
            <option value="">— choose character —</option>
            {characters.map(c => <option key={c.id} value={c.id}>{c.identifier}{c.alias ? ' · ' + c.alias : ''}</option>)}
          </select>
          <button onClick={handleGrant} disabled={!charId || granting}
            style={{ width: '100%', background: granted ? 'rgba(50,200,100,0.1)' : 'rgba(220,50,50,0.1)', border: '1px solid ' + (granted ? 'rgba(50,200,100,0.4)' : 'var(--color-bo-red-dim)'), color: granted ? '#60c080' : 'var(--color-bo-red)', padding: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: !charId ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.3s', opacity: !charId ? 0.5 : 1 }}>
            {granting ? 'GRANTING...' : granted ? '✓ GRANTED' : 'GRANT TO CHARACTER'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Karta techniki w banku — rozwijalna ────────────── */
function BankTechCard({ tech, onGrant, onEdit, onDelete }) {
  const [imgOk,    setImgOk]    = useState(false)
  const [expanded, setExpanded] = useState(false)
  const preview = tech.description ? tech.description.split(/[.!?]/)[0].trim() + '.' : ''

  return (
    <div style={{ background: 'var(--color-bo-surface)', border: '1px solid ' + (expanded ? 'var(--color-bo-muted)' : 'var(--color-bo-border)'), display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'border-color 0.15s' }}>
      {/* Obrazek */}
      <div style={{ height: '80px', overflow: 'hidden', background: 'var(--color-bo-elevated)', position: 'relative', flexShrink: 0 }}>
        {tech.imageUrl ? (
          <>
            <img src={tech.imageUrl} alt="" onLoad={() => setImgOk(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: imgOk ? 'block' : 'none' }} />
            {!imgOk && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--color-bo-border)' }}>◈</div>}
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'var(--color-bo-border)' }}>◈</div>
        )}
        {tech.classification && (
          <div style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '0.5rem', letterSpacing: '0.1em', background: 'rgba(0,0,0,0.8)', color: 'var(--color-bo-red)', padding: '2px 5px', border: '1px solid var(--color-bo-red-dim)' }}>
            CLASS {tech.classification}
          </div>
        )}
      </div>

      {/* Info + rozwijanie */}
      <div style={{ padding: '0.5rem 0.6rem', flex: 1 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-bo-text)', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tech.name}</div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', flexWrap: 'wrap' }}>
          {tech.origin && <span style={{ fontSize: '0.55rem', color: 'var(--color-bo-muted)', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', padding: '1px 4px' }}>{tech.origin}</span>}
          {tech.stat && <span style={{ fontSize: '0.55rem', color: '#5090d0', background: 'rgba(80,144,208,0.08)', border: '1px solid rgba(80,144,208,0.25)', padding: '1px 4px', letterSpacing: '0.08em' }}>{tech.stat.toUpperCase()}</span>}
        </div>
        {!expanded && preview && (
          <div style={{ fontSize: '0.63rem', color: 'var(--color-bo-text-dim)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{preview}</div>
        )}

        {/* Rozwinięty opis */}
        {expanded && (
          <div style={{ marginTop: '0.4rem', borderTop: '1px solid var(--color-bo-border)', paddingTop: '0.5rem' }}>
            {tech.description && (
              <p style={{ fontSize: '0.7rem', color: 'var(--color-bo-text-dim)', lineHeight: 1.6, margin: '0 0 0.4rem', whiteSpace: 'pre-wrap' }}>{tech.description}</p>
            )}
            {tech.technicalDetails && (
              <div style={{ background: 'rgba(220,50,50,0.04)', borderLeft: '3px solid var(--color-bo-red-dim)', padding: '0.4rem 0.6rem', marginTop: '0.4rem' }}>
                <div style={{ fontSize: '0.52rem', letterSpacing: '0.16em', color: 'var(--color-bo-red)', marginBottom: '0.3rem' }}>TECHNICAL DETAILS</div>
                <pre style={{ fontSize: '0.65rem', color: 'var(--color-bo-text-dim)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-body)', whiteSpace: 'pre-wrap' }}>{tech.technicalDetails}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Akcje */}
      <div style={{ padding: '0.4rem 0.6rem', borderTop: '1px solid var(--color-bo-border)', display: 'flex', gap: '0.3rem' }}>
        <button onClick={() => onGrant(tech)} style={{ flex: 1, background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.3rem 0', fontSize: '0.58rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>▶ GRANT</button>
        <button onClick={() => setExpanded(e => !e)} title={expanded ? 'Collapse' : 'Expand'} style={{ background: expanded ? 'var(--color-bo-elevated)' : 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.3rem 0.45rem', fontSize: '0.65rem', cursor: 'pointer' }}>{expanded ? '▲' : '▼'}</button>
        <button onClick={() => onEdit(tech)} title="Edit" style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.3rem 0.45rem', fontSize: '0.7rem', cursor: 'pointer' }}>✎</button>
        <button onClick={() => onDelete(tech.id)} title="Delete" style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.3rem 0.45rem', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
      </div>
    </div>
  )
}

/* ── Modal edycji/dodawania techniki konkretnego gracza */
function CharTechModal({ charId, charName, tech, onClose }) {
  const [saving, setSaving] = useState(false)
  const isEdit = !!tech

  async function handleSave(data) {
    setSaving(true)
    try {
      if (isEdit) {
        await updateDoc(doc(db, 'characters', charId, 'techniques', tech.id), data)
      } else {
        await addDoc(collection(db, 'characters', charId, 'techniques'), { ...data, createdAt: serverTimestamp() })
      }
      onClose()
    } finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--color-bo-dark)', border: '1px solid var(--color-bo-border)', width: '500px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}>
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--color-bo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--color-bo-dark)', zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', letterSpacing: '0.15em', color: 'var(--color-bo-text)' }}>
              {isEdit ? '✎ EDIT TECHNIQUE' : '+ ADD TECHNIQUE'}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', marginTop: '2px' }}>{charName}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>
        <div style={{ padding: '1rem' }}>
          <TechForm initial={tech} onSave={handleSave} onCancel={onClose} saving={saving} mode={isEdit ? 'edit' : 'char'} />
        </div>
      </div>
    </div>
  )
}

/* ── Per-character technique list (bottom panel) ────── */
function CharTechManager({ characters }) {
  const [selectedCharId, setSelectedCharId] = useState('')
  const [charTechs,      setCharTechs]      = useState([])
  const [editTech,       setEditTech]       = useState(null)    // tech to edit
  const [addMode,        setAddMode]        = useState(false)   // add new without bank

  useEffect(() => {
    if (!selectedCharId) { setCharTechs([]); return }
    const unsub = onSnapshot(collection(db, 'characters', selectedCharId, 'techniques'),
      snap => setCharTechs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [selectedCharId])

  const selectedChar = characters.find(c => c.id === selectedCharId)

  async function handleDelete(techId) {
    if (!window.confirm('Remove this technique from the character?')) return
    await deleteDoc(doc(db, 'characters', selectedCharId, 'techniques', techId))
  }

  return (
    <Card title="PER-CHARACTER TECHNIQUE MANAGEMENT">
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0.75rem', alignItems: 'start' }}>
        {/* Wybór postaci */}
        <select value={selectedCharId} onChange={e => setSelectedCharId(e.target.value)} style={{ ...inp, padding: '0.4rem 0.6rem' }}>
          <option value="">— select character —</option>
          {characters.map(c => <option key={c.id} value={c.id}>{c.identifier}{c.alias ? ' · ' + c.alias : ''}</option>)}
        </select>

        {selectedCharId && (
          <button onClick={() => setAddMode(true)} style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.4rem 0.85rem', fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
            + ADD TECHNIQUE (without bank)
          </button>
        )}
      </div>

      {selectedCharId && charTechs.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          {charTechs.map(tech => (
            <div key={tech.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0.75rem', background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', marginBottom: '2px' }}>
              {tech.imageUrl && (
                <div style={{ width: '36px', height: '36px', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--color-bo-border)' }}>
                  <img src={tech.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tech.name}</div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '2px' }}>
                  {tech.classification && <span style={{ fontSize: '0.52rem', color: 'var(--color-bo-red)', border: '1px solid var(--color-bo-red-dim)', padding: '1px 4px' }}>CLASS {tech.classification}</span>}
                  {tech.stat && <span style={{ fontSize: '0.52rem', color: '#5090d0', border: '1px solid rgba(80,144,208,0.3)', padding: '1px 4px' }}>{tech.stat.toUpperCase()}</span>}
                  {tech.origin && <span style={{ fontSize: '0.52rem', color: 'var(--color-bo-muted)' }}>{tech.origin}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                <button onClick={() => setEditTech(tech)} title="Edit" style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.25rem 0.5rem', fontSize: '0.72rem', cursor: 'pointer' }}>✎</button>
                <button onClick={() => handleDelete(tech.id)} title="Remove" style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.25rem 0.5rem', fontSize: '0.72rem', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCharId && charTechs.length === 0 && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em', textAlign: 'center', padding: '1.5rem 0', border: '1px dashed var(--color-bo-border)' }}>NO TECHNIQUES ASSIGNED</div>
      )}

      {/* Modals */}
      {(editTech || addMode) && (
        <CharTechModal
          charId={selectedCharId}
          charName={selectedChar?.identifier ?? ''}
          tech={editTech}
          onClose={() => { setEditTech(null); setAddMode(false) }}
        />
      )}
    </Card>
  )
}

/* ── Main export ────────────────────────────────────── */
export default function TechniqueManager() {
  const [bankItems,    setBankItems]    = useState([])
  const [characters,   setCharacters]   = useState([])
  const [saving,       setSaving]       = useState(false)
  const [grantTech,    setGrantTech]    = useState(null)
  const [editId,       setEditId]       = useState(null)
  const [search,       setSearch]       = useState('')
  const [filterStat,   setFilterStat]   = useState('all')

  useEffect(() => {
    getDocs(query(collection(db, 'characters'), orderBy('identifier'))).then(snap =>
      setCharacters(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    const unsub = onSnapshot(query(collection(db, 'techniqueBank'), orderBy('name')), snap =>
      setBankItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  async function handleBankSave(data) {
    setSaving(true)
    try {
      if (editId) await updateDoc(doc(db, 'techniqueBank', editId), data)
      else await addDoc(collection(db, 'techniqueBank'), { ...data, createdAt: serverTimestamp() })
      setEditId(null)
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this technique from the bank?')) return
    await deleteDoc(doc(db, 'techniqueBank', id))
  }

  const stats = ['all', ...new Set(bankItems.map(t => t.stat).filter(Boolean).sort())]
  const filtered = bankItems
    .filter(t => filterStat === 'all' || t.stat === filterStat)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || (t.origin ?? '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const editingItem = editId ? bankItems.find(t => t.id === editId) : null

  return (
    <PageShell title="TECHNIQUE BANK" subtitle="TEMPLATE TECHNIQUES — CREATE ONCE, GRANT TO ANY CHARACTER">
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* Lewa — formularz banku */}
        <div>
          <Card title={editId ? '✎ EDIT BANK TECHNIQUE' : '+ NEW BANK TECHNIQUE'}>
            <TechForm
              key={editId ?? 'new'}
              initial={editingItem}
              onSave={handleBankSave}
              onCancel={editId ? () => setEditId(null) : undefined}
              saving={saving}
              mode={editId ? 'edit' : 'bank'}
            />
          </Card>
        </div>

        {/* Prawa — grid banku */}
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search techniques..." style={{ ...inp, width: '180px', padding: '0.35rem 0.6rem' }} />
            {stats.map(s => (
              <button key={s} onClick={() => setFilterStat(s)} style={{ background: filterStat === s ? 'rgba(220,50,50,0.1)' : 'none', border: '1px solid ' + (filterStat === s ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: filterStat === s ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.3rem 0.65rem', fontSize: '0.58rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {s === 'all' ? 'ALL' : s.toUpperCase()}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>{filtered.length} TECHNIQUES</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ border: '1px dashed var(--color-bo-border)', padding: '4rem 2rem', textAlign: 'center', background: 'var(--color-bo-surface)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>
                {bankItems.length === 0 ? 'TECHNIQUE BANK IS EMPTY — CREATE YOUR FIRST TECHNIQUE' : 'NO TECHNIQUES MATCH FILTER'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '0.6rem' }}>
              {filtered.map(tech => (
                <BankTechCard
                  key={tech.id} tech={tech}
                  onGrant={setGrantTech}
                  onEdit={t => setEditId(t.id)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Per-character management */}
      <CharTechManager characters={characters} />

      {grantTech && <GrantModal tech={grantTech} characters={characters} onClose={() => setGrantTech(null)} />}
    </PageShell>
  )
}
