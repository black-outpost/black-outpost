// Wspólny szablon strony — nagłówek + treść
export default function PageShell({ title, subtitle, children }) {
  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Nagłówek strony */}
      <div style={{ marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-bo-border)' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          letterSpacing: '0.2em',
          color: 'var(--color-bo-text)',
          fontWeight: 600,
          margin: '0 0 0.3rem',
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

// Karta sekcji — pojemnik na blok danych
export function Card({ title, children, style }) {
  return (
    <div style={{
      background: 'var(--color-bo-surface)',
      border: '1px solid var(--color-bo-border)',
      marginBottom: '1rem',
      ...style,
    }}>
      {title && (
        <div style={{
          padding: '0.6rem 1rem',
          borderBottom: '1px solid var(--color-bo-border)',
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          color: 'var(--color-bo-muted)',
          fontFamily: 'var(--font-body)',
        }}>
          {title}
        </div>
      )}
      <div style={{ padding: '1rem' }}>
        {children}
      </div>
    </div>
  )
}

// Badge "W budowie"
export function WipBadge({ label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      background: 'rgba(220,50,50,0.08)',
      border: '1px solid var(--color-bo-red-dim)',
      padding: '0.4rem 0.75rem',
      fontSize: '0.65rem',
      letterSpacing: '0.15em',
      color: 'var(--color-bo-red)',
      marginBottom: '1rem',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-bo-red)', display: 'inline-block' }} />
      {label || 'MODULE UNDER CONSTRUCTION'}
    </div>
  )
}
