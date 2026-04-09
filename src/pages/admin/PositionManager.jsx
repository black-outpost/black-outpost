import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'

export default function PositionManager() {
  const [positions, setPositions] = useState([])
  const [newName, setNewName]     = useState('')
  const [saving, setSaving]       = useState(false)

  async function load() {
    const snap = await getDocs(query(collection(db, 'positions'), orderBy('name')))
    setPositions(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'positions'), { name: newName.trim(), createdAt: serverTimestamp() })
      setNewName('')
      load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this position?')) return
    await deleteDoc(doc(db, 'positions', id))
    load()
  }

  return (
    <PageShell title="POSITIONS" subtitle="MANAGE AVAILABLE POSITIONS">
      <div style={{ maxWidth: '500px' }}>
        <Card title="ADD POSITION">
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Delver"
              style={{
                flex: 1, background: 'var(--color-bo-elevated)',
                border: '1px solid var(--color-bo-border)',
                color: 'var(--color-bo-text)', padding: '0.55rem 0.75rem',
                fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none',
              }}
            />
            <button type="submit" disabled={saving} style={{
              background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)',
              color: 'var(--color-bo-red)', padding: '0.55rem 1.25rem',
              fontSize: '0.65rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>ADD</button>
          </form>
        </Card>

        <Card title="REGISTERED POSITIONS">
          {positions.length === 0 ? (
            <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem', textAlign: 'center', padding: '1.5rem 0', letterSpacing: '0.1em' }}>NO POSITIONS</div>
          ) : positions.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.55rem 0', borderBottom: i < positions.length - 1 ? '1px solid var(--color-bo-border)' : 'none',
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)' }}>{p.name}</span>
              <button onClick={() => handleDelete(p.id)} style={{
                background: 'none', border: 'none', color: 'var(--color-bo-muted)',
                cursor: 'pointer', fontSize: '0.7rem', padding: '0.2rem 0.4rem',
              }}>✕</button>
            </div>
          ))}
        </Card>
      </div>
    </PageShell>
  )
}
