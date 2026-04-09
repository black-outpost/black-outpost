/**
 * GlobalSkillTreeEditor — edytor globalnych drzewek (Strength … Tamashi)
 * Zapis do Firestore: skillTrees/{stat}  (isDefault: true)
 * Zmiany tu = zmiany u WSZYSTKICH graczy.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'
import {
  ReactFlow, Background, BackgroundVariant, Controls, MiniMap,
  BaseEdge, getStraightPath,
  Handle, Position,
  useNodesState, useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DEFAULT_SKILL_TREES } from '../../data/defaultSkillTrees'
import { TIER_THRESHOLDS } from '../../data/statThresholds'

// ── Constants ─────────────────────────────────────────────────────────────
const STATS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi']
const ALL_STAT_KEYS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']

const inp = {
  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)', padding: '0.38rem 0.55rem',
  fontSize: '0.75rem', fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box',
  outline: 'none',
}
const btnBase = {
  fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.12em',
  cursor: 'pointer', padding: '0.4rem 0.6rem',
  border: '1px solid var(--color-bo-border)',
  background: 'none', color: 'var(--color-bo-text-dim)',
}
const F = ({ label, children }) => (
  <div style={{ marginBottom: '0.5rem' }}>
    <label style={{ display: 'block', fontSize: '0.5rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.2rem' }}>{label}</label>
    {children}
  </div>
)
const Div = () => <div style={{ borderTop: '1px solid var(--color-bo-border)', margin: '0.75rem 0' }} />

// ── Sanitize node for Firestore (no undefined anywhere) ───────────────────
function sanitizeNode(n) {
  const node = {
    id:           String(n.id ?? ''),
    type:         String(n.type ?? 'stat'),
    label:        String(n.label ?? ''),
    tier:         Number(n.tier ?? 1),
    maxPurchases: Number(n.maxPurchases ?? 1),
    requires:     (n.requires ?? []).filter(Boolean).map(String),
    tags:         (n.tags ?? []).filter(Boolean).map(String),
    blocks:       (n.blocks ?? []).map(b => ({
      tree: String(b.tree ?? '*'),
      tags: (b.tags ?? []).filter(Boolean).map(String),
      ...(b.excludeNodeId != null ? { excludeNodeId: String(b.excludeNodeId) } : {}),
      ...(b.maxTagCount   != null ? { maxTagCount:   Number(b.maxTagCount)    } : {}),
    })),
    statGrants:   Object.fromEntries(
      Object.entries(n.statGrants ?? {})
        .filter(([, v]) => v != null)
        .map(([k, v]) => [String(k), Number(v)])
    ),
    position: { x: Number(n.position?.x ?? 0), y: Number(n.position?.y ?? 0) },
  }
  if (n.shortDescription?.trim()) node.shortDescription = n.shortDescription.trim()
  if (n.longDescription?.trim())  node.longDescription  = n.longDescription.trim()
  if (n.passiveName?.trim())      node.passiveName      = n.passiveName.trim()
  if (n.description?.trim())      node.description      = n.description.trim()
  if (Array.isArray(n.extraTagSlots) && n.extraTagSlots.length > 0) node.extraTagSlots = n.extraTagSlots
  else if (n.extraTagSlot?.trim()) node.extraTagSlot = n.extraTagSlot.trim()
  return node
}

function sanitizeEdge(e) {
  return { id: String(e.id), source: String(e.source), target: String(e.target) }
}

// ── Build edges from requires ─────────────────────────────────────────────
function buildEdgesFromNodes(nodes) {
  const edges = []
  for (const node of nodes) {
    for (const reqId of (node.requires ?? [])) {
      if (nodes.find(n => n.id === reqId)) {
        edges.push({ id: `e_${reqId}_${node.id}`, source: reqId, target: node.id })
      }
    }
  }
  return edges
}

// ── ReactFlow node components ─────────────────────────────────────────────
function DashedEdge({ id, sourceX, sourceY, targetX, targetY, selected }) {
  const [p] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <BaseEdge id={id} path={p}
      style={{ stroke: selected ? '#dc3232' : '#3a3a52', strokeWidth: selected ? 2 : 1, strokeDasharray: '6 4', opacity: 0.85 }}
    />
  )
}

const CENTER_HANDLE = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, zIndex: -1 }

function EditorStatNode({ data, selected }) {
  const { label, maxPurchases = 1, tier = 1, nodeId = '' } = data
  const [hover, setHover] = useState(false)
  const r = 38; const cx = 50; const cy = 50; const S = 100
  const stroke = selected ? '#dc3232' : tier >= 2 ? '#6060a0' : '#3a3a5a'
  return (
    <div
      style={{ width: S, height: S, cursor: 'pointer', position: 'relative', outline: selected ? '2px solid rgba(220,50,50,0.6)' : 'none', borderRadius: '50%', outlineOffset: 2 }}
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
        <text x={cx} y={cy+5} textAnchor="middle" fontSize={label.length > 6 ? 8 : 9} fontWeight="600" fill={tier >= 2 ? '#8080c0' : '#9090aa'} fontFamily="'Rajdhani', sans-serif" letterSpacing="0.05em">{label}</text>
        {maxPurchases > 1 && <text x={cx} y={cy+16} textAnchor="middle" fontSize={7} fill="rgba(150,150,180,0.6)" fontFamily="'Rajdhani', sans-serif">×{maxPurchases}</text>}
      </svg>
      <Handle type="source" position={Position.Bottom} style={CENTER_HANDLE} />
      <Handle type="target" position={Position.Top}    style={CENTER_HANDLE} />
    </div>
  )
}

function EditorSkillNode({ data, selected }) {
  const { label, description = '', tier = 1, nodeId = '' } = data
  const [hover, setHover] = useState(false)
  return (
    <div
      style={{ width: 160, minHeight: 58, background: tier >= 2 ? '#0d0d1e' : '#111118', border: `1px solid ${selected ? '#dc3232' : tier >= 2 ? '#5050a0' : '#2e2e3f'}`, borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', outline: selected ? '1px solid rgba(220,50,50,0.4)' : 'none', outlineOffset: 2, position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && nodeId && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', background: '#0e0e18', border: '1px solid #4060a0', borderRadius: '3px', padding: '2px 7px', fontSize: '0.5rem', color: '#a0c0e0', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 9999 }}>
          {nodeId}
        </div>
      )}
      {tier >= 2 && <div style={{ fontSize: '0.45rem', color: '#6060a0', marginBottom: 2, letterSpacing: '0.15em' }}>TIER 2</div>}
      <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: tier >= 2 ? '#8080c0' : '#c0c0d0', lineHeight: 1.3, fontFamily: "'Rajdhani', sans-serif" }}>{label}</div>
      {description && <div style={{ fontSize: '0.52rem', color: '#4a4a64', lineHeight: 1.45, fontFamily: "'Rajdhani', sans-serif", marginTop: 4 }}>{description.length > 80 ? description.slice(0, 77) + '…' : description}</div>}
      <Handle type="source" position={Position.Bottom} style={CENTER_HANDLE} />
      <Handle type="target" position={Position.Top}    style={CENTER_HANDLE} />
    </div>
  )
}

function SepNode() {
  return (
    <div style={{ width: 2400, height: 30, pointerEvents: 'none', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed rgba(100,100,180,0.25)', transform: 'translateY(-50%)' }} />
      <div style={{ position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)', fontSize: '0.44rem', letterSpacing: '0.25em', color: 'rgba(100,100,180,0.35)', fontFamily: "'Cinzel', serif", whiteSpace: 'nowrap', background: 'rgba(10,10,15,0.9)', padding: '0 12px' }}>▲ TIER 2</div>
      <div style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', fontSize: '0.44rem', letterSpacing: '0.25em', color: 'rgba(100,100,180,0.35)', fontFamily: "'Cinzel', serif", whiteSpace: 'nowrap', background: 'rgba(10,10,15,0.9)', padding: '0 12px' }}>TIER 1 ▼</div>
    </div>
  )
}

const nodeTypes = { stat: EditorStatNode, skill: EditorSkillNode, sep: SepNode }
const edgeTypes = { dashed: DashedEdge }

// ── toFlowNodes ───────────────────────────────────────────────────────────
function toFlowNodes(treeNodes, selectedId, thresholds) {
  const t1 = treeNodes.filter(n => (n.tier ?? 1) === 1)
  const t2 = treeNodes.filter(n => (n.tier ?? 1) >= 2)
  const result = treeNodes.map(n => ({
    id:   n.id,
    type: n.type,
    position: n.position,
    selected: n.id === selectedId,
    data: { label: n.label, description: n.description ?? '', maxPurchases: n.maxPurchases ?? 1, tier: n.tier ?? 1, nodeId: n.id },
  }))
  if (t1.length > 0 && t2.length > 0) {
    const t2maxY = Math.max(...t2.map(n => n.position.y))
    const t1minY = Math.min(...t1.map(n => n.position.y))
    result.push({ id: '__sep', type: 'sep', position: { x: -200, y: Math.round((t2maxY + t1minY) / 2) - 15 }, draggable: false, selectable: false, data: {} })
  }
  return result
}

function toFlowEdges(treeNodes) {
  return buildEdgesFromNodes(treeNodes).map(e => ({ ...e, type: 'dashed' }))
}

// ─────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────
export default function GlobalSkillTreeEditor() {
  const [activeStat, setActiveStat] = useState('strength')
  const [treeDoc,    setTreeDoc]    = useState(null)
  const [treeNodes,  setTreeNodes]  = useState([])
  const [thresholds, setThresholds] = useState({})
  const [saving,     setSaving]     = useState(false)
  const [dirty,      setDirty]      = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [snapMode,   setSnapMode]   = useState('off') // 'off' | 'on'

  const GRID = 100  // rozmiar kratki = rozmiar stat node'a
  const snapToGrid = snapMode !== 'off'
  const snapGrid   = [GRID, GRID]  // z nodeOrigin=[0.5,0.5] środek node'a snapuje do kratki
  const unsubRef = useRef(null)

  const [form, setForm] = useState(defaultForm())
  function defaultForm() {
    return { id: '', type: 'stat', label: '', shortDescription: '', longDescription: '', passiveName: '', tier: 1, maxPurchases: 1, statGrantStat: 'strength', statGrantAmt: 1, requires: '', tags: '', blocks: '', extraTagSlots: '' }
  }

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([])
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([])

  // ── Load tree ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null }
    setSelectedId(null); setForm(defaultForm()); setDirty(false)

    const unsub = onSnapshot(doc(db, 'skillTrees', activeStat), snap => {
      let nodes, thresh
      if (snap.exists()) {
        const d = snap.data()
        nodes  = (d.nodes  ?? []).map(sanitizeNode)
        thresh = d.thresholds ?? TIER_THRESHOLDS[activeStat] ?? {}
        setTreeDoc({ id: snap.id, ...d })
      } else {
        nodes  = (DEFAULT_SKILL_TREES[activeStat]?.nodes ?? []).map(sanitizeNode)
        thresh = { ...(TIER_THRESHOLDS[activeStat] ?? {}) }
        setTreeDoc(null)
      }
      setTreeNodes(nodes)
      setThresholds(thresh)
    }, err => {
      console.warn('Firestore read failed, using defaults:', err)
      const nodes  = (DEFAULT_SKILL_TREES[activeStat]?.nodes ?? []).map(sanitizeNode)
      const thresh = { ...(TIER_THRESHOLDS[activeStat] ?? {}) }
      setTreeNodes(nodes); setThresholds(thresh); setTreeDoc(null)
    })
    unsubRef.current = unsub
    return () => { unsub(); unsubRef.current = null }
  }, [activeStat])

  // ── Sync → ReactFlow ───────────────────────────────────────────────────
  useEffect(() => {
    setRfNodes(toFlowNodes(treeNodes, selectedId, thresholds))
    setRfEdges(toFlowEdges(treeNodes))
  }, [treeNodes, selectedId, thresholds])

  // ── Save — fully sanitized, no undefined anywhere ──────────────────────
  async function saveTree(nodes, thresh) {
    setSaving(true)
    try {
      const cleanNodes = nodes.map(sanitizeNode)
      const cleanEdges = buildEdgesFromNodes(cleanNodes).map(sanitizeEdge)
      const cleanThresh = Object.fromEntries(
        Object.entries(thresh).map(([k, v]) => [String(k), Number(v)])
      )
      await setDoc(doc(db, 'skillTrees', activeStat), {
        stat:        activeStat,
        isDefault:   true,
        characterId: null,
        nodes:       cleanNodes,
        edges:       cleanEdges,
        thresholds:  cleanThresh,
        updatedAt:   serverTimestamp(),
      })
      setDirty(false)
    } catch (e) {
      console.error('Save failed:', e)
      alert('Save failed: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Drag ───────────────────────────────────────────────────────────────
  const onNodeDragStop = useCallback((_e, _n, nodes) => {
    const updated = treeNodes.map(tn => {
      const rfn = nodes.find(n => n.id === tn.id)
      return rfn ? { ...tn, position: { x: Number(rfn.position.x), y: Number(rfn.position.y) } } : tn
    })
    setTreeNodes(updated); setDirty(true)
  }, [treeNodes])

  // ── Click ──────────────────────────────────────────────────────────────
  const onNodeClick = useCallback((_e, node) => {
    if (node.id === '__sep') return
    setSelectedId(node.id)
    const n = treeNodes.find(t => t.id === node.id)
    if (!n) return
    setForm({
      id: n.id, type: n.type ?? 'stat', label: n.label ?? '',
      shortDescription: n.shortDescription ?? n.description ?? '',
      longDescription:  n.longDescription ?? '',
      passiveName:      n.passiveName ?? '',
      tier: n.tier ?? 1, maxPurchases: n.maxPurchases ?? 1,
      statGrantStat: Object.keys(n.statGrants ?? {})[0] ?? activeStat,
      statGrantAmt:  Object.values(n.statGrants ?? {})[0] ?? 1,
      requires: (n.requires ?? []).join(', '),
      tags:     (n.tags ?? []).join(', '),
      blocks:   JSON.stringify(n.blocks ?? []),
      extraTagSlots: (n.extraTagSlots ?? (n.extraTagSlot ? [n.extraTagSlot] : [])).join(', '),
    })
  }, [treeNodes])

  // ── Add ────────────────────────────────────────────────────────────────
  function handleAddNode() {
    const newId = `${activeStat.slice(0,3)}_${Date.now()}`
    const newNode = { id: newId, type: 'stat', label: '+1', tier: 1, position: { x: 780, y: 900 }, statGrants: { [activeStat]: 1 }, maxPurchases: 1, requires: [], tags: [], blocks: [] }
    setTreeNodes([...treeNodes, newNode])
    setSelectedId(newId)
    setForm({ id: newId, type: 'stat', label: '+1', description: '', tier: 1, maxPurchases: 1, statGrantStat: activeStat, statGrantAmt: 1, requires: '', tags: '', blocks: '', extraTagSlots: '' })
    setDirty(true)
  }

  // ── Apply changes ──────────────────────────────────────────────────────
  function handleSaveNode() {
    if (!form.id) return
    const originalId = selectedId
    const newId = form.id.trim().replace(/\s+/g, '_')
    if (!newId) return

    // Jeśli zmieniono ID — sprawdź czy nowe nie jest zajęte
    if (newId !== originalId && treeNodes.some(n => n.id === newId)) {
      alert(`ID "${newId}" jest już zajęte przez inny węzeł.`)
      return
    }

    let parsedBlocks = []
    try { parsedBlocks = JSON.parse(form.blocks || '[]') } catch(e) {
      console.error('BLOCKS JSON parse failed:', e.message, '| raw:', form.blocks)
      parsedBlocks = []
    }
    const pos = treeNodes.find(n => n.id === originalId)?.position ?? { x: 780, y: 900 }
    const updated = {
      id:           newId,
      type:         form.type,
      label:        form.label.trim() || '?',
      tier:         Number(form.tier),
      maxPurchases: form.type === 'stat' ? Number(form.maxPurchases) : 1,
      statGrants:   form.type === 'stat' ? { [form.statGrantStat]: Number(form.statGrantAmt) } : {},
      requires:     form.requires.split(',').map(s => s.trim()).filter(Boolean),
      tags:         form.tags.split(',').map(s => s.trim()).filter(Boolean),
      blocks:       parsedBlocks,
      position:     pos,
      ...(form.shortDescription.trim() ? { shortDescription: form.shortDescription.trim() } : {}),
      ...(form.longDescription.trim()  ? { longDescription:  form.longDescription.trim()  } : {}),
      ...(form.passiveName.trim()       ? { passiveName:      form.passiveName.trim()       } : {}),
    }
    const extraSlots = form.extraTagSlots.split(',').map(s => s.trim()).filter(Boolean)
    if (extraSlots.length > 0) updated.extraTagSlots = extraSlots

    // Jeśli zmieniono ID — zaktualizuj też requires wszystkich innych węzłów
    let newNodes = treeNodes.map(n => n.id === originalId ? updated : n)
    if (newId !== originalId) {
      newNodes = newNodes.map(n => ({
        ...n,
        requires: (n.requires ?? []).map(r => r === originalId ? newId : r),
      }))
      setSelectedId(newId)
      setForm(f => ({ ...f, id: newId }))
    }

    setTreeNodes(newNodes)
    setDirty(true)
  }

  // ── Delete ─────────────────────────────────────────────────────────────
  function handleDeleteNode() {
    if (!selectedId || !window.confirm(`Delete node "${form.label}"?`)) return
    setTreeNodes(treeNodes.filter(n => n.id !== selectedId).map(n => ({ ...n, requires: (n.requires ?? []).filter(r => r !== selectedId) })))
    setSelectedId(null); setForm(defaultForm()); setDirty(true)
  }

  // ── Tier config ────────────────────────────────────────────────────────
  function handleThresholdChange(tier, val) { setThresholds({ ...thresholds, [tier]: Number(val) }); setDirty(true) }
  function handleAddTier() {
    const max = Math.max(...Object.keys(thresholds).map(Number), 1)
    setThresholds({ ...thresholds, [max + 1]: 100 }); setDirty(true)
  }
  function handleRemoveTier(tier) {
    if (Number(tier) <= 2) return
    const t = { ...thresholds }; delete t[tier]
    setThresholds(t)
    setTreeNodes(treeNodes.map(n => n.tier === Number(tier) ? { ...n, tier: 1 } : n))
    setDirty(true)
  }

  function handleReset() {
    if (!window.confirm(`Reset "${activeStat}" to built-in defaults? All changes will be lost.`)) return
    const nodes  = (DEFAULT_SKILL_TREES[activeStat]?.nodes ?? []).map(sanitizeNode)
    const thresh = { ...(TIER_THRESHOLDS[activeStat] ?? {}) }
    setTreeNodes(nodes); setThresholds(thresh); setSelectedId(null); setForm(defaultForm()); setDirty(true)
  }

  const allTiers = Object.keys(thresholds).map(Number).sort((a, b) => a - b)

  return (
    <PageShell title="GLOBAL SKILL TREE EDITOR" subtitle="EDIT STANDARD TREES — CHANGES AFFECT ALL PLAYERS">
      {/* Stat tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {STATS.map(stat => (
          <button key={stat}
            onClick={() => { if (dirty && !window.confirm('Unsaved changes — switch anyway?')) return; setActiveStat(stat) }}
            style={{ background: activeStat === stat ? 'rgba(220,50,50,0.15)' : 'var(--color-bo-surface)', border: '1px solid ' + (activeStat === stat ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: activeStat === stat ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.38rem 0.75rem', fontSize: '0.6rem', letterSpacing: '0.14em', fontFamily: 'var(--font-body)', cursor: 'pointer' }}
          >{stat.toUpperCase()}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '1rem', alignItems: 'start' }}>
        {/* Left panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          <Card title="TREE STATUS">
            <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>
              Nodes: <b style={{ color: 'var(--color-bo-text)' }}>{treeNodes.length}</b>
              <span style={{ marginLeft: '0.75rem' }}>Source: <b style={{ color: treeDoc ? '#60c080' : '#c0a000' }}>{treeDoc ? 'FIRESTORE' : 'DEFAULT'}</b></span>
            </div>
            {dirty && <div style={{ fontSize: '0.58rem', color: '#e0a000', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>⚠ UNSAVED CHANGES</div>}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={() => saveTree(treeNodes, thresholds)} disabled={!dirty || saving}
                style={{ ...btnBase, flex: 1, background: dirty ? 'rgba(220,50,50,0.1)' : 'none', border: '1px solid ' + (dirty ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: dirty ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'SAVING...' : 'SAVE TO FIRESTORE'}
              </button>
              <button onClick={handleReset} style={{ ...btnBase, color: '#c07030' }}>RESET</button>
            </div>
          </Card>

          <Card title="TIER THRESHOLDS">
            {allTiers.map(tier => (
              <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.58rem', color: 'var(--color-bo-muted)', width: '36px' }}>T{tier}</span>
                <span style={{ fontSize: '0.58rem', color: 'var(--color-bo-text-dim)', width: '50px' }}>stat ≥</span>
                <input type="number" min={0} value={thresholds[tier] ?? 0} onChange={e => handleThresholdChange(tier, e.target.value)} style={{ ...inp, width: '70px' }} disabled={tier === 1} />
                {tier > 2 && <button onClick={() => handleRemoveTier(tier)} style={{ background: 'none', border: 'none', color: 'var(--color-bo-red)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>×</button>}
              </div>
            ))}
            <button onClick={handleAddTier} style={{ ...btnBase, width: '100%', textAlign: 'center', marginTop: '0.3rem' }}>+ ADD TIER</button>
          </Card>

          {/* ── Cheatsheet ── */}
          {treeNodes.length > 0 && (() => {
            const statSums = {}
            const tagCounts = {}
            const tierStatSums = {}
            for (const n of treeNodes) {
              const tier = n.tier ?? 1
              if (!tierStatSums[tier]) tierStatSums[tier] = {}
              if (n.type === 'stat') {
                for (const [stat, val] of Object.entries(n.statGrants ?? {})) {
                  const total = Number(val) * (n.maxPurchases ?? 1)
                  statSums[stat] = (statSums[stat] ?? 0) + total
                  tierStatSums[tier][stat] = (tierStatSums[tier][stat] ?? 0) + total
                }
              }
              for (const tag of (n.tags ?? [])) {
                tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
              }
            }
            const tiers = Object.keys(tierStatSums).map(Number).sort((a,b)=>a-b)
            return (
              <Card title="TREE CHEATSHEET">
                {tiers.map(tier => {
                  const sums = tierStatSums[tier]
                  const entries = Object.entries(sums)
                  if (entries.length === 0) return null
                  return (
                    <div key={tier} style={{ marginBottom: '0.6rem' }}>
                      <div style={{ fontSize: '0.48rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>TIER {tier} MAX STATS:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {entries.map(([stat, val]) => (
                          <span key={stat} style={{ fontSize: '0.6rem', color: '#60c080', background: 'rgba(60,200,100,0.08)', border: '1px solid rgba(60,200,100,0.2)', padding: '1px 5px' }}>+{val} {stat}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {Object.keys(tagCounts).length > 0 && (
                  <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid var(--color-bo-border)' }}>
                    <div style={{ fontSize: '0.48rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>TAGI:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {Object.entries(tagCounts).map(([tag, cnt]) => (
                        <span key={tag} style={{ fontSize: '0.58rem', color: 'var(--color-bo-text-dim)', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', padding: '1px 5px' }}>{tag}: {cnt}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })()}

          <Card title="NODES">
            <button onClick={handleAddNode} style={{ ...btnBase, width: '100%', marginBottom: '0.4rem', textAlign: 'center' }}>+ ADD NODE</button>
            {selectedId && (
              <>
                <Div />
                <div style={{ fontSize: '0.5rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>EDITING: {selectedId}</div>
                <F label="ID (edytowalne — zmiana aktualizuje też requires innych węzłów)">
                  <input
                    value={form.id}
                    onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                    style={{ ...inp, fontFamily: 'monospace', fontSize: '0.72rem', color: form.id !== selectedId ? '#d4a840' : 'var(--color-bo-text)' }}
                  />
                </F>
                <F label="TYPE">
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inp}>
                    <option value="stat">stat (circle)</option>
                    <option value="skill">skill (rect)</option>
                  </select>
                </F>
                <F label="LABEL"><input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} style={inp} /></F>
                <F label="KRÓTKI OPIS (zawsze widoczny)">
                  <textarea value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="Widoczny pod etykietą węzła" />
                </F>
                <F label="DŁUGI OPIS (po najechaniu, obsługuje 0.2x[Stat])">
                  <textarea value={form.longDescription} onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Pełny opis w tooltipie. Formuły: 0.2x[Strength]" />
                </F>
                {form.tags.split(',').map(t=>t.trim()).includes('passive') && (
                  <F label="NAZWA EFEKTU PASYWNEGO (opcjonalne, jeśli pusty → label)">
                    <input value={form.passiveName} onChange={e => setForm(f => ({ ...f, passiveName: e.target.value }))} style={inp} placeholder="np. Badacz, Forsowny Marsz..." />
                  </F>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.4rem' }}>
                  <F label="TIER">
                    <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: Number(e.target.value) }))} style={inp}>
                      {allTiers.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </F>
                  {form.type === 'stat' && (
                    <F label="MAX PURCHASES"><input type="number" min={1} max={10} value={form.maxPurchases} onChange={e => setForm(f => ({ ...f, maxPurchases: e.target.value }))} style={inp} /></F>
                  )}
                </div>
                {form.type === 'stat' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 55px', gap: '0 0.4rem' }}>
                    <F label="GRANTS STAT">
                      <select value={form.statGrantStat} onChange={e => setForm(f => ({ ...f, statGrantStat: e.target.value }))} style={inp}>
                        {ALL_STAT_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </F>
                    <F label="AMT"><input type="number" min={1} value={form.statGrantAmt} onChange={e => setForm(f => ({ ...f, statGrantAmt: e.target.value }))} style={inp} /></F>
                  </div>
                )}
                <F label="REQUIRES (node IDs, comma-sep)">
                  <input value={form.requires} onChange={e => setForm(f => ({ ...f, requires: e.target.value }))} style={inp} placeholder="str_s01, str_s02" />
                </F>
                {treeNodes.filter(n => n.id !== form.id).length > 0 && (() => {
                  // Filtruj po ostatnim segmencie (po ostatnim przecinku)
                  const segments = form.requires.split(',')
                  const lastSeg  = segments[segments.length - 1].trim().toLowerCase()
                  const filterQ  = lastSeg
                  const cur      = form.requires.split(',').map(s => s.trim()).filter(Boolean)
                  const filtered = treeNodes.filter(n => n.id !== form.id).filter(n =>
                    !filterQ || n.id.toLowerCase().includes(filterQ) || (n.label ?? '').toLowerCase().includes(filterQ)
                  )
                  return (
                    <div style={{ marginBottom: '0.4rem', padding: '0.35rem 0.4rem', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', maxHeight: '90px', overflowY: 'auto' }}>
                      <div style={{ fontSize: '0.44rem', color: 'var(--color-bo-muted)', marginBottom: '3px', letterSpacing: '0.1em' }}>
                        KLIKNIJ BY DODAĆ / USUNĄĆ{filterQ ? ` — filtr: "${filterQ}"` : ''}:
                      </div>
                      {filtered.length === 0 && (
                        <div style={{ fontSize: '0.52rem', color: 'var(--color-bo-muted)', fontStyle: 'italic' }}>brak wyników</div>
                      )}
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
                <F label="TAGI SPECJALNE">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                    {[['passive','Efekt Pasywny'],['admin_action','Wymaga Akcji Admina'],['sheer','Sheer'],['inner','Inner'],['external','External'],['hopeful','Hopeful']].map(([tag, lbl]) => {
                      const has = form.tags.split(',').map(t=>t.trim()).filter(Boolean).includes(tag)
                      return (
                        <button key={tag} type="button" onClick={() => {
                          const cur = form.tags.split(',').map(t=>t.trim()).filter(Boolean)
                          const next = has ? cur.filter(t=>t!==tag) : [...cur, tag]
                          setForm(f => ({ ...f, tags: next.join(', ') }))
                        }} style={{ background: has ? 'rgba(220,50,50,0.15)' : 'none', border: `1px solid ${has ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`, color: has ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', padding: '2px 7px', fontSize: '0.52rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          {lbl}
                        </button>
                      )
                    })}
                  </div>
                  <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={{ ...inp, fontSize: '0.65rem' }} placeholder="inne tagi oddzielone przecinkami" />
                </F>
                <F label="BLOCKS (JSON)"><textarea value={form.blocks} onChange={e => setForm(f => ({ ...f, blocks: e.target.value }))} rows={2} style={{ ...inp, resize: 'vertical', fontSize: '0.6rem' }} placeholder='[{"tree":"*","tags":["sheer"]}]' /></F>
                <F label='EXTRA TAG SLOTS (tagi po przecinku — "daj graczowi +1 slot na tę grupę")'>
                  <input value={form.extraTagSlots} onChange={e => setForm(f => ({ ...f, extraTagSlots: e.target.value }))} style={inp} placeholder="inner, external" />
                </F>
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem' }}>
                  <button onClick={() => { setSelectedId(null); setForm(defaultForm()) }} style={btnBase}>CANCEL</button>
                  <button onClick={handleDeleteNode} style={{ ...btnBase, color: 'var(--color-bo-red)' }}>DELETE</button>
                  <button onClick={handleSaveNode} disabled={!form.label.trim()} style={{ ...btnBase, flex: 1, background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', textAlign: 'center', opacity: !form.label.trim() ? 0.5 : 1 }}>APPLY CHANGES</button>
                </div>
              </>
            )}
            {!selectedId && <div style={{ fontSize: '0.58rem', color: 'var(--color-bo-muted)', textAlign: 'center', padding: '0.3rem 0' }}>Click a node to edit it</div>}
          </Card>

          <Card title={`ALL NODES (${treeNodes.length})`}>
            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {treeNodes.map(n => (
                <div key={n.id} onClick={() => onNodeClick(null, { id: n.id, data: {} })}
                  style={{ cursor: 'pointer', padding: '2px 4px', fontSize: '0.57rem', lineHeight: 1.8, color: n.id === selectedId ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', background: n.id === selectedId ? 'rgba(220,50,50,0.06)' : 'none', borderRadius: 2 }}>
                  <span style={{ color: 'var(--color-bo-muted)', marginRight: 6, fontSize: '0.5rem' }}>T{n.tier ?? 1}</span>{n.id}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Canvas */}
        <div>
          {/* Snap controls */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '0.4rem', alignItems: 'center' }}>
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
            <span style={{ marginLeft: '0.5rem', fontSize: '0.5rem', color: 'var(--color-bo-muted)' }}>
              Środek node'a snapuje do środka kratki (100×100px)
            </span>
          </div>

          <div style={{ height: '700px', background: '#0a0a0f', border: '1px solid var(--color-bo-border)' }}>
            <ReactFlow nodes={rfNodes} edges={rfEdges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
              onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick} onNodeDragStop={onNodeDragStop}
              nodesDraggable nodesConnectable={false}
              snapToGrid={snapToGrid} snapGrid={snapGrid}
              nodeOrigin={[0.5, 0.5]}
              fitView fitViewOptions={{ padding: 0.08 }} minZoom={0.2} maxZoom={2}
              proOptions={{ hideAttribution: true }}>
              <Background
                variant={BackgroundVariant.Lines}
                color="#1e1e2a"
                gap={GRID}
                lineWidth={1}
              />
              <Controls style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)' }} />
              <MiniMap nodeColor={n => n.type === 'sep' ? 'transparent' : n.data?.tier >= 2 ? '#4040a0' : '#3a3a5a'} maskColor="rgba(10,10,15,0.85)" style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)' }} />
            </ReactFlow>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.56rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>
            Drag nodes to reposition. Click to select &amp; edit. Save after changes.
            <span style={{ marginLeft: '0.75rem', color: '#6060a0' }}>Blue = Tier 2.</span>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
