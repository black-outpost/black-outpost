import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'

const inp = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)', padding: '0.5rem 0.65rem',
  fontSize: '0.85rem', fontFamily: 'var(--font-body)',
}
const F = ({ label, children }) => (
  <div style={{ marginBottom: '0.75rem' }}>
    <label style={{ display: 'block', fontSize: '0.58rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.3rem' }}>{label}</label>
    {children}
  </div>
)

const EMPTY_TYPE = { name: '', limit: 1, excludes: [] }

export default function EquipmentTypeManager() {
  const [types, setTypes]   = useState([])
  const [form, setForm]     = useState(EMPTY_TYPE)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const snap = await getDocs(query(collection(db, 'equipmentTypes'), orderBy('name')))
    setTypes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }
  useEffect(() => { load() }, [])

  function toggleExclusion(typeId) {
    setForm(f => ({
      ...f,
      excludes: f.excludes.includes(typeId)
        ? f.excludes.filter(id => id !== typeId)
        : [...f.excludes, typeId]
    }))
  }

  function startEdit(type) {
    setEditId(type.id)
    setForm({ name: type.name, limit: type.limit, excludes: type.excludes ?? [] })
  }

  function cancelEdit() {
    setEditId(null)
    setForm(EMPTY_TYPE)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editId) {
        await updateDoc(doc(db, 'equipmentTypes', editId), { name: form.name.trim(), limit: Number(form.limit), excludes: form.excludes })
      } else {
        await addDoc(collection(db, 'equipmentTypes'), { name: form.name.trim(), limit: Number(form.limit), excludes: form.excludes, createdAt: serverTimestamp() })
      }
      cancelEdit()
      load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this equipment type?')) return
    await deleteDoc(doc(db, 'equipmentTypes', id))
    load()
  }

  return (
    <PageShell title="EQUIPMENT TYPES" subtitle="DEFINE GEAR SLOTS AND CONFLICTS">
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1rem' }}>

        {/* Formularz */}
        <Card title={editId ? 'EDIT TYPE' : 'ADD TYPE'}>
          <form onSubmit={handleSave}>
            <F label="TYPE NAME (e.g. One-handed Weapon)">
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} style={inp} placeholder="One-handed Weapon" />
            </F>
            <F label="MAX EQUIPPED AT ONCE">
              <input type="number" min="1" max="10" value={form.limit} onChange={e => setForm(f => ({...f, limit: e.target.value}))} style={inp} />
            </F>
            {types.filter(t => t.id !== editId).length > 0 && (
              <F label="EXCLUDES (cannot equip together)">
                {types.filter(t => t.id !== editId).map(t => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.excludes.includes(t.id)}
                      onChange={() => toggleExclusion(t.id)}
                      style={{ accentColor: 'var(--color-bo-red)' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-bo-text-dim)' }}>{t.name}</span>
                  </label>
                ))}
              </F>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {editId && (
                <button type="button" onClick={cancelEdit} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.45rem 0.85rem', fontSize: '0.62rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  CANCEL
                </button>
              )}
              <button type="submit" disabled={saving} style={{ flex: 1, background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.45rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {saving ? 'SAVING...' : editId ? 'UPDATE' : 'ADD TYPE'}
              </button>
            </div>
          </form>
        </Card>

        {/* Lista typów */}
        <Card title="REGISTERED TYPES">
          {types.length === 0 ? (
            <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem', textAlign: 'center', padding: '2rem 0', letterSpacing: '0.1em' }}>NO TYPES DEFINED</div>
          ) : types.map(type => {
            const excNames = (type.excludes ?? []).map(id => types.find(t => t.id === id)?.name).filter(Boolean)
            return (
              <div key={type.id} style={{ padding: '0.7rem 0', borderBottom: '1px solid var(--color-bo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-bo-text)', fontWeight: 500 }}>{type.name}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--color-bo-muted)', marginTop: '2px' }}>
                    Max equipped: <span style={{ color: 'var(--color-bo-text-dim)' }}>{type.limit}</span>
                    {excNames.length > 0 && <> · Excludes: <span style={{ color: '#e07070' }}>{excNames.join(', ')}</span></>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button onClick={() => startEdit(type)} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.2rem 0.5rem', fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>EDIT</button>
                  <button onClick={() => handleDelete(type.id)} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', fontSize: '0.7rem', cursor: 'pointer', padding: '0.2rem 0.4rem' }}>✕</button>
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </PageShell>
  )
}
