import PageShell, { Card, WipBadge } from '../../components/ui/PageShell'
import { useState } from 'react'

const TREES = [
  { key: 'strength',  label: 'STRENGTH'  },
  { key: 'vitality',  label: 'VITALITY'  },
  { key: 'speed',     label: 'SPEED'     },
  { key: 'defense',   label: 'DEFENSE'   },
  { key: 'reiatsu',   label: 'REIATSU'   },
  { key: 'bujutsu',   label: 'BUJUTSU'   },
  { key: 'bukijutsu', label: 'BUKIJUTSU' },
  { key: 'tamashi',   label: 'TAMASHI'   },
  { key: 'nazo',      label: '???'       },
]

export default function SkillTreeView() {
  const [active, setActive] = useState('strength')

  return (
    <PageShell title="SKILL TREES" subtitle="DEVELOPMENT PATHWAYS & NODE ACQUISITION">
      <WipBadge label="REACT FLOW INTEGRATION PENDING" />

      {/* Zakładki drzewek */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TREES.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            style={{
              background: active === t.key ? 'rgba(220,50,50,0.15)' : 'var(--color-bo-surface)',
              border: `1px solid ${active === t.key ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`,
              color: active === t.key ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)',
              padding: '0.4rem 0.85rem',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Canvas placeholder */}
      <div style={{
        background: 'var(--color-bo-surface)',
        border: '1px solid var(--color-bo-border)',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.3">
          <circle cx="16" cy="8" r="3" stroke="var(--color-bo-text)" strokeWidth="1.5"/>
          <circle cx="8"  cy="22" r="3" stroke="var(--color-bo-text)" strokeWidth="1.5"/>
          <circle cx="24" cy="22" r="3" stroke="var(--color-bo-text)" strokeWidth="1.5"/>
          <line x1="16" y1="11" x2="8"  y2="19" stroke="var(--color-bo-text)" strokeWidth="1"/>
          <line x1="16" y1="11" x2="24" y2="19" stroke="var(--color-bo-text)" strokeWidth="1"/>
        </svg>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)' }}>
          {active.toUpperCase()} TREE — LOADING
        </span>
      </div>
    </PageShell>
  )
}
