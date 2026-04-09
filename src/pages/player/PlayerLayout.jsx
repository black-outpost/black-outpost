import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCharacter } from '../../hooks/useCharacter'

import StatsView       from './StatsView'
import SkillTreeView   from './SkillTreeView'
import EquipmentView   from './EquipmentView'
import TechniquesView  from './TechniquesView'
import HistoryView     from './HistoryView'
import IdentifierView  from './IdentifierView'
import PublicSearch    from './PublicSearch'

// ── OST Context — PublicSearch może nadpisać aktywny url ─────────────────
export const OSTContext = createContext(null)

const NAV_ITEMS = [
  { to: '/app/stats',      label: 'STATISTICS',      icon: '▣', section: 'CHARACTER' },
  { to: '/app/trees',      label: 'SKILL TREES',     icon: '◈', section: 'CHARACTER' },
  { to: '/app/equipment',  label: 'EQUIPMENT',       icon: '⚔', section: 'CHARACTER' },
  { to: '/app/techniques', label: 'TECHNIQUES',      icon: '✦', section: 'CHARACTER' },
  { to: '/app/history',    label: 'HISTORY & LORE',  icon: '◻', section: 'DOSSIER'   },
  { to: '/app/identifier', label: 'IDENTIFIER CARD', icon: '▨', section: 'DOSSIER'   },
  { to: '/app/search',     label: 'PERSONNEL SEARCH',icon: '◎', section: 'SYSTEM'    },
]

const SECTIONS = ['CHARACTER', 'DOSSIER', 'SYSTEM']

export default function PlayerLayout() {
  const { identifier, logout, isAdmin } = useAuth()
  const { character } = useCharacter()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  // ── OST Player ───────────────────────────────────────────────────────────
  const audioRef         = useRef(null)
  const myOstUrl         = character?.ostUrl ?? null
  const [overrideUrl,    setOverrideUrl]    = useState(null)
  const [volume,         setVolume]         = useState(0.07)
  const [playing,        setPlaying]        = useState(false)
  const [needsClick,     setNeedsClick]     = useState(false) // autoplay zablokowany — czekamy na klik
  const activeUrl = overrideUrl ?? myOstUrl

  // Próba odtworzenia — używana wielokrotnie
  function tryPlay(audio, url) {
    if (!audio || !url) return
    if (audio.src !== url) {
      audio.src  = url
      audio.loop = true
    }
    audio.volume = volume
    audio.play()
      .then(() => { setPlaying(true); setNeedsClick(false) })
      .catch(() => setNeedsClick(true)) // przeglądarka zablokowała — pokaż prompt
  }

  // Reaguj na zmianę activeUrl
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!activeUrl) {
      audio.pause(); audio.src = ''
      setPlaying(false); setNeedsClick(false)
      return
    }
    tryPlay(audio, activeUrl)
  }, [activeUrl])

  // Gdy volume się zmienia — zsynchronizuj
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Gdy przeglądarka zablokowała — odblokuj przy pierwszym kliku na stronę
  useEffect(() => {
    if (!needsClick || !activeUrl) return
    function onInteract() {
      tryPlay(audioRef.current, activeUrl)
      window.removeEventListener('click',   onInteract)
      window.removeEventListener('keydown', onInteract)
    }
    window.addEventListener('click',   onInteract)
    window.addEventListener('keydown', onInteract)
    return () => {
      window.removeEventListener('click',   onInteract)
      window.removeEventListener('keydown', onInteract)
    }
  }, [needsClick, activeUrl])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || !activeUrl) return
    if (audio.paused) {
      audio.play().then(() => { setPlaying(true); setNeedsClick(false) }).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'transparent' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: collapsed ? '56px' : '220px',
        minWidth: collapsed ? '56px' : '220px',
        height: '100vh',
        background: 'var(--color-bo-surface)',
        borderRight: '1px solid var(--color-bo-border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden', zIndex: 20,
      }}>

        {/* Header */}
        <div style={{
          padding: collapsed ? '1rem 0' : '1.25rem 1rem',
          borderBottom: '1px solid var(--color-bo-border)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: '60px',
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="https://i.imgur.com/OhlupcH.png" alt="Black Outpost" style={{ width: '32px', height: '32px', objectFit: 'contain', opacity: 0.9 }} onError={e => e.target.style.display='none'} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--color-bo-red)', fontWeight: 700 }}>
                  BLACK OUTPOST
                </div>
                <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginTop: '2px' }}>
                  PERSONNEL SYSTEM
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <img src="https://i.imgur.com/OhlupcH.png" alt="BO" style={{ width: '28px', height: '28px', objectFit: 'contain', opacity: 0.7 }} onError={e => e.target.style.display='none'} />
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-bo-muted)', padding: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              {collapsed
                ? <path d="M4 2 L10 7 L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                : <path d="M10 2 L4 7 L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              }
            </svg>
          </button>
        </div>

        {/* Identifier */}
        {!collapsed && (
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-bo-border)', background: 'rgba(220,50,50,0.04)' }}>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '3px' }}>ACTIVE IDENTIFIER</div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-display)', color: 'var(--color-bo-text)' }}>{identifier}</div>
            {isAdmin && <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-bo-red)', marginTop: '3px' }}>ADMIN ACCESS</div>}
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          {SECTIONS.map(section => {
            const items = NAV_ITEMS.filter(i => i.section === section)
            return (
              <div key={section}>
                {!collapsed && (
                  <div style={{ padding: '0.75rem 1rem 0.25rem', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--color-bo-muted)' }}>
                    {section}
                  </div>
                )}
                {items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}${collapsed ? ' collapsed' : ''}`}
                  >
                    <span style={{ fontSize: '0.75rem', width: '16px', textAlign: 'center', color: 'var(--color-bo-red)', opacity: 0.7, flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && item.label}
                  </NavLink>
                ))}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--color-bo-border)', padding: collapsed ? '0.75rem 0' : '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {isAdmin && !collapsed && (
            <button onClick={() => navigate('/admin')} style={{
              background: 'rgba(220,50,50,0.08)', border: '1px solid var(--color-bo-red-dim)',
              color: 'var(--color-bo-red)', padding: '0.4rem',
              fontSize: '0.6rem', letterSpacing: '0.15em', fontFamily: 'var(--font-body)', cursor: 'pointer',
            }}>ADMIN PANEL</button>
          )}
          <button onClick={handleLogout} title={collapsed ? 'Logout' : undefined} style={{
            background: 'none', border: '1px solid var(--color-bo-border)',
            color: 'var(--color-bo-text-dim)', padding: collapsed ? '0.5rem 0' : '0.45rem',
            fontSize: '0.6rem', letterSpacing: '0.15em', fontFamily: 'var(--font-body)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2H2V10H4" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7 4L10 6L7 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="10" y1="6" x2="5" y2="6" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            {!collapsed && 'LOGOUT'}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: '60px', minHeight: '60px',
          borderBottom: '1px solid var(--color-bo-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem', background: 'var(--color-bo-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)' }}>BLACK OUTPOST</span>
            <span style={{ color: 'var(--color-bo-border)' }}>›</span>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-bo-text-dim)' }}>PERSONNEL FILE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* OST player — widoczny tylko gdy jest aktywny url */}
            {activeUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--color-bo-border)', paddingLeft: '0.75rem' }}>
                <button
                  onClick={togglePlay}
                  title={playing ? 'Pause OST' : 'Play OST'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: playing ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', fontSize: '0.75rem', padding: '2px 4px', lineHeight: 1, transition: 'color 0.15s' }}
                >
                  {playing ? '▐▐' : '▶'}
                </button>
                <span style={{
                  fontSize: '0.5rem', letterSpacing: '0.12em', whiteSpace: 'nowrap',
                  color: needsClick ? '#d4a840' : 'var(--color-bo-muted)',
                }}>
                  {needsClick ? '♪ KLIKNIJ GDZIEKOLWIEK' : 'OST'}
                </span>
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  title={`Głośność: ${Math.round(volume * 100)}%`}
                  style={{ width: '72px', accentColor: 'var(--color-bo-red)', cursor: 'pointer', height: '3px' }}
                />
                <span style={{ fontSize: '0.5rem', color: 'var(--color-bo-muted)', minWidth: '22px' }}>{Math.round(volume * 100)}%</span>
              </div>
            )}
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-bo-red)', boxShadow: '0 0 5px var(--color-bo-red)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-bo-red)' }}>SECURE CONNECTION</span>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          <OSTContext.Provider value={{ setOverrideUrl, myOstUrl, volume, setVolume, playing, togglePlay }}>
            <Routes>
              <Route index element={<Navigate to="/app/stats" replace />} />
              <Route path="stats"      element={<StatsView />} />
              <Route path="trees"      element={<SkillTreeView />} />
              <Route path="equipment"  element={<EquipmentView />} />
              <Route path="techniques" element={<TechniquesView />} />
              <Route path="history"    element={<HistoryView />} />
              <Route path="identifier" element={<IdentifierView />} />
              <Route path="search"     element={<PublicSearch />} />
            </Routes>
          </OSTContext.Provider>
        </div>
      </main>

      {/* Ukryty element audio — zarządzany przez PlayerLayout */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
}
