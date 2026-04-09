/**
 * Karta ID — biały design.
 * NIE pokazuje imienia, nazwiska ani identyfikatora logowania.
 */
export default function IdentifierCard({ char }) {
  if (!char) return null

  const did      = char.did      ?? '000000'
  const alias    = char.alias    ?? null
  const position = char.position ?? null
  const rank     = char.rank     ?? 'I'
  const slv      = char.slv      ?? 'I'
  const sca      = char.sca      ?? 'I'
  const photo    = char.photoUrl ?? null
  const joinDate = char.joinDate ?? null


  return (
    <div style={{
      width: '460px',
      background: 'linear-gradient(160deg, #f5f4f5 0%, #e8e7ea 100%)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 6px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.8)',
      fontFamily: 'Arial, sans-serif',
      color: '#111',
      userSelect: 'none',
    }}>

      {/* ── GÓRNY PASEK: logo + tytuł + [pozycja] ── */}
      <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Logo placeholder */}
          <div style={{
            width: '48px', height: '48px',
            border: '2px dashed #aaa',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.04)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '0.45rem', textAlign: 'center', color: '#999', lineHeight: 1.2, letterSpacing: '0.02em' }}>LOGO</span>
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.45rem', letterSpacing: '-0.01em', lineHeight: 1, color: '#111' }}>
              BLACK  OUTPOST
            </div>
            <div style={{ fontSize: '0.48rem', letterSpacing: '0.18em', color: '#666', marginTop: '2px' }}>
              ORGANIZATION OF LIBERTY AND SALVATION
            </div>
          </div>
        </div>

        {/* Position badge */}
        {position && (
          <div style={{
            border: '1.5px solid #333', padding: '3px 9px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
            color: '#222', background: 'rgba(255,255,255,0.5)',
            whiteSpace: 'nowrap',
          }}>
            [{position}]
          </div>
        )}
      </div>

      {/* ── ŚRODEK: dane + zdjęcie ── */}
      <div style={{ padding: '14px 16px 10px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>

        {/* Lewa kolumna — dane */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {alias && (
            <>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', color: '#666', marginBottom: '1px' }}>ALIAS</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.04em', marginBottom: '10px', color: '#111' }}>
                {alias}
              </div>
            </>
          )}

          <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', color: '#666', marginBottom: '1px' }}>DID</div>
          <div style={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: '0.15em', lineHeight: 1, marginBottom: '10px', color: '#111' }}>
            {did}
          </div>

          {position && (
            <div style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '8px', color: '#222' }}>
              {position.toUpperCase()}
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#777' }}>SLV: </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111' }}>{slv}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#777' }}>Sc.A.: </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111' }}>{sca}</span>
            </div>
          </div>

          <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.04em', color: '#111', marginBottom: '3px' }}>
            {joinDate ?? '—'}
          </div>
          <div style={{ fontSize: '0.5rem', color: '#777', letterSpacing: '0.04em' }}>
            All times reserved under Central 46, Resolution XVI
          </div>
        </div>

        {/* Prawa kolumna — zdjęcie z rank badge */}
        <div style={{ flexShrink: 0, position: 'relative' }}>
          {/* Zdjęcie */}
          <div style={{
            width: '110px', height: '130px',
            border: '2px solid #333',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#ccc',
          }}>
            {photo
              ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#888" strokeWidth="1.5"/>
                  <path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            }
          </div>

          {/* Rank badge — lewy górny róg zdjęcia */}
          <div style={{
            position: 'absolute', top: '-8px', left: '-10px',
            width: '34px', height: '34px',
            border: '2.5px solid #111',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: rank.length > 2 ? '0.65rem' : '0.9rem',
            color: '#111',
            background: '#f0eff0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}>
            {rank}
          </div>
        </div>
      </div>

    </div>
  )
}
