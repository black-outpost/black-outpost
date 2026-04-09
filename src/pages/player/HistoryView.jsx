import { useCharacter } from '../../hooks/useCharacter'
import PageShell, { Card } from '../../components/ui/PageShell'

export default function HistoryView() {
  const { character, loading } = useCharacter()
  if (loading) return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>
  const c = character ?? {}

  return (
    <PageShell title="HISTORY & LORE" subtitle="PERSONNEL DOSSIER — CLASSIFIED">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <Card title="APPEARANCE">
          <p style={{ color: c.appearance ? 'var(--color-bo-text)' : 'var(--color-bo-muted)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>
            {c.appearance || '— No data —'}
          </p>
        </Card>
        <Card title="PERSONALITY">
          <p style={{ color: c.personality ? 'var(--color-bo-text)' : 'var(--color-bo-muted)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>
            {c.personality || '— No data —'}
          </p>
        </Card>
      </div>
      <Card title="HISTORY">
        <p style={{ color: c.history ? 'var(--color-bo-text)' : 'var(--color-bo-muted)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>
          {c.history || '— No data —'}
        </p>
      </Card>
      {c.additionalInfo && (
        <Card title="ADDITIONAL INFORMATION" style={{ marginTop: '1rem' }}>
          <p style={{ color: 'var(--color-bo-text)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
            {c.additionalInfo}
          </p>
        </Card>
      )}
      {c.publicInfo && (
        <Card title="PUBLIC INFO" style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>
            Ta sekcja jest widoczna dla innych graczy z odpowiednim Security Clearance.
          </div>
          <p style={{ color: 'var(--color-bo-text)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>
            {c.publicInfo}
          </p>
        </Card>
      )}
    </PageShell>
  )
}
