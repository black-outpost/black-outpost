import { useState, useEffect, useCallback } from 'react'
import {
  collection, query, orderBy, limit, startAfter,
  getDocs,
} from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'

const PAGE_SIZE = 50

const CATEGORY_LABELS = {
  character: 'Postać',
  item:      'Item (gracz)',
  item_bank: 'Item Bank',
  rewards:   'Nagrody',
  technique: 'Technika',
  nazo:      'Nazo',
  other:     'Inne',
}

const ACTION_LABELS = {
  create_character:    '+ Nowa postać',
  edit_character:      '✎ Edycja postaci',
  add_passive_effect:  '+ Efekt pasywny',
  remove_passive_effect: '− Efekt pasywny',
  add_stat_multiplier: '+ Mnożnik',
  remove_stat_multiplier: '− Mnożnik',
  grant_rewards:       '✦ Nagrody',
  grant_item:          '+ Item graczowi',
  grant_item_unique:   '+ Item unikalny',
  edit_character_item: '✎ Edycja itemu',
  delete_character_item: '✕ Usunięcie itemu',
  create_item_bank:    '+ Bank: nowy item',
  edit_item_bank:      '✎ Bank: edycja',
  delete_item_bank:    '✕ Bank: usunięcie',
  edit_technique:      '✎ Technika',
  delete_technique:    '✕ Technika',
  add_nazo_node:       '+ Node nazo',
  edit_nazo_node:      '✎ Node nazo',
  edit_nazo_settings:  '✎ Nazo ustawienia',
}

const CATEGORY_COLORS = {
  character: '#5090d0',
  item:      '#60c080',
  item_bank: '#a0c040',
  rewards:   '#d4a840',
  technique: '#c060c0',
  nazo:      '#8840cc',
  other:     '#606080',
}

function formatTs(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatValue(v) {
  if (v === null || v === undefined) return <span style={{ color: 'var(--color-bo-muted)', fontStyle: 'italic' }}>null</span>
  if (typeof v === 'boolean') return <span style={{ color: v ? '#60c080' : '#dc3232' }}>{String(v)}</span>
  if (typeof v === 'object') return <span style={{ color: 'var(--color-bo-text-dim)', fontSize: '0.6rem' }}>{JSON.stringify(v).slice(0, 120)}</span>
  const str = String(v)
  if (str.length > 120) return <span title={str}>{str.slice(0, 120)}…</span>
  return str
}

function LogRow({ log, expanded, onToggle }) {
  const catColor = CATEGORY_COLORS[log.category] ?? '#606080'
  const actionLabel = ACTION_LABELS[log.action] ?? log.action

  return (
    <div style={{ borderBottom: '1px solid var(--color-bo-border)', background: expanded ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
      {/* Summary row */}
      <div
        onClick={onToggle}
        style={{ display: 'grid', gridTemplateColumns: '140px 110px 130px 1fr 120px', gap: '0 0.75rem', padding: '0.5rem 1rem', alignItems: 'center', cursor: log.changes?.length > 0 || log.note ? 'pointer' : 'default', minWidth: 700 }}
      >
        {/* Timestamp */}
        <span style={{ fontSize: '0.62rem', color: 'var(--color-bo-text-dim)', whiteSpace: 'nowrap' }}>
          {formatTs(log.timestamp)}
        </span>

        {/* Admin */}
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'var(--color-bo-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {log.adminIdentifier ?? '?'}
        </span>

        {/* Action */}
        <span style={{ fontSize: '0.62rem', color: catColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {actionLabel}
        </span>

        {/* Target */}
        <span style={{ fontSize: '0.68rem', color: 'var(--color-bo-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {log.targetName || log.targetId || '—'}
        </span>

        {/* Category badge + expand */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.5rem', letterSpacing: '0.1em', color: catColor, border: `1px solid ${catColor}`, padding: '1px 5px', opacity: 0.7, whiteSpace: 'nowrap' }}>
            {CATEGORY_LABELS[log.category] ?? log.category}
          </span>
          {(log.changes?.length > 0 || log.note) && (
            <span style={{ fontSize: '0.55rem', color: 'var(--color-bo-muted)' }}>{expanded ? '▲' : '▼'}</span>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: '0 1rem 0.75rem', marginLeft: '140px' }}>
          {log.note && (
            <div style={{ fontSize: '0.62rem', color: 'var(--color-bo-muted)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
              {log.note}
            </div>
          )}
          {log.changes?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', fontSize: '0.5rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginBottom: '3px' }}>
                <span>POLE</span><span>PRZED</span><span>PO</span>
              </div>
              {log.changes.map((ch, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: '0 0.5rem', fontSize: '0.62rem', alignItems: 'start' }}>
                  <span style={{ color: 'var(--color-bo-muted)', fontFamily: 'monospace' }}>{ch.field}</span>
                  <span style={{ color: '#dc6060' }}>{formatValue(ch.before)}</span>
                  <span style={{ color: '#60c080' }}>{formatValue(ch.after)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function LogsView() {
  const [logs,       setLogs]       = useState([])
  const [loading,    setLoading]    = useState(true)
  const [loadingMore,setLoadingMore]= useState(false)
  const [lastDoc,    setLastDoc]    = useState(null)
  const [hasMore,    setHasMore]    = useState(true)
  const [expanded,   setExpanded]   = useState(null)

  // Filtry
  const [filterAdmin,    setFilterAdmin]    = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  function buildQuery(afterDoc = null) {
    const constraints = [orderBy('timestamp', 'desc'), limit(PAGE_SIZE)]
    if (afterDoc) constraints.push(startAfter(afterDoc))
    return query(collection(db, 'adminLogs'), ...constraints)
  }

  async function loadFirst() {
    setLoading(true)
    setLogs([])
    setLastDoc(null)
    setHasMore(true)
    try {
      const snap = await getDocs(buildQuery())
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setLogs(docs)
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null)
      setHasMore(snap.docs.length === PAGE_SIZE)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function loadMore() {
    if (!lastDoc || !hasMore || loadingMore) return
    setLoadingMore(true)
    try {
      const snap = await getDocs(buildQuery(lastDoc))
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setLogs(prev => [...prev, ...docs])
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null)
      setHasMore(snap.docs.length === PAGE_SIZE)
    } catch (e) { console.error(e) }
    finally { setLoadingMore(false) }
  }

  useEffect(() => { loadFirst() }, [])

  // Oba filtry lokalnie — brak potrzeby złożonych indeksów Firestore
  const displayed = logs.filter(l => {
    const matchAdmin    = !filterAdmin.trim() || (l.adminIdentifier ?? '').toLowerCase().includes(filterAdmin.trim().toLowerCase())
    const matchCategory = filterCategory === 'all' || l.category === filterCategory
    return matchAdmin && matchCategory
  })

  const inp = { background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '0.32rem 0.55rem', fontSize: '0.72rem', fontFamily: 'var(--font-body)', outline: 'none' }
  const btnStyle = (active) => ({ background: active ? 'rgba(220,50,50,0.12)' : 'none', border: `1px solid ${active ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`, color: active ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.25rem 0.6rem', fontSize: '0.58rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' })

  return (
    <PageShell title="ADMIN LOGS" subtitle="HISTORIA AKCJI ADMINISTRACYJNYCH">

      {/* Filtry */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
        <input
          value={filterAdmin}
          onChange={e => setFilterAdmin(e.target.value)}
          placeholder="Filtruj po adminie…"
          style={{ ...inp, width: 180 }}
        />
        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
          {[['all', 'WSZYSTKIE'], ...Object.entries(CATEGORY_LABELS)].map(([k, lbl]) => (
            <button key={k} onClick={() => setFilterCategory(k)} style={btnStyle(filterCategory === k)}>
              {lbl.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={loadFirst} style={{ ...btnStyle(false), marginLeft: 'auto' }}>↺ ODŚWIEŻ</button>
      </div>

      {/* Licznik */}
      <div style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>
        {loading ? 'LOADING…' : `${displayed.length} z ${logs.length} załadowanych wpisów`}
      </div>

      {/* Header tabeli */}
      <div style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 110px 130px 1fr 120px', gap: '0 0.75rem', padding: '0.4rem 1rem', borderBottom: '2px solid var(--color-bo-border)', fontSize: '0.5rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', minWidth: 700 }}>
          <span>CZAS</span>
          <span>ADMIN</span>
          <span>AKCJA</span>
          <span>CEL</span>
          <span style={{ textAlign: 'right' }}>KATEGORIA</span>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>LOADING...</div>
        ) : displayed.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.12em' }}>BRAK LOGÓW</div>
        ) : (
          displayed.map(log => (
            <LogRow
              key={log.id}
              log={log}
              expanded={expanded === log.id}
              onToggle={() => setExpanded(e => e === log.id ? null : log.id)}
            />
          ))
        )}

        {/* Załaduj więcej */}
        {!loading && hasMore && (
          <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--color-bo-border)' }}>
            <button onClick={loadMore} disabled={loadingMore} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.4rem 1.5rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: loadingMore ? 'wait' : 'pointer', fontFamily: 'var(--font-body)' }}>
              {loadingMore ? 'LOADING…' : `ZAŁADUJ WIĘCEJ (${PAGE_SIZE} na raz)`}
            </button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
