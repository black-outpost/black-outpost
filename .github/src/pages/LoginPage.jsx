import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function OnlineDot() {
  return (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 50 }}>
      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e03030', boxShadow: '0 0 6px #e03030', animation: 'pulse-dot 2s ease-in-out infinite' }} />
      <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#e03030', fontFamily: 'var(--font-body)' }}>ONLINE</span>
      <style>{`@keyframes pulse-dot { 0%,100%{opacity:1;box-shadow:0 0 6px #e03030} 50%{opacity:0.4;box-shadow:0 0 2px #e03030} }`}</style>
    </div>
  )
}

export default function LoginPage() {
  const { login, isAdmin, currentUser, userDocReady } = useAuth()
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  // Czekaj aż userDoc się załaduje — wtedy wiadomo czy admin czy gracz
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
    } catch (err) {
      setError('Invalid identifier. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bo-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', position: 'relative' }}>
      <OnlineDot />

      <div style={{ width: '100%', maxWidth: '380px', padding: '0 1.5rem' }}>
        {/* Logo / header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '64px', height: '64px', border: '1px solid var(--color-bo-red-dim)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '32px', height: '32px', border: '1px solid var(--color-bo-red)', opacity: 0.6 }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.3em', color: 'var(--color-bo-text)', fontWeight: 700, margin: '0 0 0.4rem' }}>
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
                fontSize: '1rem',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.1em',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = 'var(--color-bo-red-dim)' }}
              onBlur={e => { if (!error) e.target.style.borderColor = 'var(--color-bo-border)' }}
            />
          </div>

          {error && (
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: '#e07070', marginBottom: '0.75rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(220,50,50,0.05)' : 'rgba(220,50,50,0.1)',
              border: '1px solid var(--color-bo-red-dim)',
              color: 'var(--color-bo-red)',
              padding: '0.75rem',
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              fontFamily: 'var(--font-body)',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              marginBottom: '1.5rem',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'REQUEST ACCESS'}
          </button>
        </form>

        {/* Warning */}
        <div style={{ borderTop: '1px solid var(--color-bo-border)', paddingTop: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', lineHeight: 1.7, margin: '0 0 0.4rem' }}>
            UNAUTHORIZED ACCESS IS PROHIBITED UNDER CENTRAL 46 RESOLUTION XVI.<br />
            ALL SESSIONS ARE MONITORED AND RECORDED.
          </p>
          <p style={{ fontSize: '0.55rem', letterSpacing: '0.08em', color: '#3a3a50', margin: 0 }}>
            PROPERTY OF ORGANIZATION OF LIBERTY AND SALVATION.
          </p>
        </div>
      </div>

      {/* Version string */}
      <div style={{ position: 'fixed', bottom: '1rem', left: '1.5rem', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#2a2a38' }}>
        BLACK OUTPOST V2.1.0 | BUILD 20250316
      </div>
    </div>
  )
}
