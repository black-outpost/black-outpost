import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// Tymczasowy szkielet — zostanie rozbudowany w Etapie 3
export default function AdminLayout() {
  const { identifier, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bo-black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-bo-gold)', fontSize: '1.5rem', letterSpacing: '0.1em' }}>
          BLACK OUTPOST
        </h1>
        <p style={{ color: 'var(--color-bo-text-dim)', marginTop: '0.5rem' }}>
          Administrator: <span style={{ color: 'var(--color-bo-gold)' }}>{identifier}</span>
        </p>
        <p style={{ color: 'var(--color-bo-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Panel administracyjny — w budowie
        </p>
        <button onClick={handleLogout} style={{
          marginTop: '2rem',
          background: 'transparent',
          border: '1px solid var(--color-bo-border)',
          color: 'var(--color-bo-text-dim)',
          padding: '0.5rem 1.5rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
        }}>
          LOGOUT
        </button>
      </div>
    </div>
  )
}
