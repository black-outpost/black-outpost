import { useState, useEffect, useMemo } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCharacter } from '../../hooks/useCharacter'
import PageShell, { Card } from '../../components/ui/PageShell'
import TechMarkupRenderer from '../../components/ui/TechMarkupRenderer'

const STAT_LABELS = {
  strength: 'Strength', vitality: 'Vitality', speed: 'Speed',
  defense: 'Defense', reiatsu: 'Reiatsu', reiryoku: 'Reiryoku',
  bujutsu: 'Bujutsu', bukijutsu: 'Bukijutsu', tamashi: 'Tamashi', nazo: '???',
}

/* Pierwsze 1-2 zdania do podglądu */
function getPreview(text) {
  if (!text) return ''
  // strip markup for preview
  const plain = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\{[^|{}]+\|([^}]+)\}/g, '$1')
  const sentences = plain.match(/[^.!?]+[.!?]+/g) ?? [plain]
  return sentences.slice(0, 2).join(' ').trim()
}

/* Karta techniki — zwinięta/rozwinięta */
function TechCard({ tech, characterStats }) {
  const [expanded, setExpanded] = useState(false)
  const [imgOk,    setImgOk]    = useState(false)
  const preview = getPreview(tech.description)

  return (
    <div style={{
      border: '1px solid ' + (expanded ? 'var(--color-bo-muted)' : 'var(--color-bo-border)'),
      background: 'var(--color-bo-surface)',
      marginBottom: '3px', transition: 'border-color 0.15s',
    }}>
      {/* ── Header ─────────────────────────────────── */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ width: '100%', background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'stretch', cursor: 'pointer', textAlign: 'left' }}
      >
        {/* Miniaturka */}
        {tech.imageUrl && (
          <div style={{ width: '72px', flexShrink: 0, overflow: 'hidden', background: 'var(--color-bo-elevated)' }}>
            <img src={tech.imageUrl} alt="" onLoad={() => setImgOk(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: imgOk ? 'block' : 'none', minHeight: '72px' }} />
            {!imgOk && <div style={{ width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--color-bo-border)' }}>◈</div>}
          </div>
        )}

        <div style={{ flex: 1, padding: '0.65rem 0.85rem', minWidth: 0 }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {tech.classification && (
              <span style={{ fontSize: '0.52rem', letterSpacing: '0.12em', color: 'var(--color-bo-red)', background: 'rgba(220,50,50,0.08)', border: '1px solid var(--color-bo-red-dim)', padding: '1px 5px', whiteSpace: 'nowrap' }}>
                CLASS {tech.classification}
              </span>
            )}
            {tech.stat && (
              <span style={{ fontSize: '0.52rem', letterSpacing: '0.1em', color: '#5090d0', background: 'rgba(80,144,208,0.08)', border: '1px solid rgba(80,144,208,0.25)', padding: '1px 5px', whiteSpace: 'nowrap' }}>
                {(STAT_LABELS[tech.stat] ?? tech.stat).toUpperCase()}
              </span>
            )}
            {tech.origin && (
              <span style={{ fontSize: '0.52rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', padding: '1px 5px', whiteSpace: 'nowrap' }}>
                {tech.origin}
              </span>
            )}
          </div>

          {/* Nazwa */}
          <div style={{ fontSize: '0.88rem', color: 'var(--color-bo-text)', fontWeight: 600, lineHeight: 1.3, marginBottom: preview ? '0.3rem' : 0 }}>
            {tech.name}
          </div>

          {/* Preview — ukryty po rozwinięciu */}
          {!expanded && preview && (
            <div style={{ fontSize: '0.7rem', color: 'var(--color-bo-text-dim)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {preview}
            </div>
          )}
        </div>

        <div style={{ padding: '0.65rem 0.75rem', display: 'flex', alignItems: 'center', color: 'var(--color-bo-muted)', fontSize: '0.65rem', flexShrink: 0 }}>
          {expanded ? '▲' : '▼'}
        </div>
      </button>

      {/* ── Rozwinięta treść ────────────────────────── */}
      {expanded && (
        <div style={{ padding: '0.75rem 0.85rem 0.9rem', borderTop: '1px solid var(--color-bo-border)' }}>
          {tech.imageUrl && (
            <div style={{ height: '200px', overflow: 'hidden', marginBottom: '0.85rem', border: '1px solid var(--color-bo-border)' }}>
              <img src={tech.imageUrl} alt={tech.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {/* Opis z markupem */}
          {tech.description && (
            <TechMarkupRenderer text={tech.description} stats={characterStats} />
          )}

          {/* Technical details */}
          {tech.technicalDetails && (
            <div style={{ marginTop: '0.85rem', background: 'rgba(220,50,50,0.04)', border: '1px solid var(--color-bo-border)', borderLeft: '3px solid var(--color-bo-red-dim)', padding: '0.65rem 0.85rem' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.18em', color: 'var(--color-bo-red)', marginBottom: '0.5rem' }}>TECHNICAL DETAILS</div>
              <TechMarkupRenderer text={tech.technicalDetails} stats={characterStats} isTechDetails />
            </div>
          )}

          {/* Stopka */}
          {(tech.origin || tech.stat) && (
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)' }}>
              {tech.origin && <span>ORIGIN: <span style={{ color: 'var(--color-bo-text-dim)' }}>{tech.origin}</span></span>}
              {tech.stat   && <span>STAT: <span style={{ color: '#5090d0' }}>{STAT_LABELS[tech.stat] ?? tech.stat}</span></span>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* Toolbar */
function Toolbar({ search, setSearch, filterStat, setFilterStat, sort, setSort, stats }) {
  const btnStyle = active => ({
    background: active ? 'rgba(220,50,50,0.1)' : 'none',
    border: '1px solid ' + (active ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'),
    color: active ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)',
    padding: '0.28rem 0.6rem', fontSize: '0.58rem', letterSpacing: '0.1em',
    cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
  })
  const inpStyle = {
    background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
    color: 'var(--color-bo-text)', padding: '0.32rem 0.6rem',
    fontSize: '0.78rem', fontFamily: 'var(--font-body)',
  }
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search techniques..." style={{ ...inpStyle, width: '180px' }} />
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
        {stats.map(s => (
          <button key={s} onClick={() => setFilterStat(s)} style={btnStyle(filterStat === s)}>
            {s === 'all' ? 'ALL' : (STAT_LABELS[s] ?? s).toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
        <button onClick={() => setSort('name')}  style={btnStyle(sort === 'name')}>A–Z</button>
        <button onClick={() => setSort('class')} style={btnStyle(sort === 'class')}>CLASS</button>
      </div>
    </div>
  )
}

export default function TechniquesView() {
  const { character }    = useCharacter()
  const [techniques, setTechniques] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [filterStat, setFilterStat] = useState('all')
  const [sort,       setSort]       = useState('name')

  useEffect(() => {
    if (!character?.id) return
    const unsub = onSnapshot(collection(db, 'characters', character.id, 'techniques'),
      snap => { setTechniques(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false) },
      () => setLoading(false)
    )
    return unsub
  }, [character?.id])

  // Dostępne staty do filtrowania (dynamicznie z danych)
  const statOptions = useMemo(() =>
    ['all', ...new Set(techniques.map(t => t.stat).filter(Boolean).sort())],
    [techniques]
  )

  const filtered = useMemo(() => {
    let list = techniques
    if (filterStat !== 'all') list = list.filter(t => t.stat === filterStat)
    if (search) list = list.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.origin ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (t.stat ?? '').toLowerCase().includes(search.toLowerCase())
    )
    if (sort === 'name')  list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'class') list = [...list].sort((a, b) => (a.classification ?? 'Z').localeCompare(b.classification ?? 'Z'))
    return list
  }, [techniques, search, filterStat, sort])

  const stats = character?.stats ?? {}

  if (loading) return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>

  return (
    <PageShell title="TECHNIQUES" subtitle="REGISTERED COMBAT TECHNIQUES & ABILITIES">
      {techniques.length === 0 ? (
        <Card>
          <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em', textAlign: 'center', padding: '3rem 0' }}>NO TECHNIQUES REGISTERED</div>
        </Card>
      ) : (
        <>
          <Toolbar
            search={search} setSearch={setSearch}
            filterStat={filterStat} setFilterStat={setFilterStat}
            sort={sort} setSort={setSort}
            stats={statOptions}
          />

          {filtered.length === 0 ? (
            <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em', padding: '2rem', textAlign: 'center', border: '1px dashed var(--color-bo-border)' }}>NO TECHNIQUES MATCH FILTER</div>
          ) : (
            filtered.map(t => <TechCard key={t.id} tech={t} characterStats={stats} />)
          )}
        </>
      )}
    </PageShell>
  )
}
