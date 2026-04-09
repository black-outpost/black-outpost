import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import StatsView       from './StatsView'
import SkillTreeView   from './SkillTreeView'
import EquipmentView   from './EquipmentView'
import TechniquesView  from './TechniquesView'
import HistoryView     from './HistoryView'
import IdentifierView  from './IdentifierView'
import PublicSearch    from './PublicSearch'

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
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--color-bo-black)' }}>

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
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--color-bo-red)', fontWeight: 700 }}>
                BLACK OUTPOST
              </div>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginTop: '2px' }}>
                PERSONNEL SYSTEM
              </div>
            </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-bo-red)', boxShadow: '0 0 5px var(--color-bo-red)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-bo-red)' }}>SECURE CONNECTION</span>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
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
        </div>
      </main>
    </div>
  )
}
