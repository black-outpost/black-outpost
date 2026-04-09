import { useState, useEffect, useMemo } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'
import { useNavigate } from 'react-router-dom'
import { CHARACTER_STATUSES, getStatus } from '../../data/characterStatuses'

const ROMAN = { I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8, IX:9, X:10 }
const toInt  = r => ROMAN[r] ?? 1

const btnStyle = (active) => ({
  background: active ? 'rgba(220,50,50,0.12)' : 'none',
  border: `1px solid ${active ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`,
  color: active ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)',
  padding: '0.25rem 0.65rem', fontSize: '0.58rem', letterSpacing: '0.12em',
  cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
})

const inp = {
  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)', padding: '0.35rem 0.6rem',
  fontSize: '0.72rem', fontFamily: 'var(--font-body)', outline: 'none',
  width: '180px',
}

const SORT_OPTIONS = [
  { key: 'createdAt', label: 'DATA DODANIA' },
  { key: 'rank',      label: 'RANGA' },
  { key: 'race',      label: 'RASA' },
  { key: 'position',  label: 'POZYCJA' },
  { key: 'name',      label: 'NAZWISKO' },
]

// Grid: photo | alias | name | identifier | race | rank | position | slv | sca | tags | actions
const COLS = '44px 120px 140px 100px 85px 46px 95px 42px 42px 1fr 100px'

export default function CharacterList() {
  const [chars,          setChars]          = useState([])
  const [activeStatus,   setActiveStatus]   = useState('')
  const [loading,        setLoading]        = useState(true)
  const [sortKey,     setSortKey]     = useState('createdAt')
  const [sortDir,     setSortDir]     = useState('desc')
  const [searchAlias, setSearchAlias] = useState('')
  const [searchName,  setSearchName]  = useState('')
  const navigate = useNavigate()

  async function load() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'characters'), orderBy('createdAt', 'desc')))
      setChars(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function handleAliasSearch(val) {
    setSearchAlias(val)
    if (val) setSearchName('')
  }
  function handleNameSearch(val) {
    setSearchName(val)
    if (val) setSearchAlias('')
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    let list = [...chars]

    const qa = searchAlias.trim().toLowerCase()
    const qn = searchName.trim().toLowerCase()
    if (qa) list = list.filter(c => (c.alias ?? '').toLowerCase().includes(qa))
    if (qn) {
      list = list.filter(c => {
        const full = `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase()
        return full.includes(qn) || (c.identifier ?? '').toLowerCase().includes(qn)
      })
    }
    if (activeStatus) list = list.filter(c => c.status === activeStatus)

    list.sort((a, b) => {
      let va, vb
      switch (sortKey) {
        case 'rank':     va = toInt(a.rank ?? 'I');       vb = toInt(b.rank ?? 'I');       break
        case 'race':     va = a.race ?? '';                vb = b.race ?? '';                break
        case 'position': va = a.position ?? '';            vb = b.position ?? '';            break
        case 'name':     va = (a.lastName ?? '').toLowerCase(); vb = (b.lastName ?? '').toLowerCase(); break
        default:         va = a.createdAt?.seconds ?? 0;  vb = b.createdAt?.seconds ?? 0;  break
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ?  1 : -1
      return 0
    })

    return list
  }, [chars, searchAlias, searchName, sortKey, sortDir])

  const arrow = key => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  return (
    <PageShell title="CHARACTER LIST" subtitle="ALL REGISTERED PERSONNEL">

      {/* ── Top bar ── */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap' }}>

        {/* Wyszukiwarki */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              value={searchAlias}
              onChange={e => handleAliasSearch(e.target.value)}
              placeholder="Pseudonim…"
              style={inp}
            />
            {searchAlias && (
              <button onClick={() => setSearchAlias('')} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.7rem', padding: 0, lineHeight: 1 }}>✕</button>
            )}
          </div>
          <span style={{ fontSize: '0.55rem', color: 'var(--color-bo-muted)', flexShrink: 0 }}>lub</span>
          <div style={{ position: 'relative' }}>
            <input
              value={searchName}
              onChange={e => handleNameSearch(e.target.value)}
              placeholder="Imię / nazwisko / login…"
              style={{ ...inp, width: 200 }}
            />
            {searchName && (
              <button onClick={() => setSearchName('')} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.7rem', padding: 0, lineHeight: 1 }}>✕</button>
            )}
          </div>
        </div>

        {/* Sortowanie */}
        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginRight: '3px' }}>SORT:</span>
          {SORT_OPTIONS.map(o => (
            <button key={o.key} onClick={() => toggleSort(o.key)} style={btnStyle(sortKey === o.key)}>
              {o.label}{arrow(o.key)}
            </button>
          ))}
        </div>

        <button onClick={() => navigate('/admin/create')} style={{
          marginLeft: 'auto',
          background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)',
          color: 'var(--color-bo-red)', padding: '0.45rem 1.1rem',
          fontSize: '0.65rem', letterSpacing: '0.15em', cursor: 'pointer',
          fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
        }}>+ NEW CHARACTER</button>
      </div>

      {/* Filtr statusu */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.52rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)' }}>STATUS:</span>
        <select
          value={activeStatus}
          onChange={e => setActiveStatus(e.target.value)}
          style={{ background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '0.25rem 0.5rem', fontSize: '0.62rem', fontFamily: 'var(--font-body)', cursor: 'pointer' }}
        >
          <option value="">Wszyscy</option>
          {CHARACTER_STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {activeStatus && (
          <button onClick={() => setActiveStatus('')} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.7rem', padding: '0 4px' }}>✕</button>
        )}
      </div>

      {/* Licznik */}
      <div style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>
        {loading ? 'LOADING…' : `${filtered.length} / ${chars.length} PERSONNEL`}
      </div>

      {/* ── Tabela ── */}
      {loading ? (
        <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>
      ) : chars.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
            NO CHARACTERS REGISTERED
          </div>
        </Card>
      ) : (
        <div style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', overflowX: 'auto' }}>

          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: COLS, gap: '0 0.5rem',
            padding: '0.45rem 0.85rem', borderBottom: '2px solid var(--color-bo-border)',
            fontSize: '0.52rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)',
            minWidth: 880, alignItems: 'center',
          }}>
            <span></span>
            <span>ALIAS</span>
            <span>IMIĘ I NAZWISKO</span>
            <span>LOGIN</span>
            <span style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('race')}>RASA{arrow('race')}</span>
            <span style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }} onClick={() => toggleSort('rank')}>RNG{arrow('rank')}</span>
            <span style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('position')}>POZYCJA{arrow('position')}</span>
            <span style={{ textAlign: 'center' }}>SLV</span>
            <span style={{ textAlign: 'center' }}>SCA</span>
            <span>STATUS</span>
            <span></span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
              BRAK WYNIKÓW
            </div>
          ) : filtered.map((c, i) => (
            <div
              key={c.id}
              style={{
                display: 'grid', gridTemplateColumns: COLS, gap: '0 0.5rem',
                padding: '0.48rem 0.85rem', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--color-bo-border)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                minWidth: 880,
              }}
            >
              {/* Zdjęcie */}
              <div style={{ width: 34, height: 40, background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.photoUrl
                  ? <img src={c.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" opacity="0.3"><circle cx="12" cy="8" r="4" stroke="var(--color-bo-text)" strokeWidth="1.5"/><path d="M4 20C4 16 8 13 12 13C16 13 20 16 20 20" stroke="var(--color-bo-text)" strokeWidth="1.5"/></svg>
                }
              </div>

              {/* Alias */}
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-bo-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.alias
                  ? c.alias
                  : <span style={{ color: 'var(--color-bo-muted)', fontWeight: 400, fontStyle: 'italic' }}>brak</span>
                }
                {c.isNPC && <span style={{ marginLeft: '4px', fontSize: '0.48rem', color: 'var(--color-bo-muted)', border: '1px solid var(--color-bo-border)', padding: '1px 3px', verticalAlign: 'middle' }}>NPC</span>}
              </span>

              {/* Imię i nazwisko */}
              <span style={{ fontSize: '0.72rem', color: 'var(--color-bo-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.firstName} {c.lastName}
              </span>

              {/* Login / identifier */}
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'var(--color-bo-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.identifier}
              </span>

              {/* Rasa */}
              <span style={{ fontSize: '0.65rem', color: 'var(--color-bo-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.race ?? '—'}
              </span>

              {/* Ranga */}
              <span style={{ fontSize: '0.72rem', color: 'var(--color-bo-text-dim)', textAlign: 'center' }}>
                {c.rank ?? 'I'}
              </span>

              {/* Pozycja */}
              <span style={{ fontSize: '0.65rem', color: 'var(--color-bo-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.position ?? '—'}
              </span>

              {/* SLV */}
              <span style={{ fontSize: '0.65rem', color: 'var(--color-bo-text-dim)', textAlign: 'center' }}>{c.slv ?? 'I'}</span>

              {/* SCA */}
              <span style={{ fontSize: '0.65rem', color: 'var(--color-bo-text-dim)', textAlign: 'center' }}>{c.sca ?? 'I'}</span>

              {/* Status */}
              <div>
                {(() => {
                  const s = getStatus(c.status)
                  if (!s) return <span style={{ fontSize: '0.5rem', color: 'var(--color-bo-muted)' }}>—</span>
                  return <span style={{ fontSize: '0.52rem', letterSpacing: '0.07em', padding: '2px 6px', border: `1px solid ${s.color}55`, color: s.color, background: s.color + '18', borderRadius: '2px', whiteSpace: 'nowrap' }}>{s.label}</span>
                })()}
              </div>

              {/* Akcje */}
              <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                <button onClick={() => navigate(`/admin/view/${c.id}`)} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.2rem 0.45rem', fontSize: '0.55rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>VIEW</button>
                <button onClick={() => navigate(`/admin/edit/${c.id}`)} style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.2rem 0.45rem', fontSize: '0.55rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>EDIT</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
