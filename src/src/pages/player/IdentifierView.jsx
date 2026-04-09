import { useCharacter } from '../../hooks/useCharacter'
import PageShell from '../../components/ui/PageShell'
import IdentifierCard from '../../components/ui/IdentifierCard'

export default function IdentifierView() {
  const { character, loading } = useCharacter()
  if (loading) return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>

  return (
    <PageShell title="IDENTIFIER CARD" subtitle="YOUR PERSONNEL IDENTIFICATION DOCUMENT">
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <IdentifierCard char={character} />
        <div style={{ maxWidth: '280px' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.75rem' }}>
            DOCUMENT NOTES
          </div>
          <div style={{
            background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)',
            padding: '1rem', fontSize: '0.72rem', lineHeight: 1.7, color: 'var(--color-bo-text-dim)',
          }}>
            <p style={{ margin: '0 0 0.5rem' }}>This identification card is your official Black Outpost personnel document.</p>
            <p style={{ margin: '0 0 0.5rem' }}>Your DID (Document ID) is your public identifier. It does not grant access to your account.</p>
            <p style={{ margin: 0, color: 'var(--color-bo-red)', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
              ⚠ Never share your login credentials with other personnel.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
