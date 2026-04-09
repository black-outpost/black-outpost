import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, onSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'

const STAT_KEYS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']

const inp = {
  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)', padding: '0.45rem 0.6rem',
  fontSize: '0.82rem', fontFamily: 'var(--font-body)',
  width: '100%', boxSizing: 'border-box',
}
const F = ({ label, children, half }) => (
  <div style={{ marginBottom: '0.65rem', gridColumn: half ? 'span 1' : 'span 2' }}>
    <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>{label}</label>
    {children}
  </div>
)

const EMPTY_BONUS = { stat: 'strength', flat: '', percent: '' }

function BonusRow({ bonus, onChange, onRemove }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px auto', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' }}>
      <select value={bonus.stat} onChange={e => onChange({ ...bonus, stat: e.target.value })} style={{ ...inp, padding: '0.35rem 0.5rem' }}>
        {STAT_KEYS.map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
      </select>
      <input type="number" value={bonus.flat}    onChange={e => onChange({ ...bonus, flat: e.target.value })}    placeholder="+flat" style={{ ...inp, padding: '0.35rem 0.5rem' }} />
      <input type="number" value={bonus.percent} onChange={e => onChange({ ...bonus, percent: e.target.value })} placeholder="+%"    style={{ ...inp, padding: '0.35rem 0.5rem' }} />
      <button type="button" onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
    </div>
  )
}

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

/* Modal nadawania itemu graczowi */
function GrantModal({ bankItem, characters, onClose }) {
  const [charId,   setCharId]   = useState('')
  const [quantity, setQuantity] = useState(bankItem.quantity ?? 1)
  const [granting, setGranting] = useState(false)
  const [granted,  setGranted]  = useState(false)

  async function handleGrant() {
    if (!charId) return
    setGranting(true)
    try {
      const { id: _id, createdAt: _c, ...data } = bankItem
      await addDoc(collection(db, 'characters', charId, 'items'), {
        ...data,
        quantity: bankItem.itemType === 'simple' ? Number(quantity) : undefined,
        equipped: false,
        createdAt: serverTimestamp(),
      })
      setGranted(true)
      setTimeout(() => { setGranted(false); setCharId('') }, 1500)
    } finally { setGranting(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--color-bo-dark)', border: '1px solid var(--color-bo-border)', width: '360px', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}>
        {/* Header */}
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--color-bo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', letterSpacing: '0.15em', color: 'var(--color-bo-text)' }}>GRANT ITEM</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', marginTop: '2px' }}>{bankItem.name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>

        {/* Image */}
        {bankItem.imageUrl && (
          <div style={{ height: '100px', overflow: 'hidden', borderBottom: '1px solid var(--color-bo-border)' }}>
            <img src={bankItem.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ padding: '0.85rem 1rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.3rem' }}>SELECT CHARACTER</label>
            <select value={charId} onChange={e => setCharId(e.target.value)} style={inp}>
              <option value="">— choose character —</option>
              {characters.map(c => <option key={c.id} value={c.id}>{c.identifier}{c.alias ? ' · ' + c.alias : ''}</option>)}
            </select>
          </div>

          {bankItem.itemType === 'simple' && (
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.3rem' }}>QUANTITY</label>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ ...inp, width: '120px' }} />
            </div>
          )}

          <button
            onClick={handleGrant} disabled={!charId || granting}
            style={{ width: '100%', background: granted ? 'rgba(50,200,100,0.1)' : 'rgba(220,50,50,0.1)', border: '1px solid ' + (granted ? 'rgba(50,200,100,0.4)' : 'var(--color-bo-red-dim)'), color: granted ? '#60c080' : 'var(--color-bo-red)', padding: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: !charId ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.3s', opacity: !charId ? 0.5 : 1 }}
          >
            {granting ? 'GRANTING...' : granted ? '✓ GRANTED' : 'GRANT TO CHARACTER'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Karta banku */
function BankItemCard({ item, equipTypes, onGrant, onDelete, onEdit }) {
  const typeName = equipTypes.find(t => t.id === item.equipmentTypeId)?.name
  const bonuses  = (item.statBonuses ?? []).filter(b => b.flat || b.percent)
  const [imgOk,  setImgOk] = useState(false)

  return (
    <div style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'border-color 0.15s' }}>
      {/* Obrazek lub placeholder */}
      <div style={{ height: '90px', overflow: 'hidden', background: 'var(--color-bo-elevated)', position: 'relative', flexShrink: 0 }}>
        {item.imageUrl ? (
          <>
            <img src={item.imageUrl} alt="" onLoad={() => setImgOk(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: imgOk ? 'block' : 'none' }} />
            {!imgOk && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--color-bo-border)' }}>{item.itemType === 'equipment' ? '⚔' : '◻'}</div>}
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'var(--color-bo-border)' }}>
            {item.itemType === 'equipment' ? '⚔' : '◻'}
          </div>
        )}
        {/* Typ badge */}
        <div style={{ position: 'absolute', top: '4px', left: '4px', fontSize: '0.5rem', letterSpacing: '0.1em', background: 'rgba(0,0,0,0.75)', color: item.itemType === 'equipment' ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', padding: '2px 5px', border: '1px solid var(--color-bo-border)' }}>
          {item.itemType === 'equipment' ? 'EQUIPMENT' : 'ITEM'}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '0.55rem 0.65rem', flex: 1 }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
        {typeName && <div style={{ fontSize: '0.58rem', color: 'var(--color-bo-muted)', letterSpacing: '0.08em', marginBottom: '3px' }}>{typeName}</div>}
        {item.description && <div style={{ fontSize: '0.65rem', color: 'var(--color-bo-text-dim)', lineHeight: 1.4, marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</div>}
        {bonuses.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '3px' }}>
            {bonuses.map((b, i) => (
              <span key={i} style={{ fontSize: '0.6rem', color: '#60c080', background: 'rgba(60,200,100,0.08)', border: '1px solid rgba(60,200,100,0.2)', padding: '1px 4px' }}>
                {b.flat    ? (b.flat    > 0 ? '+' : '') + b.flat    + ' ' + b.stat : ''}
                {b.percent ? (b.percent > 0 ? '+' : '') + b.percent + '% ' + b.stat : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Akcje */}
      <div style={{ padding: '0.4rem 0.65rem', borderTop: '1px solid var(--color-bo-border)', display: 'flex', gap: '0.35rem' }}>
        <button onClick={() => onGrant(item)} style={{ flex: 1, background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.35rem 0', fontSize: '0.58rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          ▶ GRANT
        </button>
        <button onClick={() => onEdit(item)} title="Edit" style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.35rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer' }}>✎</button>
        <button onClick={() => onDelete(item.id)} title="Delete from bank" style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.35rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
      </div>
    </div>
  )
}

export default function ItemBankManager() {
  const [bankItems,  setBankItems]  = useState([])
  const [characters, setCharacters] = useState([])
  const [equipTypes, setEquipTypes] = useState([])
  const [saving,     setSaving]     = useState(false)
  const [grantItem,  setGrantItem]  = useState(null)   // item do nadania
  const [editItem,   setEditItem]   = useState(null)   // item do edycji (id)
  const [filter,     setFilter]     = useState('all')  // 'all' | 'simple' | 'equipment'
  const [search,     setSearch]     = useState('')
  const [sort,       setSort]       = useState('name')

  // Form state
  const [itemType,    setItemType]    = useState('simple')
  const [name,        setName]        = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl,    setImageUrl]    = useState('')
  const [quantity,    setQuantity]    = useState(1)
  const [equipTypeId, setEquipTypeId] = useState('')
  const [bonuses,     setBonuses]     = useState([])

  useEffect(() => {
    getDocs(query(collection(db, 'characters'), orderBy('identifier'))).then(snap =>
      setCharacters(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    getDocs(collection(db, 'equipmentTypes')).then(snap =>
      setEquipTypes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    const unsub = onSnapshot(query(collection(db, 'itemBank'), orderBy('name')), snap =>
      setBankItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  function resetForm() {
    setName(''); setDescription(''); setImageUrl(''); setQuantity(1)
    setItemType('simple'); setEquipTypeId(''); setBonuses([])
    setEditItem(null)
  }

  function loadFormFromItem(item) {
    setEditItem(item.id)
    setItemType(item.itemType ?? 'simple')
    setName(item.name ?? '')
    setDescription(item.description ?? '')
    setImageUrl(item.imageUrl ?? '')
    setQuantity(item.quantity ?? 1)
    setEquipTypeId(item.equipmentTypeId ?? '')
    setBonuses((item.statBonuses ?? []).map(b => ({ stat: b.stat, flat: b.flat ?? '', percent: b.percent ?? '' })))
  }

  function buildData() {
    const cleanBonuses = bonuses
      .filter(b => b.flat !== '' || b.percent !== '')
      .map(b => ({ stat: b.stat, flat: b.flat !== '' ? Number(b.flat) : 0, percent: b.percent !== '' ? Number(b.percent) : 0 }))
      .filter(b => b.flat !== 0 || b.percent !== 0)
    return {
      itemType, name: name.trim(),
      description: description.trim() || null,
      imageUrl: imageUrl.trim() || null,
      ...(itemType === 'simple' ? { quantity: Number(quantity) } : {}),
      ...(itemType === 'equipment' ? { equipmentTypeId: equipTypeId || null, statBonuses: cleanBonuses } : {}),
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      if (editItem) {
        await updateDoc(doc(db, 'itemBank', editItem), buildData())
      } else {
        await addDoc(collection(db, 'itemBank'), { ...buildData(), createdAt: serverTimestamp() })
      }
      resetForm()
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item from the bank?')) return
    await deleteDoc(doc(db, 'itemBank', id))
  }

  const filtered = bankItems
    .filter(i => filter === 'all' || i.itemType === filter)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : (a.itemType === 'equipment' ? -1 : 1))

  return (
    <PageShell title="ITEM BANK" subtitle="TEMPLATE ITEMS — CREATE ONCE, GRANT TO ANY CHARACTER">
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1rem' }}>

        {/* Lewa kolumna — formularz */}
        <div>
          <Card title={editItem ? '✎ EDIT BANK ITEM' : '+ NEW BANK ITEM'}>
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {['simple','equipment'].map(t => (
                  <button key={t} type="button" onClick={() => setItemType(t)} style={{ flex: 1, padding: '0.4rem', background: itemType === t ? 'rgba(220,50,50,0.12)' : 'var(--color-bo-elevated)', border: '1px solid ' + (itemType === t ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: itemType === t ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.12em' }}>
                    {t === 'simple' ? 'SIMPLE ITEM' : 'EQUIPMENT'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.5rem' }}>
                <F label="ITEM NAME">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Zanpakuto" style={inp} />
                </F>

                {itemType === 'simple' && (
                  <F label="DEFAULT QUANTITY" half>
                    <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} style={inp} />
                  </F>
                )}

                {itemType === 'equipment' && equipTypes.length > 0 && (
                  <F label="EQUIPMENT TYPE" half>
                    <select value={equipTypeId} onChange={e => setEquipTypeId(e.target.value)} style={inp}>
                      <option value="">— none —</option>
                      {equipTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </F>
                )}

                <F label="DESCRIPTION">
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Flavour text or effect..." rows={2} style={{ ...inp, resize: 'vertical' }} />
                </F>

                <F label="IMAGE URL (optional)">
                  <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://i.imgur.com/..." style={inp} />
                  <ImagePreview url={imageUrl} />
                </F>
              </div>

              {itemType === 'equipment' && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.55rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>STAT BONUSES</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px auto', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.55rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>STAT</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>FLAT</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>%</span>
                    <span />
                  </div>
                  {bonuses.map((b, i) => (
                    <BonusRow key={i} bonus={b}
                      onChange={nb => setBonuses(prev => prev.map((x, j) => j === i ? nb : x))}
                      onRemove={() => setBonuses(prev => prev.filter((_, j) => j !== i))}
                    />
                  ))}
                  <button type="button" onClick={() => setBonuses(prev => [...prev, { ...EMPTY_BONUS }])} style={{ background: 'none', border: '1px dashed var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.3rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%' }}>
                    + ADD BONUS
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {editItem && (
                  <button type="button" onClick={resetForm} style={{ flex: '0 0 auto', background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.5rem 0.75rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    CANCEL
                  </button>
                )}
                <button type="submit" disabled={saving || !name.trim()} style={{ flex: 1, background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: !name.trim() ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: !name.trim() ? 0.5 : 1 }}>
                  {saving ? 'SAVING...' : editItem ? 'SAVE CHANGES' : 'ADD TO BANK'}
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Prawa kolumna — grid kart */}
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." style={{ ...inp, width: '180px', padding: '0.35rem 0.6rem' }} />
            {['all','simple','equipment'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'rgba(220,50,50,0.1)' : 'none', border: '1px solid ' + (filter === f ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: filter === f ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.3rem 0.7rem', fontSize: '0.58rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {f.toUpperCase()}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              <button onClick={() => setSort('name')}  style={{ background: sort === 'name'  ? 'rgba(220,50,50,0.1)' : 'none', border: '1px solid ' + (sort === 'name'  ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: sort === 'name'  ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.28rem 0.55rem', fontSize: '0.58rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>A–Z</button>
              <button onClick={() => setSort('type')}  style={{ background: sort === 'type'  ? 'rgba(220,50,50,0.1)' : 'none', border: '1px solid ' + (sort === 'type'  ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: sort === 'type'  ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.28rem 0.55rem', fontSize: '0.58rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>EQUIP FIRST</button>
              <span style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em', marginLeft: '0.25rem' }}>{filtered.length}</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ border: '1px dashed var(--color-bo-border)', padding: '4rem 2rem', textAlign: 'center', background: 'var(--color-bo-surface)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>
                {bankItems.length === 0 ? 'ITEM BANK IS EMPTY — CREATE YOUR FIRST TEMPLATE' : 'NO ITEMS MATCH FILTER'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '0.6rem' }}>
              {filtered.map(item => (
                <BankItemCard
                  key={item.id} item={item} equipTypes={equipTypes}
                  onGrant={setGrantItem}
                  onEdit={loadFormFromItem}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {grantItem && (
        <GrantModal bankItem={grantItem} characters={characters} onClose={() => setGrantItem(null)} />
      )}
    </PageShell>
  )
}
