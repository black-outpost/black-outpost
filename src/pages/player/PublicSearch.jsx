import { useState, useEffect, useContext } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCharacter } from '../../hooks/useCharacter'
import { CHARACTER_STATUSES, getStatus } from '../../data/characterStatuses'
import PageShell from '../../components/ui/PageShell'
import IdentifierCard from '../../components/ui/IdentifierCard'
import { OSTContext } from './PlayerLayout'

function romanToInt(r) {
  const m = { I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8,IX:9,X:10 }
  return m[r] ?? 1
}

function InfoSection({ label, text }) {
  if (!text) return null
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <div style={{ fontSize: '0.52rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.3rem' }}>{label}</div>
      <p style={{ color: 'var(--color-bo-text)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
    </div>
  )
}



export default function PublicSearch() {
  const { character: myChar } = useCharacter()
  const [allChars,    setAllChars]    = useState([])
  const [selected,    setSelected]    = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [activeStatus,setActiveStatus] = useState('')
  const ostCtx = useContext(OSTContext)

  const mySCA = romanToInt(myChar?.sca ?? 'I')

  useEffect(() => {
    if (!ostCtx) return
    if (selected?.ostUrl) ostCtx.setOverrideUrl(selected.ostUrl)
    else ostCtx.setOverrideUrl(null)
    return () => { if (ostCtx) ostCtx.setOverrideUrl(null) }
  }, [selected?.id])

  // Ładuj postaci jednorazowo
  useEffect(() => {
    if (!myChar) return
    const sca = romanToInt(myChar.sca ?? 'I')
    getDocs(query(collection(db, 'characters'), orderBy('rank')))
      .then(snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setAllChars(all.filter(c => romanToInt(c.slv ?? 'I') <= sca && c.id !== myChar.id))
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [myChar?.id, myChar?.sca])



  const q = search.trim().toLowerCase()



  const filteredChars = allChars
    .filter(c => !activeStatus || c.status === activeStatus)
    .filter(c => {
      if (!q) return true
      const name  = `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase()
      const alias = (c.alias ?? '').toLowerCase()
      return name.includes(q) || alias.includes(q) || (c.race ?? '').toLowerCase().includes(q)
        || (c.position ?? '').toLowerCase().includes(q) || (c.identifier ?? '').toLowerCase().includes(q)
    })

  return (
    <PageShell title="PERSONNEL SEARCH" subtitle={`AUTHORIZED RECORDS — CLEARANCE ${myChar?.sca ?? 'I'}`}>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '300px 1fr' : '1fr', gap: '1.5rem' }}>

        {/* Lista */}
        <div>
          {/* Wyszukiwarka */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="szukaj po imieniu, rasie, pozycji…"
            style={{ width: '100%', boxSizing: 'border-box', marginBottom: '0.5rem', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '0.4rem 0.7rem', fontSize: '0.72rem', fontFamily: 'var(--font-body)', outline: 'none' }}
          />

          {/* Filtr statusu */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            <select
              value={activeStatus}
              onChange={e => setActiveStatus(e.target.value)}
              style={{ background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '0.3rem 0.6rem', fontSize: '0.62rem', fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none' }}
            >
              <option value="">Wszyscy ({allChars.length})</option>
              {CHARACTER_STATUSES.map(s => {
                const cnt = allChars.filter(ch => ch.status === s.value).length
                return <option key={s.value} value={s.value}>{s.label} ({cnt})</option>
              })}
            </select>
          </div>

          <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>
            VISIBLE PERSONNEL ({loading ? '…' : filteredChars.length})
          </div>

          {loading && <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', padding: '1rem 0' }}>LOADING...</div>}

          {!loading && filteredChars.length === 0 && (
            <div style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', padding: '2rem', textAlign: 'center', color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
              {activeStatus ? `BRAK POSTACI ZE STATUSEM "${activeStatus}"` : 'NO PERSONNEL RECORDS ACCESSIBLE'}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {filteredChars.map(c => {
              const isActive = selected?.id === c.id

              return (
                <button key={c.id} onClick={() => setSelected(isActive ? null : c)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0.85rem',
                  background: isActive ? 'rgba(220,50,50,0.08)' : 'var(--color-bo-surface)',
                  border: `1px solid ${isActive ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`,
                  cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
                }}>
                  {/* Foto */}
                  <div style={{ width: 34, height: 40, flexShrink: 0, background: '#1a1a24', border: '1px solid var(--color-bo-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.photoUrl
                      ? <img src={c.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" opacity="0.4"><circle cx="12" cy="8" r="4" stroke="var(--color-bo-text)" strokeWidth="1.5"/><path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" stroke="var(--color-bo-text)" strokeWidth="1.5"/></svg>
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isActive ? 'var(--color-bo-text)' : 'var(--color-bo-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.alias ?? `DID: ${c.did ?? '??????'}`}
                    </div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--color-bo-muted)', marginTop: '1px' }}>
                      {[c.race, c.rank ? `Rank ${c.rank}` : null, c.position].filter(Boolean).join(' · ')}
                    </div>
                    {/* Status badge */}
                    {(() => {
                      const s = getStatus(c.status)
                      if (!s) return null
                      return (
                        <div style={{ marginTop: '4px' }}>
                          <span style={{ fontSize: '0.5rem', letterSpacing: '0.08em', padding: '1px 6px', border: `1px solid ${s.color}55`, color: s.color, background: s.color + '18', borderRadius: '2px' }}>
                            {s.label}
                          </span>
                        </div>
                      )
                    })()}
                  </div>

                  {/* SLV badge */}
                  <div style={{ fontSize: '0.52rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', border: '1px solid var(--color-bo-border)', padding: '1px 4px', flexShrink: 0 }}>
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
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>IDENTIFICATION DOCUMENT</div>
            <IdentifierCard char={selected} />

            {(selected.height || selected.weight) && (
              <div style={{ marginTop: '0.5rem', background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', padding: '0.6rem 0.9rem', display: 'flex', gap: '1.5rem' }}>
                {selected.height && <div><div style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '2px' }}>HEIGHT</div><div style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', fontWeight: 600 }}>{selected.height} cm</div></div>}
                {selected.weight && <div><div style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '2px' }}>WEIGHT</div><div style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', fontWeight: 600 }}>{selected.weight} kg</div></div>}
              </div>
            )}

            {selected.appearance && <div style={{ marginTop: '1rem', background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', padding: '0.75rem 0.9rem' }}><InfoSection label="APPEARANCE" text={selected.appearance} /></div>}
            {selected.personality && <div style={{ marginTop: '0.5rem', background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', padding: '0.75rem 0.9rem' }}><InfoSection label="PERSONALITY" text={selected.personality} /></div>}
            {selected.publicInfo && <div style={{ marginTop: '0.5rem', background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', borderLeft: '3px solid var(--color-bo-red-dim)', padding: '0.75rem 0.9rem' }}><InfoSection label="PUBLIC INFORMATION" text={selected.publicInfo} /></div>}

            <button onClick={() => setSelected(null)} style={{ marginTop: '0.75rem', background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.4rem 1rem', fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              CLOSE
            </button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
