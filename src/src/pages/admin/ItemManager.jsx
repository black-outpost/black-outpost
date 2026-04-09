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
      <button type="button" onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.9rem', padding: '0 0.3rem' }}>✕</button>
    </div>
  )
}

/* Podgląd obrazka przy URL */
function ImagePreview({ url }) {
  const [ok, setOk] = useState(false)
  useEffect(() => { setOk(false) }, [url])
  if (!url) return null
  return (
    <div style={{ marginTop: '0.35rem', width: '100%', height: '90px', border: '1px solid var(--color-bo-border)', overflow: 'hidden', background: 'var(--color-bo-elevated)' }}>
      <img
        src={url} alt="preview"
        onLoad={() => setOk(true)} onError={() => setOk(false)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: ok ? 'block' : 'none' }}
      />
      {!ok && <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>INVALID URL</div>}
    </div>
  )
}

/* Ikona itemu (obrazek lub emoji) */
function ItemIcon({ item, size = 28 }) {
  if (item.imageUrl) {
    return (
      <div style={{ width: size, height: size, flexShrink: 0, border: '1px solid var(--color-bo-border)', overflow: 'hidden' }}>
        <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }
  return (
    <div style={{ width: size, height: size, flexShrink: 0, background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: item.equipped ? 'var(--color-bo-red)' : 'var(--color-bo-muted)' }}>
      {item.itemType === 'equipment' ? '⚔' : '◻'}
    </div>
  )
}

export default function ItemManager() {
  const [characters,     setCharacters]     = useState([])
  const [selectedCharId, setSelectedCharId] = useState('')
  const [charItems,      setCharItems]      = useState([])
  const [equipTypes,     setEquipTypes]     = useState([])
  const [saving,         setSaving]         = useState(false)
  const [editingItem,    setEditingItem]    = useState(null)

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
  }, [])

  useEffect(() => {
    if (!selectedCharId) { setCharItems([]); return }
    const unsub = onSnapshot(
      collection(db, 'characters', selectedCharId, 'items'),
      snap => setCharItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [selectedCharId])

  function resetForm() {
    setName(''); setDescription(''); setImageUrl(''); setQuantity(1)
    setItemType('simple'); setEquipTypeId(''); setBonuses([])
  }

  function buildCleanData(overrides = {}) {
    const cleanBonuses = bonuses
      .filter(b => b.flat !== '' || b.percent !== '')
      .map(b => ({ stat: b.stat, flat: b.flat !== '' ? Number(b.flat) : 0, percent: b.percent !== '' ? Number(b.percent) : 0 }))
      .filter(b => b.flat !== 0 || b.percent !== 0)

    return {
      itemType,
      name: name.trim(),
      description: description.trim() || null,
      imageUrl: imageUrl.trim() || null,
      equipped: false,
      createdAt: serverTimestamp(),
      ...(itemType === 'simple' ? { quantity: Number(quantity) } : {}),
      ...(itemType === 'equipment' ? { equipmentTypeId: equipTypeId || null, statBonuses: cleanBonuses } : {}),
      ...overrides,
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!selectedCharId || !name.trim()) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'characters', selectedCharId, 'items'), buildCleanData())
      resetForm()
    } finally { setSaving(false) }
  }

  async function handleDelete(itemId) {
    if (!window.confirm('Remove this item from the character?')) return
    await deleteDoc(doc(db, 'characters', selectedCharId, 'items', itemId))
  }

  async function handleCopy(item) {
    const { id: _id, createdAt, ...data } = item
    await addDoc(collection(db, 'characters', selectedCharId, 'items'), { ...data, name: item.name + ' (copy)', equipped: false, createdAt: serverTimestamp() })
  }

  async function handleUpdateQuantity(itemId, qty) {
    await updateDoc(doc(db, 'characters', selectedCharId, 'items', itemId), { quantity: Number(qty) })
    setEditingItem(null)
  }

  const selectedChar = characters.find(c => c.id === selectedCharId)

  return (
    <PageShell title="ITEM MANAGER" subtitle="ASSIGN ITEMS & EQUIPMENT TO CHARACTERS">
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1rem' }}>

        {/* Panel lewy */}
        <div>
          <Card title="SELECT CHARACTER">
            <select value={selectedCharId} onChange={e => setSelectedCharId(e.target.value)} style={inp}>
              <option value="">— select character —</option>
              {characters.map(c => (
                <option key={c.id} value={c.id}>{c.identifier}{c.alias ? ' · ' + c.alias : ''}</option>
              ))}
            </select>
          </Card>

          {selectedCharId && (
            <Card title="ADD ITEM">
              <form onSubmit={handleAdd}>
                {/* Typ */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {['simple','equipment'].map(t => (
                    <button key={t} type="button" onClick={() => setItemType(t)} style={{ flex: 1, padding: '0.4rem', background: itemType === t ? 'rgba(220,50,50,0.12)' : 'var(--color-bo-elevated)', border: '1px solid ' + (itemType === t ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: itemType === t ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.12em' }}>
                      {t === 'simple' ? 'SIMPLE ITEM' : 'EQUIPMENT'}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.5rem' }}>
                  <F label="ITEM NAME">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Health Potion" style={inp} />
                  </F>

                  {itemType === 'simple' && (
                    <F label="QUANTITY" half>
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

                  <F label="DESCRIPTION (shows on hover)">
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." rows={2} style={{ ...inp, resize: 'vertical' }} />
                  </F>

                  <F label="IMAGE URL (optional — shown as icon & in hover preview)">
                    <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://i.imgur.com/..." style={inp} />
                    <ImagePreview url={imageUrl} />
                  </F>
                </div>

                {itemType === 'equipment' && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.55rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>STAT BONUSES (when equipped)</div>
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
                    <button type="button" onClick={() => setBonuses(prev => [...prev, { ...EMPTY_BONUS }])} style={{ background: 'none', border: '1px dashed var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.3rem 0.75rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%', marginTop: '0.2rem' }}>
                      + ADD BONUS
                    </button>
                  </div>
                )}

                <button type="submit" disabled={saving || !name.trim()} style={{ width: '100%', background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: (!name.trim() || saving) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', marginTop: '0.25rem', opacity: !name.trim() ? 0.5 : 1 }}>
                  {saving ? 'ADDING...' : 'ADD ITEM TO CHARACTER'}
                </button>
              </form>
            </Card>
          )}
        </div>

        {/* Panel prawy — lista itemów */}
        <div>
          {!selectedCharId ? (
            <div style={{ border: '1px dashed var(--color-bo-border)', padding: '4rem 2rem', textAlign: 'center', background: 'var(--color-bo-surface)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>SELECT A CHARACTER TO MANAGE THEIR ITEMS</div>
            </div>
          ) : (
            <Card title={'ITEMS — ' + (selectedChar?.identifier ?? '')}>
              {charItems.length === 0 ? (
                <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em', textAlign: 'center', padding: '2rem 0' }}>NO ITEMS ASSIGNED</div>
              ) : charItems.map(item => {
                const typeName = equipTypes.find(t => t.id === item.equipmentTypeId)?.name
                return (
                  <div key={item.id} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--color-bo-border)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <ItemIcon item={item} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', fontWeight: 500 }}>{item.name}</span>
                        {item.equipped && <span style={{ fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--color-bo-red)', border: '1px solid var(--color-bo-red-dim)', padding: '1px 4px', flexShrink: 0 }}>EQUIPPED</span>}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--color-bo-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {item.itemType === 'simple' && (item.quantity ?? 1) > 1 && <span>×{item.quantity}</span>}
                        {typeName && <span style={{ color: 'var(--color-bo-text-dim)' }}>{typeName}</span>}
                        {item.description && <span style={{ fontStyle: 'italic', color: 'var(--color-bo-muted)' }}>{item.description}</span>}
                        {(item.statBonuses ?? []).filter(b => b.flat || b.percent).map((b, i) => (
                          <span key={i} style={{ color: '#60c080' }}>
                            {b.flat    ? (b.flat    > 0 ? '+' : '') + b.flat    + ' ' + b.stat + ' ' : ''}
                            {b.percent ? (b.percent > 0 ? '+' : '') + b.percent + '% ' + b.stat : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0, alignItems: 'center' }}>
                      {item.itemType === 'simple' && editingItem?.id === item.id ? (
                        <input type="number" min="1" defaultValue={item.quantity ?? 1} autoFocus
                          onBlur={e => handleUpdateQuantity(item.id, e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleUpdateQuantity(item.id, e.target.value); if (e.key === 'Escape') setEditingItem(null) }}
                          style={{ width: '50px', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-text)', padding: '0.15rem 0.3rem', fontSize: '0.75rem', fontFamily: 'var(--font-body)' }}
                        />
                      ) : item.itemType === 'simple' && (
                        <button onClick={() => setEditingItem({ id: item.id })} title="Edit quantity" style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.72rem', padding: '0.1rem 0.3rem' }}>✎</button>
                      )}
                      <button onClick={() => handleCopy(item)} title="Duplicate" style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.72rem', padding: '0.1rem 0.3rem' }}>⧉</button>
                      <button onClick={() => handleDelete(item.id)} title="Remove" style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.1rem 0.3rem' }}>✕</button>
                    </div>
                  </div>
                )
              })}
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  )
}
