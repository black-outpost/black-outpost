import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, onSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'

const CLASSIFICATIONS = ['I','II','III','IV','V','VI','VII','VIII','IX','X']
const STAT_KEYS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']

const inp = { background:'var(--color-bo-elevated)', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-text)', padding:'0.45rem 0.6rem', fontSize:'0.82rem', fontFamily:'var(--font-body)', width:'100%', boxSizing:'border-box' }

function TechGrantModal({ tech, characters, onClose }) {
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
      setTimeout(() => { setGranted(false); setCharId(''); onClose() }, 1500)
    } finally { setGranting(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#111118', border: '1px solid #2e2e3f', width: '340px', boxShadow: '0 8px 40px rgba(0,0,0,0.85)' }}>
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #2e2e3f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', letterSpacing: '0.15em', color: '#e8e8f0' }}>GRANT TECHNIQUE</div>
            <div style={{ fontSize: '0.6rem', color: '#9090aa', marginTop: '2px' }}>{tech.name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9090aa', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>
        {tech.imageUrl && <div style={{ height: '90px', overflow: 'hidden', borderBottom: '1px solid #2e2e3f' }}><img src={tech.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
        <div style={{ padding: '0.85rem 1rem' }}>
          <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.16em', color: '#9090aa', marginBottom: '0.3rem' }}>SELECT CHARACTER</label>
          <select value={charId} onChange={e => setCharId(e.target.value)} style={{ ...inp, marginBottom: '0.75rem' }}>
            <option value="">— choose character —</option>
            {characters.map(c => <option key={c.id} value={c.id}>{c.identifier}{c.alias ? ' · ' + c.alias : ''}</option>)}
          </select>
          <button onClick={handleGrant} disabled={!charId || granting} style={{ width: '100%', background: granted ? 'rgba(50,200,100,0.1)' : 'rgba(220,50,50,0.1)', border: '1px solid ' + (granted ? 'rgba(50,200,100,0.4)' : '#8a1e1e'), color: granted ? '#60c080' : '#dc3232', padding: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: !charId ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: !charId ? 0.5 : 1 }}>
            {granting ? 'GRANTING...' : granted ? '✓ GRANTED' : 'GRANT TO CHARACTER'}
          </button>
        </div>
      </div>
    </div>
  )
}
const F = ({ label, children }) => (
  <div style={{ marginBottom:'0.65rem' }}>
    <label style={{ display:'block', fontSize:'0.55rem', letterSpacing:'0.16em', color:'var(--color-bo-muted)', marginBottom:'0.25rem' }}>{label}</label>
    {children}
  </div>
)

function ImagePreview({ url }) {
  const [ok, setOk] = useState(false)
  useEffect(() => { setOk(false) }, [url])
  if (!url) return null
  return (
    <div style={{ marginTop:'0.35rem', width:'100%', height:'80px', border:'1px solid var(--color-bo-border)', overflow:'hidden', background:'var(--color-bo-elevated)' }}>
      <img src={url} alt="preview" onLoad={() => setOk(true)} onError={() => setOk(false)} style={{ width:'100%', height:'100%', objectFit:'cover', display:ok?'block':'none' }} />
      {!ok && <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', color:'var(--color-bo-muted)' }}>INVALID URL</div>}
    </div>
  )
}

function MarkupCheatsheet() {
  const [open, setOpen] = useState(false)
  const rows = [
    { syntax:'**tekst**', result:<strong>pogrubienie</strong>, desc:'Bold' },
    { syntax:'{red|tekst}', result:<span style={{color:'var(--color-bo-red)'}}>czerwony</span>, desc:'Named color' },
    { syntax:'{gold|tekst}', result:<span style={{color:'#d4a840'}}>złoty</span>, desc:'' },
    { syntax:'{green|tekst}', result:<span style={{color:'#60c080'}}>zielony</span>, desc:'' },
    { syntax:'{blue|tekst}', result:<span style={{color:'#5090d0'}}>niebieski</span>, desc:'' },
    { syntax:'{#ff6644|tekst}', result:<span style={{color:'#ff6644'}}>hex</span>, desc:'Any hex/CSS color' },
    { syntax:'0.2x[Tamashi]', result:<span style={{color:'#d4a840',borderBottom:'1px dashed rgba(212,168,64,0.5)'}}>10</span>, desc:'Auto-formula' },
    { syntax:'0.2x[A]+0.3x[B]', result:<span style={{color:'#d4a840'}}>wynik</span>, desc:'Multi-stat' },
  ]
  return (
    <div style={{ marginTop:'0.75rem', border:'1px solid var(--color-bo-border)', overflow:'hidden' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ width:'100%', background:open?'var(--color-bo-elevated)':'none', border:'none', padding:'0.45rem 0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', color:'var(--color-bo-muted)' }}>
        <span style={{ fontSize:'0.55rem', letterSpacing:'0.18em' }}>MARKUP SYNTAX</span>
        <span style={{ fontSize:'0.65rem' }}>{open?'▲':'▼'}</span>
      </button>
      {open && (
        <div style={{ borderTop:'1px solid var(--color-bo-border)', padding:'0.5rem 0.75rem', background:'var(--color-bo-surface)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.68rem' }}>
            <tbody>
              {rows.map((row,i) => (
                <tr key={i} style={{ borderBottom:'1px solid rgba(46,46,63,0.5)' }}>
                  <td style={{ padding:'0.25rem 0.4rem', fontFamily:'monospace', color:'var(--color-bo-text-dim)', fontSize:'0.65rem', whiteSpace:'nowrap' }}>{row.syntax}</td>
                  <td style={{ padding:'0.25rem 0.4rem', fontFamily:'var(--font-body)' }}>{row.result}</td>
                  <td style={{ padding:'0.25rem 0.4rem', color:'var(--color-bo-muted)', fontSize:'0.6rem' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TechForm({ initial, onSave, onCancel, saving, mode='bank' }) {
  const [name,             setName]             = useState(initial?.name??'')
  const [classification,   setClassification]   = useState(initial?.classification??'I')
  const [stat,             setStat]             = useState(initial?.stat??'')
  const [origin,           setOrigin]           = useState(initial?.origin??'')
  const [description,      setDescription]      = useState(initial?.description??'')
  const [technicalDetails, setTechnicalDetails] = useState(initial?.technicalDetails??'')
  const [imageUrl,         setImageUrl]         = useState(initial?.imageUrl??'')

  function buildData() {
    return { name:name.trim(), classification, stat:stat||null, origin:origin.trim()||null, description:description.trim()||null, technicalDetails:technicalDetails.trim()||null, imageUrl:imageUrl.trim()||null }
  }

  return (
    <form onSubmit={e => { e.preventDefault(); if (name.trim()) onSave(buildData()) }}>
      <F label="TECHNIQUE NAME"><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Shikai: Luminate" style={inp} /></F>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 0.5rem' }}>
        <F label="THREAT CLASSIFICATION"><select value={classification} onChange={e => setClassification(e.target.value)} style={inp}>{CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}</select></F>
        <F label="PRIMARY STAT"><select value={stat} onChange={e => setStat(e.target.value)} style={inp}><option value="">— none —</option>{STAT_KEYS.map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}</select></F>
      </div>
      <F label="ORIGIN"><input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="e.g. Brutal Force" style={inp} /></F>
      <F label="DESCRIPTION"><textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ ...inp, resize:'vertical', lineHeight:1.6 }} /></F>
      <F label="TECHNICAL DETAILS"><textarea value={technicalDetails} onChange={e => setTechnicalDetails(e.target.value)} placeholder={'Range: 20m\nFormula: 0.2x[Tamashi]'} rows={5} style={{ ...inp, resize:'vertical', lineHeight:1.6 }} /></F>
      <F label="IMAGE URL"><input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://i.imgur.com/..." style={inp} /><ImagePreview url={imageUrl} /></F>
      <MarkupCheatsheet />
      <div style={{ display:'flex', gap:'0.4rem', marginTop:'0.75rem' }}>
        {onCancel && <button type="button" onClick={onCancel} style={{ flex:'0 0 auto', background:'none', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-muted)', padding:'0.5rem 0.75rem', fontSize:'0.6rem', letterSpacing:'0.12em', cursor:'pointer', fontFamily:'var(--font-body)' }}>CANCEL</button>}
        <button type="submit" disabled={saving||!name.trim()} style={{ flex:1, background:'rgba(220,50,50,0.1)', border:'1px solid var(--color-bo-red-dim)', color:'var(--color-bo-red)', padding:'0.5rem', fontSize:'0.62rem', letterSpacing:'0.15em', cursor:!name.trim()?'not-allowed':'pointer', fontFamily:'var(--font-body)', opacity:!name.trim()?0.5:1 }}>
          {saving?'SAVING...':mode==='edit'?'SAVE CHANGES':mode==='char'?'ADD TO CHARACTER':'ADD TO BANK'}
        </button>
      </div>
    </form>
  )
}

function BankTechCard({ tech, onGrant, onLoadToChar, onEdit, onDelete }) {
  const [imgOk, setImgOk] = useState(false)
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{ background:'var(--color-bo-surface)', border:'1px solid var(--color-bo-border)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ height:'75px', overflow:'hidden', background:'var(--color-bo-elevated)', position:'relative', flexShrink:0 }}>
        {tech.imageUrl
          ? <><img src={tech.imageUrl} alt="" onLoad={() => setImgOk(true)} style={{ width:'100%', height:'100%', objectFit:'cover', display:imgOk?'block':'none' }} />{!imgOk&&<div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', color:'var(--color-bo-border)' }}>◈</div>}</>
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', color:'var(--color-bo-border)' }}>◈</div>
        }
        {tech.classification && <div style={{ position:'absolute', top:'4px', right:'4px', fontSize:'0.48rem', background:'rgba(0,0,0,0.8)', color:'var(--color-bo-red)', padding:'2px 4px', border:'1px solid var(--color-bo-red-dim)' }}>CLASS {tech.classification}</div>}
      </div>
      <div style={{ padding:'0.45rem 0.55rem', flex:1 }}>
        <div style={{ fontSize:'0.75rem', color:'var(--color-bo-text)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:'2px' }}>{tech.name}</div>
        <div style={{ display:'flex', gap:'3px', flexWrap:'wrap', marginBottom:'3px' }}>
          {tech.origin && <span style={{ fontSize:'0.52rem', color:'var(--color-bo-muted)', background:'var(--color-bo-elevated)', border:'1px solid var(--color-bo-border)', padding:'1px 3px' }}>{tech.origin}</span>}
          {tech.stat && <span style={{ fontSize:'0.52rem', color:'#5090d0', background:'rgba(80,144,208,0.08)', border:'1px solid rgba(80,144,208,0.25)', padding:'1px 3px' }}>{tech.stat.toUpperCase()}</span>}
        </div>
        {expanded && tech.description && <p style={{ fontSize:'0.65rem', color:'var(--color-bo-text-dim)', lineHeight:1.5, margin:'0.3rem 0 0', whiteSpace:'pre-wrap' }}>{tech.description}</p>}
      </div>
      <div style={{ padding:'0.3rem 0.5rem', borderTop:'1px solid var(--color-bo-border)', display:'flex', gap:'0.3rem' }}>
        <button onClick={() => onGrant(tech)} style={{ flex:1, background:'rgba(220,50,50,0.1)', border:'1px solid var(--color-bo-red-dim)', color:'var(--color-bo-red)', padding:'0.28rem 0', fontSize:'0.52rem', letterSpacing:'0.1em', cursor:'pointer', fontFamily:'var(--font-body)' }}>▶ GRANT</button>
        <button onClick={() => onLoadToChar(tech)} title="Wczytaj do add without bank" style={{ background:'rgba(96,128,192,0.1)', border:'1px solid #2a3060', color:'#6080c0', padding:'0.28rem 0.4rem', fontSize:'0.52rem', cursor:'pointer', fontFamily:'var(--font-body)' }}>✎</button>
        <button onClick={() => setExpanded(e => !e)} style={{ background:expanded?'var(--color-bo-elevated)':'none', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-text-dim)', padding:'0.28rem 0.4rem', fontSize:'0.6rem', cursor:'pointer' }}>{expanded?'▲':'▼'}</button>
        <button onClick={() => onEdit(tech)} style={{ background:'none', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-text-dim)', padding:'0.28rem 0.4rem', fontSize:'0.62rem', cursor:'pointer' }}>✐</button>
        <button onClick={() => onDelete(tech.id)} style={{ background:'none', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-muted)', padding:'0.28rem 0.4rem', fontSize:'0.62rem', cursor:'pointer' }}>✕</button>
      </div>
    </div>
  )
}

function CharTechManager({ characters, loadTrigger }) {
  const ref = useRef(null)
  const [selectedCharId, setSelectedCharId] = useState('')
  const [charTechs,      setCharTechs]      = useState([])
  const [editTech,       setEditTech]       = useState(null)
  const [showAddForm,    setShowAddForm]     = useState(false)
  const [addInitial,     setAddInitial]      = useState(null)
  const [saving,         setSaving]         = useState(false)

  useEffect(() => {
    if (!selectedCharId) { setCharTechs([]); return }
    const unsub = onSnapshot(collection(db,'characters',selectedCharId,'techniques'), snap => setCharTechs(snap.docs.map(d => ({id:d.id,...d.data()}))))
    return unsub
  }, [selectedCharId])

  useEffect(() => {
    if (!loadTrigger) return
    setAddInitial(loadTrigger.tech)
    setShowAddForm(true)
    setEditTech(null)
    setTimeout(() => ref.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 50)
  }, [loadTrigger])

  const selectedChar = characters.find(c => c.id === selectedCharId)

  async function handleSave(data) {
    setSaving(true)
    try {
      if (editTech) {
        await updateDoc(doc(db,'characters',selectedCharId,'techniques',editTech.id), data)
        setEditTech(null)
      } else {
        await addDoc(collection(db,'characters',selectedCharId,'techniques'), {...data, createdAt:serverTimestamp()})
        setShowAddForm(false); setAddInitial(null)
      }
    } finally { setSaving(false) }
  }

  async function handleDelete(techId) {
    if (!window.confirm('Remove this technique from the character?')) return
    await deleteDoc(doc(db,'characters',selectedCharId,'techniques',techId))
  }

  return (
    <Card title="PER-CHARACTER TECHNIQUE MANAGEMENT" style={{ marginTop:'1.5rem' }}>
      <div ref={ref} />
      <div style={{ display:'flex', gap:'0.75rem', alignItems:'center', marginBottom:'0.75rem', flexWrap:'wrap' }}>
        <select value={selectedCharId} onChange={e => { setSelectedCharId(e.target.value); setEditTech(null); setShowAddForm(false) }} style={{ ...inp, width:'220px', padding:'0.4rem 0.6rem' }}>
          <option value="">— select character —</option>
          {characters.map(c => <option key={c.id} value={c.id}>{c.identifier}{c.alias?' · '+c.alias:''}</option>)}
        </select>
        {selectedCharId && (
          <button onClick={() => { setShowAddForm(s => !s); setEditTech(null); setAddInitial(null) }} style={{ background:showAddForm&&!editTech?'rgba(220,50,50,0.1)':'none', border:'1px solid '+(showAddForm&&!editTech?'var(--color-bo-red-dim)':'var(--color-bo-border)'), color:showAddForm&&!editTech?'var(--color-bo-red)':'var(--color-bo-muted)', padding:'0.4rem 0.85rem', fontSize:'0.6rem', letterSpacing:'0.15em', cursor:'pointer', fontFamily:'var(--font-body)', whiteSpace:'nowrap' }}>
            {showAddForm && !editTech ? '▲ SCHOWAJ FORMULARZ' : '+ ADD WITHOUT BANK'}
          </button>
        )}
      </div>

      {/* Formularz add/edit — inline */}
      {selectedCharId && (showAddForm || editTech) && (
        <div style={{ background:'var(--color-bo-surface)', border:'1px solid var(--color-bo-border)', padding:'1rem', marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.55rem', letterSpacing:'0.18em', color:'var(--color-bo-muted)', marginBottom:'0.75rem' }}>
            {editTech ? `✎ EDYTUJ — ${editTech.name}` : addInitial ? `WCZYTANO Z BANKU: ${addInitial.name} — edytuj i dodaj` : '+ NOWA TECHNIKA DLA: ' + (selectedChar?.identifier ?? '')}
          </div>
          <TechForm
            key={editTech?.id ?? 'add-' + (addInitial?.name ?? 'new')}
            initial={editTech ?? addInitial}
            onSave={handleSave}
            onCancel={() => { setEditTech(null); setShowAddForm(false); setAddInitial(null) }}
            saving={saving}
            mode={editTech ? 'edit' : 'char'}
          />
        </div>
      )}

      {selectedCharId && charTechs.length > 0 && (
        <div>
          {charTechs.map(tech => (
            <div key={tech.id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem 0.75rem', background:'var(--color-bo-surface)', border:'1px solid var(--color-bo-border)', marginBottom:'2px' }}>
              {tech.imageUrl && <div style={{ width:'34px', height:'34px', flexShrink:0, overflow:'hidden', border:'1px solid var(--color-bo-border)' }}><img src={tech.imageUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /></div>}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'0.8rem', color:'var(--color-bo-text)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tech.name}</div>
                <div style={{ display:'flex', gap:'0.4rem', marginTop:'2px' }}>
                  {tech.classification && <span style={{ fontSize:'0.5rem', color:'var(--color-bo-red)', border:'1px solid var(--color-bo-red-dim)', padding:'1px 3px' }}>CLASS {tech.classification}</span>}
                  {tech.stat && <span style={{ fontSize:'0.5rem', color:'#5090d0', border:'1px solid rgba(80,144,208,0.3)', padding:'1px 3px' }}>{tech.stat.toUpperCase()}</span>}
                  {tech.origin && <span style={{ fontSize:'0.5rem', color:'var(--color-bo-muted)' }}>{tech.origin}</span>}
                </div>
              </div>
              <div style={{ display:'flex', gap:'0.3rem', flexShrink:0 }}>
                <button onClick={() => { setEditTech(tech); setShowAddForm(false); setTimeout(() => ref.current?.scrollIntoView({behavior:'smooth',block:'start'}), 50) }} style={{ background:'none', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-text-dim)', padding:'0.25rem 0.5rem', fontSize:'0.7rem', cursor:'pointer' }}>✎</button>
                <button onClick={() => handleDelete(tech.id)} style={{ background:'none', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-muted)', padding:'0.25rem 0.5rem', fontSize:'0.7rem', cursor:'pointer' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCharId && charTechs.length === 0 && !showAddForm && !editTech && (
        <div style={{ fontSize:'0.7rem', color:'var(--color-bo-muted)', letterSpacing:'0.1em', textAlign:'center', padding:'1.5rem 0', border:'1px dashed var(--color-bo-border)' }}>NO TECHNIQUES ASSIGNED</div>
      )}
    </Card>
  )
}

export default function TechniqueManager() {
  const [bankItems,  setBankItems]  = useState([])
  const [characters, setCharacters] = useState([])
  const [saving,     setSaving]     = useState(false)
  const [editId,     setEditId]     = useState(null)
  const [search,     setSearch]     = useState('')
  const [filterStat, setFilterStat] = useState('all')
  const [loadToCharTrigger, setLoadToCharTrigger] = useState(null)
  const [grantModalTech, setGrantModalTech] = useState(null)

  useEffect(() => {
    getDocs(query(collection(db,'characters'), orderBy('identifier'))).then(snap => setCharacters(snap.docs.map(d => ({id:d.id,...d.data()}))))
    const unsub = onSnapshot(query(collection(db,'techniqueBank'), orderBy('name')), snap => setBankItems(snap.docs.map(d => ({id:d.id,...d.data()}))))
    return unsub
  }, [])

  async function handleBankSave(data) {
    setSaving(true)
    try {
      if (editId) await updateDoc(doc(db,'techniqueBank',editId), data)
      else await addDoc(collection(db,'techniqueBank'), {...data, createdAt:serverTimestamp()})
      setEditId(null)
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this technique from the bank?')) return
    await deleteDoc(doc(db,'techniqueBank',id))
  }

  async function handleGrant(tech, charId) {
    if (!charId) return
    const { id:_id, createdAt:_c, ...data } = tech
    await addDoc(collection(db,'characters',charId,'techniques'), {...data, createdAt:serverTimestamp()})
  }

  const stats = ['all', ...new Set(bankItems.map(t => t.stat).filter(Boolean).sort())]
  const filtered = bankItems
    .filter(t => filterStat==='all'||t.stat===filterStat)
    .filter(t => !search||t.name.toLowerCase().includes(search.toLowerCase())||(t.origin??'').toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => a.name.localeCompare(b.name))

  const editingItem = editId ? bankItems.find(t => t.id===editId) : null

  return (
    <PageShell title="TECHNIQUE BANK" subtitle="TEMPLATE TECHNIQUES — CREATE ONCE, GRANT TO ANY CHARACTER">
      <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:'1rem', marginBottom:'0' }}>
        <div>
          <Card title={editId?'✎ EDIT BANK TECHNIQUE':'+ NEW BANK TECHNIQUE'}>
            <TechForm key={editId??'new'} initial={editingItem} onSave={handleBankSave} onCancel={editId?() => setEditId(null):undefined} saving={saving} mode={editId?'edit':'bank'} />
          </Card>
        </div>

        <div>
          <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.75rem', alignItems:'center', flexWrap:'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj..." style={{ ...inp, width:'160px', padding:'0.35rem 0.6rem' }} />
            {stats.map(s => (
              <button key={s} onClick={() => setFilterStat(s)} style={{ background:filterStat===s?'rgba(220,50,50,0.1)':'none', border:'1px solid '+(filterStat===s?'var(--color-bo-red-dim)':'var(--color-bo-border)'), color:filterStat===s?'var(--color-bo-red)':'var(--color-bo-text-dim)', padding:'0.3rem 0.6rem', fontSize:'0.56rem', letterSpacing:'0.1em', cursor:'pointer', fontFamily:'var(--font-body)' }}>
                {s==='all'?'ALL':s.toUpperCase()}
              </button>
            ))}
            <span style={{ marginLeft:'auto', fontSize:'0.58rem', color:'var(--color-bo-muted)' }}>{filtered.length}</span>
          </div>

          <div style={{ height:'520px', overflowY:'auto', paddingRight:'2px' }}>
            {filtered.length === 0
              ? <div style={{ border:'1px dashed var(--color-bo-border)', padding:'4rem 2rem', textAlign:'center', background:'var(--color-bo-surface)' }}><div style={{ fontSize:'0.72rem', color:'var(--color-bo-muted)', letterSpacing:'0.1em' }}>{bankItems.length===0?'TECHNIQUE BANK IS EMPTY':'NO TECHNIQUES MATCH FILTER'}</div></div>
              : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:'0.5rem' }}>
                  {filtered.map(tech => (
                    <BankTechCard key={tech.id} tech={tech}
                      onGrant={setGrantModalTech}
                      onLoadToChar={tech => setLoadToCharTrigger({ tech, ts:Date.now() })}
                      onEdit={t => setEditId(t.id)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
            }
          </div>
        </div>
      </div>

      <CharTechManager characters={characters} loadTrigger={loadToCharTrigger} />
      {grantModalTech && <TechGrantModal tech={grantModalTech} characters={characters} onClose={() => setGrantModalTech(null)} />}
    </PageShell>
  )
}
