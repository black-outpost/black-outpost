/**
 * AdminTasksManager — widok listy zadań admina
 * Firestore: adminTasks/{id}
 *
 * Typy zadań:
 *   node_purchase — automatycznie tworzone gdy gracz kupuje węzeł z tagiem "admin_action"
 *   manual        — dodawane ręcznie przez administratora
 *
 * Status: pending | done
 * readBy: tablica identifierów adminów, którzy zobaczyli zadanie
 */
import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, doc,
  serverTimestamp, orderBy, query,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import PageShell, { Card } from '../../components/ui/PageShell'

const inp = {
  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)', padding: '0.4rem 0.6rem',
  fontSize: '0.78rem', fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box',
  outline: 'none',
}
const F = ({ label, children }) => (
  <div style={{ marginBottom: '0.5rem' }}>
    <label style={{ display: 'block', fontSize: '0.5rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.2rem' }}>{label}</label>
    {children}
  </div>
)

// ── Komponent jednego zadania ─────────────────────────────────────────────
function TaskRow({ task, currentAdmin, onToggleRead, onMarkDone }) {
  const [expanded, setExpanded] = useState(false)
  const isRead   = task.readBy?.includes(currentAdmin)
  const isDone   = task.status === 'done'

  function handleExpand() {
    setExpanded(e => !e)
    if (!isRead) onToggleRead(task.id, true)
  }

  const rowBg = isDone
    ? 'var(--color-bo-elevated)'
    : isRead
    ? 'var(--color-bo-surface)'
    : 'rgba(220,50,50,0.07)'

  const borderColor = isDone
    ? 'var(--color-bo-border)'
    : isRead
    ? 'var(--color-bo-border)'
    : 'rgba(220,50,50,0.4)'

  return (
    <div style={{ border: `1px solid ${borderColor}`, background: rowBg, marginBottom: '4px', transition: 'all 0.15s' }}>
      <button
        onClick={handleExpand}
        style={{ width: '100%', background: 'none', border: 'none', padding: '0.55rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', textAlign: 'left' }}
      >
        {/* Status dot */}
        <div style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: isDone ? '#3a3a5a' : isRead ? 'var(--color-bo-muted)' : 'var(--color-bo-red)',
          boxShadow: isDone ? 'none' : isRead ? 'none' : '0 0 6px rgba(220,50,50,0.5)',
        }} />

        {/* Type badge */}
        <span style={{ fontSize: '0.48rem', letterSpacing: '0.12em', color: task.type === 'manual' ? '#6080c0' : 'var(--color-bo-red)', background: task.type === 'manual' ? 'rgba(96,128,192,0.1)' : 'rgba(220,50,50,0.08)', border: `1px solid ${task.type === 'manual' ? '#2a3060' : 'var(--color-bo-red-dim)'}`, padding: '1px 6px', flexShrink: 0 }}>
          {task.type === 'manual' ? 'MANUAL' : 'AUTO'}
        </span>

        {/* Title */}
        <span style={{
          flex: 1, fontSize: '0.72rem', color: isDone ? 'var(--color-bo-muted)' : isRead ? 'var(--color-bo-text-dim)' : 'var(--color-bo-text)',
          textDecoration: isDone ? 'line-through' : 'none',
          fontFamily: 'var(--font-body)', letterSpacing: '0.04em',
        }}>
          {task.title}
        </span>

        {/* Timestamp */}
        {task.createdAt && (
          <span style={{ fontSize: '0.52rem', color: 'var(--color-bo-muted)', flexShrink: 0 }}>
            {new Date(task.createdAt.seconds * 1000).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </span>
        )}

        <span style={{ color: 'var(--color-bo-muted)', fontSize: '0.6rem', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={{ padding: '0.6rem 0.85rem 0.85rem', borderTop: '1px solid var(--color-bo-border)' }}>
          {task.type === 'node_purchase' && (
            <div style={{ marginBottom: '0.5rem', fontSize: '0.6rem', color: 'var(--color-bo-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span>Gracz: <b style={{ color: 'var(--color-bo-text)' }}>{task.characterFirstName} {task.characterLastName}</b></span>
              <span>ID: <b style={{ color: 'var(--color-bo-text)' }}>{task.characterIdentifier}</b></span>
              <span>Node: <b style={{ color: 'var(--color-bo-text)' }}>{task.nodeName}</b></span>
              <span>Drzewko: <b style={{ color: 'var(--color-bo-text)' }}>{task.treeStat}</b></span>
            </div>
          )}
          <div style={{ fontSize: '0.72rem', color: 'var(--color-bo-text)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)' }}>
            {task.body || task.nodeDesc || '—'}
          </div>
          {task.doneAt && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.55rem', color: 'var(--color-bo-muted)' }}>
              Wykonano przez: {task.doneBy} · {new Date(task.doneAt.seconds * 1000).toLocaleString('pl-PL')}
            </div>
          )}
          {!isDone && (
            <button
              onClick={() => onMarkDone(task.id)}
              style={{ marginTop: '0.75rem', background: 'rgba(96,192,128,0.08)', border: '1px solid rgba(96,192,128,0.3)', color: '#60c080', padding: '0.4rem 1rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >
              ✓ OZNACZ JAKO WYKONANE
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Główny widok ──────────────────────────────────────────────────────────
export default function AdminTasksManager() {
  const { identifier } = useAuth()
  const [tasks,     setTasks]     = useState([])
  const [tab,       setTab]       = useState('pending')
  const [showForm,  setShowForm]  = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formBody,  setFormBody]  = useState('')
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    const q   = query(collection(db, 'adminTasks'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap =>
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    , err => console.error('adminTasks:', err))
    return unsub
  }, [])

  const pending  = tasks.filter(t => t.status !== 'done')
  const archive  = tasks.filter(t => t.status === 'done')
  const unreadCount = pending.filter(t => !t.readBy?.includes(identifier)).length

  async function handleToggleRead(taskId, markRead) {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    const newReadBy = markRead
      ? [...new Set([...(task.readBy ?? []), identifier])]
      : (task.readBy ?? []).filter(x => x !== identifier)
    await updateDoc(doc(db, 'adminTasks', taskId), { readBy: newReadBy })
  }

  async function handleMarkDone(taskId) {
    await updateDoc(doc(db, 'adminTasks', taskId), {
      status: 'done',
      doneAt: serverTimestamp(),
      doneBy: identifier,
    })
  }

  async function handleAddManual() {
    if (!formTitle.trim()) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'adminTasks'), {
        type:      'manual',
        status:    'pending',
        title:     formTitle.trim(),
        body:      formBody.trim(),
        createdBy: identifier,
        readBy:    [],
        doneAt:    null,
        doneBy:    null,
        createdAt: serverTimestamp(),
      })
      setFormTitle(''); setFormBody(''); setShowForm(false)
    } finally { setSaving(false) }
  }

  const displayed = tab === 'pending' ? pending : archive

  return (
    <PageShell title="ADMIN TASKS" subtitle="ZADANIA DO WYKONANIA I ARCHIWUM">
      {/* Header z liczbą nieodczytanych */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {['pending','archive'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? 'rgba(220,50,50,0.15)' : 'var(--color-bo-surface)',
            border: `1px solid ${tab === t ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`,
            color: tab === t ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)',
            padding: '0.38rem 0.85rem', fontSize: '0.6rem', letterSpacing: '0.14em',
            fontFamily: 'var(--font-body)', cursor: 'pointer',
          }}>
            {t === 'pending' ? `OCZEKUJĄCE${unreadCount > 0 ? ` (${unreadCount} nowych)` : ''}` : `ARCHIWUM (${archive.length})`}
          </button>
        ))}
        <button
          onClick={() => setShowForm(s => !s)}
          style={{ marginLeft: 'auto', background: 'rgba(96,128,192,0.1)', border: '1px solid #2a3060', color: '#6080c0', padding: '0.38rem 0.85rem', fontSize: '0.6rem', letterSpacing: '0.14em', fontFamily: 'var(--font-body)', cursor: 'pointer' }}
        >
          + DODAJ RĘCZNIE
        </button>
      </div>

      {/* Formularz ręcznego dodania */}
      {showForm && (
        <Card title="NOWE ZADANIE MANUALNE">
          <F label="TYTUŁ"><input value={formTitle} onChange={e => setFormTitle(e.target.value)} style={inp} placeholder="Krótka nazwa zadania" /></F>
          <F label="OPIS / TREŚĆ"><textarea value={formBody} onChange={e => setFormBody(e.target.value)} rows={4} style={{ ...inp, resize: 'vertical' }} placeholder="Szczegóły, notatki..." /></F>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
            <button onClick={() => { setShowForm(false); setFormTitle(''); setFormBody('') }} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.4rem 0.8rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>ANULUJ</button>
            <button onClick={handleAddManual} disabled={!formTitle.trim() || saving} style={{ flex: 1, background: 'rgba(96,128,192,0.1)', border: '1px solid #2a3060', color: '#6080c0', padding: '0.4rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: !formTitle.trim() ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: !formTitle.trim() ? 0.5 : 1 }}>
              {saving ? 'ZAPISYWANIE...' : 'DODAJ ZADANIE'}
            </button>
          </div>
        </Card>
      )}

      {displayed.length === 0 ? (
        <div style={{ border: '1px dashed var(--color-bo-border)', padding: '3rem 2rem', textAlign: 'center', background: 'var(--color-bo-surface)' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)' }}>
            {tab === 'pending' ? 'BRAK OCZEKUJĄCYCH ZADAŃ' : 'ARCHIWUM PUSTE'}
          </div>
        </div>
      ) : (
        <div>
          {displayed.map(task => (
            <TaskRow key={task.id} task={task} currentAdmin={identifier} onToggleRead={handleToggleRead} onMarkDone={handleMarkDone} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
