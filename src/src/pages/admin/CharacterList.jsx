import { useState, useEffect } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'
import { useNavigate } from 'react-router-dom'

export default function CharacterList() {
  const [chars, setChars]   = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function load() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'characters'), orderBy('createdAt', 'desc')))
      setChars(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <PageShell title="CHARACTER LIST" subtitle="ALL REGISTERED PERSONNEL">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={() => navigate('/admin/create')} style={{
          background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)',
          color: 'var(--color-bo-red)', padding: '0.5rem 1.25rem',
          fontSize: '0.65rem', letterSpacing: '0.15em', cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}>+ NEW CHARACTER</button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>
      ) : chars.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
            NO CHARACTERS REGISTERED
          </div>
        </Card>
      ) : (
        <div style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 80px 100px',
            padding: '0.5rem 1rem',
            borderBottom: '1px solid var(--color-bo-border)',
            fontSize: '0.58rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)',
          }}>
            <span>IDENTIFIER</span>
            <span>NAME</span>
            <span>RACE</span>
            <span>RANK</span>
            <span>SLV</span>
            <span></span>
          </div>
          {chars.map((c, i) => (
            <div key={c.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 80px 100px',
              padding: '0.65rem 1rem',
              alignItems: 'center',
              borderBottom: i < chars.length - 1 ? '1px solid var(--color-bo-border)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', color: 'var(--color-bo-text)' }}>
                {c.identifier}
                {c.isNPC && <span style={{ marginLeft: '0.4rem', fontSize: '0.55rem', color: 'var(--color-bo-muted)', border: '1px solid var(--color-bo-border)', padding: '1px 4px' }}>NPC</span>}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-bo-text-dim)' }}>
                {c.firstName} {c.lastName}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-bo-text-dim)' }}>{c.race ?? '—'}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-bo-text-dim)' }}>{c.rank ?? 'I'}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-bo-text-dim)' }}>{c.slv ?? 'I'}</span>
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                <button onClick={() => navigate(`/admin/view/${c.id}`)} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.25rem 0.6rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>VIEW</button>
                <button onClick={() => navigate(`/admin/edit/${c.id}`)} style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.25rem 0.6rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>EDIT</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
