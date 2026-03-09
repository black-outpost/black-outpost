import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login, isAdmin, currentUser } = useAuth()
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword]     = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  // Jeśli już zalogowany — przekieruj
  if (currentUser) {
    navigate(isAdmin ? '/admin' : '/app', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!identifier.trim() || !password) return
    setError('')
    setLoading(true)
    try {
      await login(identifier.trim(), password)
      // onAuthStateChanged w AuthContext załaduje userDoc i ustawi isAdmin
      // Przekierowanie przez useEffect po załadowaniu
    } catch (err) {
      console.error(err)
      setError('Nieprawidłowy identyfikator lub hasło.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background: 'var(--color-bo-black)' }}>

      {/* Tło — subtelna siatka */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: 'linear-gradient(var(--color-bo-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-bo-gold) 1px, transparent 1px)',
             backgroundSize: '60px 60px'
           }} />

      {/* Poświata centralna */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
      </div>

      {/* Karta logowania */}
      <div className="relative z-10 w-full max-w-sm mx-4">

        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4"
               style={{
                 border: '1px solid var(--color-bo-gold-dim)',
                 background: 'rgba(201,168,76,0.06)',
               }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2 L30 28 L16 22 L2 28 Z" stroke="var(--color-bo-gold)" strokeWidth="1.5" fill="none"/>
              <path d="M16 8 L24 26 L16 21 L8 26 Z" fill="rgba(201,168,76,0.15)"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-bo-gold)', fontSize: '1.5rem', letterSpacing: '0.15em', fontWeight: 600 }}>
            BLACK OUTPOST
          </h1>
          <p style={{ color: 'var(--color-bo-text-dim)', fontSize: '0.8rem', letterSpacing: '0.2em', marginTop: '0.25rem' }}>
            PERSONNEL IDENTIFICATION SYSTEM
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'var(--color-bo-surface)',
            border: '1px solid var(--color-bo-border)',
            padding: '2rem',
          }}>

            {/* Identifier */}
            <div className="mb-5">
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--color-bo-text-dim)', marginBottom: '0.5rem' }}>
                IDENTIFIER
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="NaiKos7429"
                autoComplete="username"
                required
                style={{
                  width: '100%',
                  background: 'var(--color-bo-elevated)',
                  border: '1px solid var(--color-bo-border)',
                  color: 'var(--color-bo-text)',
                  padding: '0.65rem 0.85rem',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-bo-gold-dim)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-bo-border)'}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--color-bo-text-dim)', marginBottom: '0.5rem' }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={{
                  width: '100%',
                  background: 'var(--color-bo-elevated)',
                  border: '1px solid var(--color-bo-border)',
                  color: 'var(--color-bo-text)',
                  padding: '0.65rem 0.85rem',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-bo-gold-dim)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-bo-border)'}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(184,50,50,0.12)',
                border: '1px solid var(--color-bo-red-dim)',
                color: '#e07070',
                padding: '0.6rem 0.85rem',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'var(--color-bo-elevated)' : 'rgba(201,168,76,0.12)',
                border: '1px solid var(--color-bo-gold-dim)',
                color: loading ? 'var(--color-bo-text-dim)' : 'var(--color-bo-gold)',
                padding: '0.75rem',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = 'rgba(201,168,76,0.2)' }}
              onMouseLeave={e => { if (!loading) e.target.style.background = 'rgba(201,168,76,0.12)' }}
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>
          ACCESS RESTRICTED TO AUTHORIZED PERSONNEL
        </p>
      </div>
    </div>
  )
}
