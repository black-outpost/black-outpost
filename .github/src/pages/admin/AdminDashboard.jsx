import { useState, useEffect } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ characters: '…', positions: '…' })
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const [c, p] = await Promise.all([
          getCountFromServer(collection(db, 'characters')),
          getCountFromServer(collection(db, 'positions')),
        ])
        setCounts({ characters: c.data().count, positions: p.data().count })
      } catch {}
    }
    load()
  }, [])

  const tiles = [
    { label: 'REGISTERED PERSONNEL', value: counts.characters, action: () => navigate('/admin/characters'), btn: 'VIEW LIST' },
    { label: 'ACTIVE POSITIONS',     value: counts.positions,  action: () => navigate('/admin/positions'),  btn: 'MANAGE'    },
  ]

  return (
    <PageShell title="DASHBOARD" subtitle="SYSTEM OVERVIEW">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {tiles.map(t => (
          <div key={t.label} style={{
            background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)',
            padding: '1.25rem',
          }}>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>{t.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-bo-text)', marginBottom: '0.75rem' }}>{t.value}</div>
            <button onClick={t.action} style={{
              background: 'none', border: '1px solid var(--color-bo-border)',
              color: 'var(--color-bo-text-dim)', padding: '0.3rem 0.75rem',
              fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}>{t.btn}</button>
          </div>
        ))}

        {/* Quick action */}
        <div style={{
          background: 'rgba(220,50,50,0.05)', border: '1px solid var(--color-bo-red-dim)',
          padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: 'var(--color-bo-red)', marginBottom: '0.5rem' }}>QUICK ACTION</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-bo-text-dim)', marginBottom: '0.75rem' }}>Create a new character record</div>
          <button onClick={() => navigate('/admin/create')} style={{
            background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)',
            color: 'var(--color-bo-red)', padding: '0.3rem 0.75rem',
            fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}>+ NEW CHARACTER</button>
        </div>
      </div>
    </PageShell>
  )
}
