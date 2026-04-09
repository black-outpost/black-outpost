import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { logAdminAction } from '../../data/adminLog'
import PageShell, { Card } from '../../components/ui/PageShell'
import {
  ReactFlow, Background, BackgroundVariant, Controls, MiniMap,
  BaseEdge, getStraightPath, Handle, Position,
  useNodesState, useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DEFAULT_SKILL_TREES } from '../../data/defaultSkillTrees'
import { applyUnlock, revokeUnlock } from '../../data/skillTreeLogic'

const STAT_KEYS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']
const COMMON_TAGS = [
  ['passive','Efekt Pasywny'], ['admin_action','Wymaga Akcji Admina'],
  ['sheer','Sheer'], ['inner','Inner'], ['external','External'], ['hopeful','Hopeful'],
]

const inp = {
  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)', padding: '0.38rem 0.55rem',
  fontSize: '0.75rem', fontFamily: 'var(--font-body)',
  width: '100%', boxSizing: 'border-box', outline: 'none',
}
const F = ({ label, children }) => (
  <div style={{ marginBottom: '0.46rem' }}>
    <label style={{ display: 'block', fontSize: '0.49rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.18rem' }}>{label}</label>
    {children}
  </div>
)
const btn = (extra) => ({
  fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.12em',
  cursor: 'pointer', padding: '0.38rem 0.6rem',
  border: '1px solid var(--color-bo-border)',
  background: 'none', color: 'var(--color-bo-text-dim)', ...extra,
})

function genId() { return 'nazo_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5) }

function defaultForm() {
  return {
    id: null, type: 'stat', label: '', tier: 1,
    shortDescription: '', longDescription: '', passiveName: '',
    maxPurchases: 1, statStat: 'nazo', statAmt: 1,
    requires: '', tags: '', extraTagSlots: '',
  }
}

// ── ReactFlow nodes ───────────────────────────────────────────────────────
function DashedEdge({ id, sourceX, sourceY, targetX, targetY, selected }) {
  const [p] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return <BaseEdge id={id} path={p} style={{ stroke: selected ? '#dc3232' : '#3a3a52', strokeWidth: 1, strokeDasharray: '6 4', opacity: 0.85 }} />
}
const CENTER_HANDLE = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, zIndex: -1 }

function NStatNode({ data, selected }) {
  const { label, maxPurchases = 1, tier = 1, nodeId = '' } = data
  const [hover, setHover] = useState(false)
  const r = 38; const cx = 50; const cy = 50; const S = 100
  const stroke = selected ? '#dc3232' : tier >= 2 ? '#6060a0' : '#3a3a5a'
  return (
    <div
      style={{ width: S, height: S, cursor: 'pointer', outline: selected ? '2px solid rgba(220,50,50,0.6)' : 'none', borderRadius: '50%', outlineOffset: 2, position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && nodeId && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', background: '#0e0e18', border: '1px solid #4060a0', borderRadius: '3px', padding: '2px 7px', fontSize: '0.5rem', color: '#a0c0e0', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 9999 }}>
          {nodeId}
        </div>
      )}
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>
        <circle cx={cx} cy={cy} r={r} fill={tier >= 2 ? '#0d0d1a' : '#111118'} />
        <circle cx={cx} cy={cy} r={r-1} fill="none" stroke={stroke} strokeWidth={selected ? 2 : 1.5} />
        {tier >= 2 && <circle cx={cx} cy={cy} r={r-5} fill="none" stroke="rgba(100,100,200,0.3)" strokeWidth={1} strokeDasharray="3 3" />}
        <text x={cx} y={cy+5} textAnchor="middle" fontSize={label.length > 6 ? 8 : 9} fontWeight="600" fill={tier >= 2 ? '#8080c0' : '#9090aa'} fontFamily="'Rajdhani', sans-serif">{label}</text>
        {maxPurchases > 1 && <text x={cx} y={cy+16} textAnchor="middle" fontSize={7} fill="rgba(150,150,180,0.6)" fontFamily="'Rajdhani', sans-serif">×{maxPurchases}</text>}
      </svg>
      <Handle type="source" position={Position.Bottom} style={CENTER_HANDLE} />
      <Handle type="target" position={Position.Top}    style={CENTER_HANDLE} />
    </div>
  )
}

function NSkillNode({ data, selected }) {
  const { label, tier = 1, nodeId = '' } = data
  const [hover, setHover] = useState(false)
  return (
    <div
      style={{ width: 160, minHeight: 52, background: tier >= 2 ? '#0d0d1e' : '#111118', border: `1px solid ${selected ? '#dc3232' : tier >= 2 ? '#5050a0' : '#2e2e3f'}`, borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && nodeId && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', background: '#0e0e18', border: '1px solid #4060a0', borderRadius: '3px', padding: '2px 7px', fontSize: '0.5rem', color: '#a0c0e0', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 9999 }}>
          {nodeId}
        </div>
      )}
      {tier >= 2 && <div style={{ fontSize: '0.44rem', color: '#6060a0', marginBottom: 2 }}>TIER {tier}</div>}
      <div style={{ fontSize: '0.62rem', fontWeight: 700, color: tier >= 2 ? '#8080c0' : '#c0c0d0', fontFamily: "'Rajdhani', sans-serif" }}>{label}</div>
      <Handle type="source" position={Position.Bottom} style={CENTER_HANDLE} />
      <Handle type="target" position={Position.Top}    style={CENTER_HANDLE} />
    </div>
  )
}
const nodeTypes = { stat: NStatNode, skill: NSkillNode }
const edgeTypes = { dashed: DashedEdge }

// ── Main ──────────────────────────────────────────────────────────────────
export default function NazoTreeEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { identifier: adminIdentifier, currentUser } = useAuth()
  const [char, setChar]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [nazoName, setNazoName]   = useState('')
  const [nazoUnlocked, setNazoUnlocked] = useState(false)
  const [thresholds, setThresholds] = useState({ 1: 0 })
  const [snapMode,  setSnapMode]  = useState('off')

  const GRID = 100
  const snapToGrid = snapMode !== 'off'
  const snapGrid   = [GRID, GRID]  // z nodeOrigin=[0.5,0.5] środek snapuje do środka kratki
  const [form, setForm]           = useState(defaultForm())
  const processing = useRef(false)

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([])
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(doc(db, 'characters', id), snap => {
      if (snap.exists()) setChar({ id: snap.id, ...snap.data() })
      setLoading(false)
    })
    return unsub
  }, [id])

  useEffect(() => {
    if (!char) return
    setNazoName(char.nazoName || '')
    setNazoUnlocked(char.nazoUnlocked || false)
    setThresholds(char.nazoThresholds ?? { 1: 0 })
  }, [char?.nazoName, char?.nazoUnlocked, char?.nazoThresholds])

  // Build ReactFlow from char.nazoNodes
  useEffect(() => {
    if (!char) return
    const nodes = (char.nazoNodes || []).map(n => ({
      id: n.id, type: n.type || 'stat',
      position: n.position || { x: 400, y: 400 },
      selected: n.id === form.id,
      data: { label: n.label, maxPurchases: n.maxPurchases ?? 1, tier: n.tier ?? 1, nodeId: n.id },
    }))
    const edges = buildEdges(char.nazoNodes || []).map(e => ({ ...e, type: 'dashed' }))
    setRfNodes(nodes)
    setRfEdges(edges)
  }, [char?.nazoNodes, form.id])

  function buildEdges(nodes) {
    const edges = []
    for (const n of nodes) {
      for (const req of (n.requires || [])) {
        if (nodes.find(x => x.id === req)) {
          edges.push({ id: `ne_${req}__${n.id}`, source: req, target: n.id })
        }
      }
    }
    return edges
  }

  const onNodeDragStop = useCallback((_e, _n, nodes) => {
    if (!char) return
    const updated = (char.nazoNodes || []).map(tn => {
      const rfn = nodes.find(n => n.id === tn.id)
      return rfn ? { ...tn, position: { x: Math.round(rfn.position.x), y: Math.round(rfn.position.y) } } : tn
    })
    updateDoc(doc(db, 'characters', id), { nazoNodes: updated }).catch(console.error)
  }, [char, id])

  const onNodeClick = useCallback((_e, node) => {
    const n = (char?.nazoNodes || []).find(x => x.id === node.id)
    if (!n) return

    // Load into form for editing
    const firstStat = Object.keys(n.statGrants || {})[0] || 'nazo'
    setForm({
      id: n.id, type: n.type || 'stat', label: n.label || '', tier: n.tier ?? 1,
      shortDescription: n.shortDescription || n.description || '',
      longDescription: n.longDescription || '',
      passiveName: n.passiveName || '',
      maxPurchases: n.maxPurchases || 1,
      statStat: firstStat, statAmt: (n.statGrants || {})[firstStat] || 1,
      requires: (n.requires || []).join(', '),
      tags: (n.tags || []).join(', '),
      extraTagSlots: (n.extraTagSlots ?? (n.extraTagSlot ? [n.extraTagSlot] : [])).join(', '),
    })
  }, [char, id])

  // Separate: admin unlock/revoke (called from canvas button, not node click)
  const onNodeUnlockRevoke = useCallback((_e, node) => {
    const n = (char?.nazoNodes || []).find(x => x.id === node.id)
    if (!n) return
    const nazoTree = makeNazoTree()
    const allTrees = { ...DEFAULT_SKILL_TREES, nazo: nazoTree }
    const unlocked = char?.unlockedNodes?.nazo ?? {}
    const purchases = unlocked[node.id] ?? 0
    const maxP = n.maxPurchases ?? 1
    const fullyBought = n.type === 'stat' ? purchases >= maxP : purchases > 0
    if (processing.current) return
    processing.current = true
    ;(fullyBought
      ? revokeUnlock(node.id, 'nazo', char, allTrees)
      : applyUnlock(node.id, 'nazo', char, allTrees, true)
    ).catch(console.error).finally(() => { processing.current = false })
  }, [char, id, thresholds])

  function makeNazoTree() {
    return {
      stat: 'nazo', isDefault: false, characterId: id,
      nodes: char?.nazoNodes || [],
      edges: buildEdges(char?.nazoNodes || []),
      thresholds,
    }
  }

  async function saveNode() {
    if (!form.label.trim()) return
    setSaving(true)
    const originalId = form.id || null
    const nodeId = form.id?.trim().replace(/\s+/g, '_') || genId()
    const tags = form.tags.split(',').map(s => s.trim()).filter(Boolean)

    // Sprawdź kolizję ID (tylko gdy nowy node lub zmiana ID)
    if (nodeId !== originalId && (char?.nazoNodes || []).some(n => n.id === nodeId)) {
      setSaving(false)
      alert(`ID "${nodeId}" jest już zajęte.`)
      return
    }

    const newNode = {
      id: nodeId, type: form.type, label: form.label.trim(),
      tier: Number(form.tier),
      position: (char?.nazoNodes || []).find(n => n.id === originalId)?.position || { x: 400, y: 800 },
      statGrants: form.type === 'stat' ? { [form.statStat]: Number(form.statAmt) } : {},
      maxPurchases: form.type === 'stat' ? Number(form.maxPurchases) : 1,
      requires: form.requires.split(',').map(s => s.trim()).filter(Boolean),
      blocks: [], tags,
      ...(form.shortDescription.trim() ? { shortDescription: form.shortDescription.trim() } : {}),
      ...(form.longDescription.trim()  ? { longDescription:  form.longDescription.trim()  } : {}),
      ...(form.passiveName.trim()      ? { passiveName:      form.passiveName.trim()      } : {}),
    }
    const extraSlots = form.extraTagSlots.split(',').map(s => s.trim()).filter(Boolean)
    if (extraSlots.length > 0) newNode.extraTagSlots = extraSlots

    let nodes = [...(char?.nazoNodes || [])]
    if (originalId) {
      const idx = nodes.findIndex(n => n.id === originalId)
      if (idx !== -1) nodes[idx] = newNode; else nodes.push(newNode)
      // Jeśli zmieniono ID — zaktualizuj requires innych węzłów
      if (nodeId !== originalId) {
        nodes = nodes.map(n => ({
          ...n,
          requires: (n.requires || []).map(r => r === originalId ? nodeId : r),
        }))
      }
    } else { nodes.push(newNode) }
    try {
      await updateDoc(doc(db, 'characters', id), { nazoNodes: nodes })
      await logAdminAction({
        adminIdentifier, adminUid: currentUser?.uid ?? '',
        action: form.id ? 'edit_nazo_node' : 'add_nazo_node',
        targetId: id,
        targetName: `${char?.firstName ?? ''} ${char?.lastName ?? ''} (${char?.identifier ?? id})`,
        category: 'nazo',
        changes: [{ field: 'nazoNode', before: form.id ? char?.nazoNodes?.find(n => n.id === form.id)?.label ?? form.id : null, after: newNode.label }],
      })
      setForm(defaultForm())
    } finally { setSaving(false) }
  }

  async function deleteNode(nodeId) {
    if (!window.confirm('Usunąć węzeł?')) return
    const nodes = (char?.nazoNodes || []).filter(n => n.id !== nodeId)
      .map(n => ({ ...n, requires: (n.requires || []).filter(r => r !== nodeId) }))
    await updateDoc(doc(db, 'characters', id), { nazoNodes: nodes })
    if (form.id === nodeId) setForm(defaultForm())
  }

  async function saveSettings() {
    setSaving(true)
    // Sanitize thresholds: keys as numbers, values as numbers
    const cleanThresh = Object.fromEntries(
      Object.entries(thresholds).map(([k, v]) => [String(k), Number(v)])
    )
    try {
      await updateDoc(doc(db, 'characters', id), {
        nazoName: nazoName.trim() || null,
        nazoUnlocked,
        nazoThresholds: cleanThresh,
      })
      await logAdminAction({
        adminIdentifier, adminUid: currentUser?.uid ?? '',
        action: 'edit_nazo_settings',
        targetId: id,
        targetName: `${char?.firstName ?? ''} ${char?.lastName ?? ''} (${char?.identifier ?? id})`,
        category: 'nazo',
        changes: [
          { field: 'nazoName',      before: char?.nazoName ?? null,      after: nazoName.trim() || null },
          { field: 'nazoUnlocked',  before: char?.nazoUnlocked ?? false, after: nazoUnlocked },
        ],
      })
    } finally { setSaving(false) }
  }

  function addTier() {
    const maxTier = Math.max(...Object.keys(thresholds).map(Number), 1)
    setThresholds(t => ({ ...t, [maxTier + 1]: 50 }))
  }
  function removeTier(tier) {
    if (Number(tier) <= 1) return
    const t = { ...thresholds }; delete t[tier]
    setThresholds(t)
  }

  const allTierNums = Object.keys(thresholds).map(Number).sort((a, b) => a - b)
  const currentTags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
  const nodes = char?.nazoNodes || []

  if (loading) return <div style={{ padding: '2rem', color: 'var(--color-bo-muted)', fontSize: '0.75rem' }}>LOADING...</div>
  if (!char)   return <div style={{ padding: '2rem', color: 'var(--color-bo-muted)', fontSize: '0.75rem' }}>CHARACTER NOT FOUND</div>

  return (
    <PageShell title={'NAZO: ' + char.identifier} subtitle="EDYTOR DRZEWKA NAZO">
      <div style={{ marginBottom: '0.75rem' }}>
        <button onClick={() => navigate('/admin/view/' + id)} style={btn()}>← POWRÓT DO POSTACI</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '1rem', alignItems: 'start' }}>
        {/* ── Left ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

          {/* Settings */}
          <Card title="USTAWIENIA">
            <F label="NAZWA DRZEWKA"><input value={nazoName} onChange={e => setNazoName(e.target.value)} placeholder="np. Badania" style={inp} /></F>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input type="checkbox" id="nu" checked={nazoUnlocked} onChange={e => setNazoUnlocked(e.target.checked)} style={{ accentColor: 'var(--color-bo-red)' }} />
              <label htmlFor="nu" style={{ fontSize: '0.65rem', color: 'var(--color-bo-text)', cursor: 'pointer' }}>ODBLOKOWANE (widoczne dla gracza)</label>
            </div>

            {/* Tier thresholds */}
            <div style={{ fontSize: '0.5rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.3rem', marginTop: '0.4rem' }}>PROGI TIERÓW (nazo stat ≥)</div>
            {allTierNums.map(tier => (
              <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.58rem', color: 'var(--color-bo-muted)', width: '32px' }}>T{tier}</span>
                <span style={{ fontSize: '0.58rem', color: 'var(--color-bo-text-dim)', width: '44px' }}>nazo ≥</span>
                <input
                  type="number" min={0} value={thresholds[tier] ?? 0}
                  onChange={e => setThresholds(t => ({ ...t, [tier]: Number(e.target.value) }))}
                  style={{ ...inp, width: '60px' }}
                  disabled={tier === 1}
                />
                {tier > 1 && (
                  <button onClick={() => removeTier(tier)} style={{ background: 'none', border: 'none', color: 'var(--color-bo-red)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>×</button>
                )}
              </div>
            ))}
            <button onClick={addTier} style={{ ...btn({ width: '100%', textAlign: 'center', marginBottom: '0.5rem' }) }}>+ DODAJ TIER</button>

            <button onClick={saveSettings} disabled={saving} style={btn({ width: '100%', background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', textAlign: 'center' })}>
              {saving ? 'ZAPISYWANIE...' : 'ZAPISZ USTAWIENIA'}
            </button>
          </Card>

          {/* Node form */}
          <Card title={form.id ? '✎ EDYTUJ WĘZEŁ' : '+ DODAJ WĘZEŁ'}>
            {form.id && (
              <F label="ID (edytowalne — zmiana aktualizuje też requires innych węzłów)">
                <input
                  value={form.id}
                  onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                  style={{ ...inp, fontFamily: 'monospace', fontSize: '0.68rem', color: form.id !== (char?.nazoNodes?.find(n => n.label === form.label)?.id ?? form.id) ? '#d4a840' : 'var(--color-bo-text)' }}
                />
              </F>
            )}
            <F label="TYP">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inp}>
                <option value="stat">Stat (okrąg)</option>
                <option value="skill">Skill (prostokąt)</option>
              </select>
            </F>
            <F label="ETYKIETA"><input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} style={inp} /></F>
            <F label="TIER">
              <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: Number(e.target.value) }))} style={inp}>
                {allTierNums.map(t => <option key={t} value={t}>Tier {t} {t > 1 ? `(nazo ≥ ${thresholds[t] ?? 0})` : ''}</option>)}
              </select>
            </F>
            {form.type === 'stat' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 55px 55px', gap: '0 0.3rem' }}>
                <F label="STAT">
                  <select value={form.statStat} onChange={e => setForm(f => ({ ...f, statStat: e.target.value }))} style={inp}>
                    {STAT_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </F>
                <F label="ILE"><input type="number" min={1} value={form.statAmt} onChange={e => setForm(f => ({ ...f, statAmt: e.target.value }))} style={inp} /></F>
                <F label="MAX ×"><input type="number" min={1} max={10} value={form.maxPurchases} onChange={e => setForm(f => ({ ...f, maxPurchases: e.target.value }))} style={inp} /></F>
              </div>
            )}
            <F label="KRÓTKI OPIS">
              <textarea value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} rows={2} style={{ ...inp, resize: 'vertical' }} />
            </F>
            <F label="DŁUGI OPIS (tooltip, 0.2x[Stat] OK)">
              <textarea value={form.longDescription} onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} />
            </F>
            {currentTags.includes('passive') && (
              <F label="NAZWA EFEKTU PASYWNEGO"><input value={form.passiveName} onChange={e => setForm(f => ({ ...f, passiveName: e.target.value }))} style={inp} /></F>
            )}
            <F label="TAGI">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '3px' }}>
                {COMMON_TAGS.map(([tag, lbl]) => {
                  const has = currentTags.includes(tag)
                  return (
                    <button key={tag} type="button" onClick={() => {
                      const next = has ? currentTags.filter(t => t !== tag) : [...currentTags, tag]
                      setForm(f => ({ ...f, tags: next.join(', ') }))
                    }} style={{ background: has ? 'rgba(220,50,50,0.15)' : 'none', border: `1px solid ${has ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`, color: has ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', padding: '2px 6px', fontSize: '0.49rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      {lbl}
                    </button>
                  )
                })}
              </div>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={{ ...inp, fontSize: '0.63rem' }} placeholder="inne tagi..." />
            </F>
            <F label='EXTRA TAG SLOTS (tagi po przecinku — "+1 slot na tę grupę")'>
              <input value={form.extraTagSlots} onChange={e => setForm(f => ({ ...f, extraTagSlots: e.target.value }))} style={inp} placeholder="inner, external" />
            </F>
            <F label="WYMAGA (IDs po przecinku)">
              <input value={form.requires} onChange={e => setForm(f => ({ ...f, requires: e.target.value }))} style={inp} placeholder="nazo_abc123, nazo_def456" />
            </F>
            {nodes.filter(n => n.id !== form.id).length > 0 && (() => {
              const segments = form.requires.split(',')
              const lastSeg  = segments[segments.length - 1].trim().toLowerCase()
              const cur      = form.requires.split(',').map(s => s.trim()).filter(Boolean)
              const filtered = nodes.filter(n => n.id !== form.id).filter(n =>
                !lastSeg || n.id.toLowerCase().includes(lastSeg) || (n.label ?? '').toLowerCase().includes(lastSeg)
              )
              return (
                <div style={{ marginBottom: '0.4rem', padding: '0.35rem 0.4rem', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', maxHeight: '90px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.44rem', color: 'var(--color-bo-muted)', marginBottom: '3px', letterSpacing: '0.1em' }}>
                    KLIKNIJ BY DODAĆ / USUNĄĆ{lastSeg ? ` — filtr: "${lastSeg}"` : ''}:
                  </div>
                  {filtered.length === 0 && <div style={{ fontSize: '0.52rem', color: 'var(--color-bo-muted)', fontStyle: 'italic' }}>brak wyników</div>}
                  {filtered.map(n => {
                    const active = cur.includes(n.id)
                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          const next = active ? cur.filter(id => id !== n.id) : [...cur, n.id]
                          setForm(f => ({ ...f, requires: next.join(', ') }))
                        }}
                        style={{ fontSize: '0.55rem', color: active ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', lineHeight: 1.7, cursor: 'pointer', padding: '0 2px', background: active ? 'rgba(220,50,50,0.07)' : 'none', borderRadius: '2px' }}
                      >
                        {active ? '✓ ' : '+ '}<span style={{ color: 'var(--color-bo-muted)', marginRight: 3 }}>T{n.tier ?? 1}</span>{n.label} <span style={{ color: 'var(--color-bo-muted)', fontSize: '0.44rem' }}>({n.id})</span>
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem' }}>
              {form.id && (
                <>
                  <button onClick={() => setForm(defaultForm())} style={btn()}>ANULUJ</button>
                  <button onClick={() => deleteNode(form.id)} style={btn({ color: 'var(--color-bo-red)' })}>USUŃ</button>
                </>
              )}
              <button onClick={saveNode} disabled={saving || !form.label.trim()} style={btn({ flex: 1, background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', textAlign: 'center', opacity: !form.label.trim() ? 0.5 : 1 })}>
                {saving ? 'ZAPISYWANIE...' : form.id ? 'ZAPISZ' : 'DODAJ'}
              </button>
            </div>
            {/* Admin unlock/revoke for selected node */}
            {form.id && (() => {
              const n = (char?.nazoNodes || []).find(x => x.id === form.id)
              if (!n) return null
              const unlocked = char?.unlockedNodes?.nazo ?? {}
              const purchases = unlocked[form.id] ?? 0
              const maxP = n.maxPurchases ?? 1
              const fullyBought = n.type === 'stat' ? purchases >= maxP : purchases > 0
              return (
                <button onClick={e => onNodeUnlockRevoke(e, { id: form.id })} style={{ ...btn({ width: '100%', textAlign: 'center', marginTop: '0.3rem' }), background: fullyBought ? 'rgba(220,96,32,0.1)' : 'rgba(64,192,128,0.1)', border: `1px solid ${fullyBought ? '#8a4010' : 'rgba(64,192,128,0.3)'}`, color: fullyBought ? '#dc6020' : '#60c080' }}>
                  {fullyBought ? `↩ COFNIJ WYKUPIENIE (${purchases}/${maxP})` : `▶ WYKUP DLA GRACZA (${purchases}/${maxP})`}
                </button>
              )
            })()}
          </Card>

          {/* Node list */}
          {nodes.length > 0 && (
            <Card title={`WĘZŁY (${nodes.length})`}>
              <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                {nodes.map(n => (
                  <div key={n.id} onClick={() => onNodeClick(null, { id: n.id })}
                    style={{ padding: '3px 4px', cursor: 'pointer', borderBottom: '1px solid var(--color-bo-border)', background: form.id === n.id ? 'rgba(220,50,50,0.06)' : 'none', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.47rem', color: 'var(--color-bo-muted)', flexShrink: 0 }}>T{n.tier ?? 1}</span>
                    <span style={{ flex: 1, fontSize: '0.6rem', color: form.id === n.id ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.label}</span>
                    <span style={{ fontSize: '0.47rem', color: 'var(--color-bo-muted)', flexShrink: 0 }}>{n.id.slice(-6)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* ── Canvas ── */}
        <div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.52rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginRight: '2px' }}>SNAP:</span>
            {[['off','WYŁ.'],['on','WŁĄCZ']].map(([mode, lbl]) => (
              <button key={mode} onClick={() => setSnapMode(mode)} style={{
                background: snapMode === mode ? 'rgba(220,50,50,0.12)' : 'none',
                border: `1px solid ${snapMode === mode ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`,
                color: snapMode === mode ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)',
                padding: '0.2rem 0.55rem', fontSize: '0.52rem', letterSpacing: '0.1em',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}>{lbl}</button>
            ))}
            <span style={{ fontSize: '0.5rem', color: 'var(--color-bo-muted)', marginLeft: '0.4rem' }}>
              Środek node'a snapuje do środka kratki · Drag = przesuń · Klik = edytuj
            </span>
          </div>
          <div style={{ height: '700px', background: '#0a0a0f', border: '1px solid var(--color-bo-border)' }}>
            {nodes.length > 0 ? (
              <ReactFlow
                nodes={rfNodes} edges={rfEdges}
                nodeTypes={nodeTypes} edgeTypes={edgeTypes}
                onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick} onNodeDragStop={onNodeDragStop}
                nodesDraggable nodesConnectable={false}
                snapToGrid={snapToGrid} snapGrid={snapGrid}
                nodeOrigin={[0.5, 0.5]}
                fitView fitViewOptions={{ padding: 0.1 }}
                minZoom={0.25} maxZoom={2}
                proOptions={{ hideAttribution: true }}
              >
                <Background variant={BackgroundVariant.Lines} color="#1e1e2a" gap={GRID} lineWidth={1} />
                <Controls style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)' }} />
                <MiniMap nodeColor={n => n.data?.tier >= 2 ? '#4040a0' : '#3a3a5a'} maskColor="rgba(10,10,15,0.85)" style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)' }} />
              </ReactFlow>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--color-bo-muted)', fontSize: '0.65rem', letterSpacing: '0.14em' }}>DODAJ WĘZŁY BY ZBUDOWAĆ DRZEWO</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
