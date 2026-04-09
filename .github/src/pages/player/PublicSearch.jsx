import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCharacter } from '../../hooks/useCharacter'
import PageShell, { Card } from '../../components/ui/PageShell'
import IdentifierCard from '../../components/ui/IdentifierCard'

function romanToInt(r) {
  const m = { I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8,IX:9,X:10 }
  return m[r] ?? 1
}

export default function PublicSearch() {
  const { character: myChar } = useCharacter()
  const [allChars, setAllChars]   = useState([])
  const [selected, setSelected]   = useState(null)
  const [loading, setLoading]     = useState(true)

  const mySCA = romanToInt(myChar?.sca ?? 'I')

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db, 'characters'), orderBy('rank')))
        const all  = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // Pokaż tylko karty z SLV <= moje SCA, i nie swoją własną
        const visible = all.filter(c =>
          romanToInt(c.slv ?? 'I') <= mySCA &&
          c.id !== myChar?.id
        )
        setAllChars(visible)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    if (myChar) load()
  }, [myChar, mySCA])

  return (
    <PageShell title="PERSONNEL SEARCH" subtitle={`AUTHORIZED RECORDS — CLEARANCE ${myChar?.sca ?? 'I'}`}>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '260px 1fr' : '1fr', gap: '1.5rem', transition: 'all 0.2s' }}>

        {/* Lista postaci */}
        <div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.75rem' }}>
            VISIBLE PERSONNEL ({loading ? '…' : allChars.length})
          </div>

          {loading && (
            <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '1rem 0' }}>LOADING...</div>
          )}

          {!loading && allChars.length === 0 && (
            <div style={{
              background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)',
              padding: '2rem', textAlign: 'center',
              color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em',
            }}>
              NO PERSONNEL RECORDS ACCESSIBLE<br />
              <span style={{ fontSize: '0.62rem', marginTop: '0.4rem', display: 'block' }}>
                Your current clearance level: {myChar?.sca ?? 'I'}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {allChars.map(c => {
              const isActive = selected?.id === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(isActive ? null : c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    background: isActive ? 'rgba(220,50,50,0.08)' : 'var(--color-bo-surface)',
                    border: `1px solid ${isActive ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Miniaturka zdjęcia */}
                  <div style={{
                    width: '34px', height: '40px', flexShrink: 0,
                    background: '#1a1a24', border: '1px solid var(--color-bo-border)',
                    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {c.photoUrl
                      ? <img src={c.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" opacity="0.4">
                          <circle cx="12" cy="8" r="4" stroke="var(--color-bo-text)" strokeWidth="1.5"/>
                          <path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" stroke="var(--color-bo-text)" strokeWidth="1.5"/>
                        </svg>
                    }
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Alias lub DID */}
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isActive ? 'var(--color-bo-text)' : 'var(--color-bo-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.alias ?? `DID: ${c.did ?? '??????'}`}
                    </div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--color-bo-muted)', marginTop: '1px' }}>
                      {[c.race, c.rank ? `Rank ${c.rank}` : null, c.position].filter(Boolean).join(' · ')}
                    </div>
                  </div>

                  {/* SLV badge */}
                  <div style={{ fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', border: '1px solid var(--color-bo-border)', padding: '1px 4px' }}>
                    {c.slv}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Karta wybranej postaci */}
        {selected && (
          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.75rem' }}>
              IDENTIFICATION DOCUMENT
            </div>
            <IdentifierCard char={selected} />
            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: '0.75rem', background: 'none',
                border: '1px solid var(--color-bo-border)',
                color: 'var(--color-bo-text-dim)', padding: '0.4rem 1rem',
                fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >CLOSE</button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
