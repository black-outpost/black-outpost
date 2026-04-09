import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LOGO_URL = 'https://i.imgur.com/OhlupcH.png'
const BG_URL   = 'https://i.imgur.com/dg2BvAB.png'

export default function LoginPage() {
  const { login, isAdmin, currentUser, userDocReady } = useAuth()
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)

  useEffect(() => {
    if (currentUser && userDocReady) {
      navigate(isAdmin ? '/admin' : '/app', { replace: true })
    }
  }, [currentUser, isAdmin, userDocReady, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!identifier.trim()) return
    setError('')
    setLoading(true)
    try {
      await login(identifier.trim(), identifier.trim())
    } catch {
      setError('Invalid identifier. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      position: 'relative', overflow: 'hidden',
      background: 'var(--color-bo-black)',
    }}>
      {/* Background image — full opacity on login */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('${BG_URL}')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.18,
        pointerEvents: 'none',
      }} />
      {/* Dark vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,15,0.85) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Status dot */}
      <div style={{ position: 'fixed', top: '1.25rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 50 }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e03030', boxShadow: '0 0 6px #e03030', animation: 'pulse-dot 2s ease-in-out infinite' }} />
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#e03030', fontFamily: 'var(--font-body)' }}>ONLINE</span>
      </div>

      {/* Login card */}
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img
            src={LOGO_URL}
            alt="Black Outpost"
            style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '1.25rem', filter: 'drop-shadow(0 0 20px rgba(220,50,50,0.35))' }}
            onError={e => { e.target.style.display = 'none' }}
          />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '0.3em', color: 'var(--color-bo-text)', fontWeight: 700, margin: '0 0 0.4rem' }}>
            BLACK OUTPOST SYSTEM
          </h1>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', margin: 0 }}>
            CLASSIFIED ACCESS PORTAL / CENTRAL 46 — RESOLUTION XVI
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>
              PERSONNEL IDENTIFIER
            </label>
            <input
              type="text"
              value={identifier}
              onChange={e => { setIdentifier(e.target.value); setError('') }}
              placeholder="AiSo1234"
              autoComplete="off"
              spellCheck="false"
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--color-bo-surface)',
                border: `1px solid ${error ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`,
                color: 'var(--color-bo-text)',
                padding: '0.75rem 1rem',
                fontSize: '0.88rem', fontFamily: 'var(--font-body)',
                letterSpacing: '0.15em',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: '0.62rem', color: 'var(--color-bo-red)', letterSpacing: '0.1em', marginBottom: '0.75rem', padding: '0.4rem 0.75rem', border: '1px solid var(--color-bo-red-dim)', background: 'rgba(220,50,50,0.06)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !identifier.trim()}
            style={{
              width: '100%',
              background: loading ? 'rgba(220,50,50,0.06)' : 'rgba(220,50,50,0.12)',
              border: '1px solid var(--color-bo-red-dim)',
              color: loading ? 'var(--color-bo-muted)' : 'var(--color-bo-red)',
              padding: '0.75rem',
              fontSize: '0.7rem', letterSpacing: '0.25em', fontFamily: 'var(--font-display)',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', marginTop: '2rem' }}>
          UNAUTHORIZED ACCESS PROHIBITED — ALL ACTIVITY MONITORED
        </p>
      </div>
    </div>
  )
}
