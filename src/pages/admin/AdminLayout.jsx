import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import AdminDashboard  from './AdminDashboard'
import CharacterList   from './CharacterList'
import CharacterCreate from './CharacterCreate'
import CharacterEdit   from './CharacterEdit'
import CharacterView   from './CharacterView'
import NazoTreeEditor  from './NazoTreeEditor'
import RewardsManager  from './RewardsManager'
import PositionManager       from './PositionManager'
import EquipmentTypeManager from './EquipmentTypeManager'
import ItemBankManager      from './ItemBankManager'
import GlobalSkillTreeEditor from './GlobalSkillTreeEditor'
import AdminTasksManager    from './AdminTasksManager'
import TechniqueManager     from './TechniqueManager'
import LogsView   from './LogsView'

const NAV = [
  { section: 'CHARACTERS', items: [
    { to: '/admin/characters', label: 'CHARACTER LIST',    icon: '◈' },
    { to: '/admin/create',     label: 'CREATE CHARACTER',  icon: '+' },
  ]},
  { section: 'MANAGEMENT', items: [
    { to: '/admin/rewards',         label: 'REWARDS & POINTS',   icon: '✦' },
    { to: '/admin/positions',       label: 'POSITIONS',          icon: '◻' },
    { to: '/admin/equipment-types', label: 'EQUIPMENT TYPES',    icon: '⚔' },
  ]},
  { section: 'CONTENT', items: [
    { to: '/admin/item-bank',   label: 'ITEM BANK',          icon: '◉' },
    { to: '/admin/techniques',  label: 'TECHNIQUE BANK',     icon: '◈' },
    { to: '/admin/skill-trees', label: 'SKILL TREE EDITOR',  icon: '⬡' },
    { to: '/admin/tasks',       label: 'ADMIN TASKS',        icon: '◆' },
  ]},
  { section: 'SYSTEM', items: [
    { to: '/admin/logs', label: 'ADMIN LOGS', icon: '▤' },
  ]},
]

export default function AdminLayout() {
  const { identifier, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() { await logout(); navigate('/') }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'transparent' }}>

      <aside style={{
        width: '220px', minWidth: '220px', height: '100vh',
        background: 'var(--color-bo-surface)',
        borderRight: '1px solid var(--color-bo-border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--color-bo-border)', minHeight: '60px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="https://i.imgur.com/OhlupcH.png" alt="Black Outpost" style={{ width: '32px', height: '32px', objectFit: 'contain', opacity: 0.9, flexShrink: 0 }} onError={e => e.target.style.display='none'} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--color-bo-red)', fontWeight: 700 }}>BLACK OUTPOST</div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginTop: '2px' }}>ADMIN CONTROL PANEL</div>
          </div>
        </div>

        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-bo-border)', background: 'rgba(220,50,50,0.06)' }}>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-bo-red)', marginBottom: '2px' }}>▲ ADMIN ACCESS</div>
          <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-display)', color: 'var(--color-bo-text)' }}>{identifier}</div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          <NavLink to="/admin" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span style={{ fontSize: '0.75rem', width: '16px', textAlign: 'center', color: 'var(--color-bo-red)', opacity: 0.7 }}>◉</span>
            DASHBOARD
          </NavLink>

          {NAV.map(({ section, items }) => (
            <div key={section}>
              <div style={{ padding: '0.75rem 1rem 0.25rem', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--color-bo-muted)' }}>{section}</div>
              {items.map(i => (
                <NavLink key={i.to} to={i.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <span style={{ fontSize: '0.75rem', width: '16px', textAlign: 'center', color: 'var(--color-bo-red)', opacity: 0.7 }}>{i.icon}</span>
                  {i.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--color-bo-border)', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <button onClick={() => navigate('/app')} style={{
            background: 'none', border: '1px solid var(--color-bo-border)',
            color: 'var(--color-bo-text-dim)', padding: '0.4rem',
            fontSize: '0.6rem', letterSpacing: '0.15em', fontFamily: 'var(--font-body)', cursor: 'pointer',
          }}>PLAYER VIEW</button>
          <button onClick={handleLogout} style={{
            background: 'rgba(220,50,50,0.06)', border: '1px solid var(--color-bo-red-dim)',
            color: 'var(--color-bo-red)', padding: '0.4rem',
            fontSize: '0.6rem', letterSpacing: '0.15em', fontFamily: 'var(--font-body)', cursor: 'pointer',
          }}>LOGOUT</button>
        </div>
      </aside>

      <main style={{ flex: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: '60px', minHeight: '60px',
          borderBottom: '1px solid var(--color-bo-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem', background: 'var(--color-bo-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)' }}>ADMIN</span>
            <span style={{ color: 'var(--color-bo-border)' }}>›</span>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-bo-text-dim)' }}>CONTROL PANEL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-bo-red)', boxShadow: '0 0 5px var(--color-bo-red)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-bo-red)' }}>ADMIN SESSION ACTIVE</span>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          <Routes>
            <Route index              element={<AdminDashboard />} />
            <Route path="characters"  element={<CharacterList />} />
            <Route path="create"      element={<CharacterCreate />} />
            <Route path="edit/:id"    element={<CharacterEdit />} />
            <Route path="view/:id"    element={<CharacterView />} />
            <Route path="nazo/:id"    element={<NazoTreeEditor />} />
            <Route path="rewards"     element={<RewardsManager />} />
            <Route path="positions"        element={<PositionManager />} />
            <Route path="equipment-types"  element={<EquipmentTypeManager />} />
            <Route path="item-bank"        element={<ItemBankManager />} />
            <Route path="techniques"       element={<TechniqueManager />} />
            <Route path="skill-trees"      element={<GlobalSkillTreeEditor />} />
            <Route path="tasks"            element={<AdminTasksManager />} />
            <Route path="logs"             element={<LogsView />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
