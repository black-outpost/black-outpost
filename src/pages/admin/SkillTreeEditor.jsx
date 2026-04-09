/**
 * SkillTreeEditor — Admin tool for editing Nazo skill trees per character.
 * Also shows all default trees in admin-free mode (unlock nodes for free).
 */
import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  collection, getDocs, doc, onSnapshot, updateDoc, setDoc, serverTimestamp, orderBy, query
} from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'
import {
  ReactFlow, Background, Controls, MiniMap, BaseEdge, getStraightPath,
  useNodesState, useEdgesState, addEdge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DEFAULT_SKILL_TREES, buildEdges } from '../../data/defaultSkillTrees'
import { applyUnlock, canUnlock } from '../../data/skillTreeLogic'
import { TIER_THRESHOLDS } from '../../data/statThresholds'

const inp = {
  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)', padding: '0.4rem 0.6rem',
  fontSize: '0.78rem', fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box',
}
const F = ({ label, children }) => (
  <div style={{ marginBottom: '0.55rem' }}>
    <label style={{ display: 'block', fontSize: '0.52rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.2rem' }}>{label}</label>
    {children}
  </div>
)

// ── Edge ──────────────────────────────────────────────────
function DashedEdge({ id, sourceX, sourceY, targetX, targetY, data, selected }) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const stroke = selected ? '#dc3232' : data?.purchased ? '#dc3232' : data?.available ? '#5a5a7a' : '#2e2e3f'
  return (
    <BaseEdge id={id} path={edgePath}
      style={{ stroke, strokeWidth: selected ? 2 : 1, strokeDasharray: '6 4', opacity: 0.8 }}
    />
  )
}

// ── Node renderers for editor ─────────────────────────────
import { Handle, Position } from '@xyflow/react'

function EditorStatNode({ data, selected }) {
  const { label, maxPurchases = 1, currentPurchases = 0, state = 'locked', onClick } = data
  const radius = 38; const cx = 50; const cy = 50; const SIZE = 100
  const c = {
    locked:    { stroke: '#2e2e3f', fill: '#111118', text: '#4a4a64' },
    available: { stroke: '#6a6a8a', fill: '#1a1a2a', text: '#9090aa' },
    purchased: { stroke: '#dc3232', fill: '#1e0a0a', text: '#e8e8f0' },
    blocked:   { stroke: '#1e1e2a', fill: '#0a0a0f', text: '#2e2e3f' },
  }[state] ?? { stroke: '#2e2e3f', fill: '#111118', text: '#4a4a64' }

  const segments = []
  if (maxPurchases === 1) {
    segments.push({ purchased: currentPurchases >= 1 })
  } else {
    const step = (2 * Math.PI) / maxPurchases
    for (let i = 0; i < maxPurchases; i++) {
      const a1 = -Math.PI / 2 + i * step
      const a2 = a1 + step - 0.08
      const x1 = cx + radius * Math.cos(a1); const y1 = cy + radius * Math.sin(a1)
      const x2 = cx + radius * Math.cos(a2); const y2 = cy + radius * Math.sin(a2)
      const la = step > Math.PI ? 1 : 0
      segments.push({ path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${la} 1 ${x2} ${y2} Z`, purchased: i < currentPurchases })
    }
  }

  return (
    <div onClick={onClick} style={{ width: SIZE, height: SIZE, cursor: 'pointer', position: 'relative', outline: selected ? '2px solid #dc3232' : 'none', borderRadius: '50%' }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle cx={cx} cy={cy} r={radius} fill={c.fill} />
        {maxPurchases === 1
          ? <circle cx={cx} cy={cy} r={radius - 2} fill={currentPurchases >= 1 ? 'rgba(220,50,50,0.2)' : 'none'} stroke={c.stroke} strokeWidth={currentPurchases >= 1 ? 2 : 1.5} />
          : segments.map((seg, i) => <path key={i} d={seg.path} fill={seg.purchased ? 'rgba(220,50,50,0.25)' : c.fill} stroke={seg.purchased ? '#dc3232' : c.stroke} strokeWidth={seg.purchased ? 1.5 : 1} />)
        }
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={selected ? '#dc3232' : c.stroke} strokeWidth={selected ? 2 : 1} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={label.length > 5 ? 9 : 10} fontWeight="600" fill={c.text} fontFamily="'Rajdhani', sans-serif" letterSpacing="0.05em">{label}</text>
      </svg>
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top}    style={{ opacity: 0 }} />
    </div>
  )
}

function EditorSkillNode({ data, selected }) {
  const { label, description = '', state = 'locked', onClick } = data
  const c = {
    locked:    '#4a4a64', available: '#c0c0d0', purchased: '#e8e8f0', blocked: '#2e2e3f',
  }[state] ?? '#4a4a64'
  const border = selected ? '#dc3232' : state === 'purchased' ? '#dc3232' : state === 'available' ? '#6a6a8a' : '#2e2e3f'
  return (
    <div onClick={onClick} style={{ width: 160, minHeight: 60, background: '#111118', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 10px', cursor: 'pointer' }}>
      {state === 'purchased' && <div style={{ fontSize: '0.5rem', color: '#dc3232', marginBottom: '2px', letterSpacing: '0.1em' }}>✓ UNLOCKED</div>}
      <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: c, lineHeight: 1.3, marginBottom: description ? '4px' : 0, fontFamily: "'Rajdhani', sans-serif" }}>{label}</div>
      {description && <div style={{ fontSize: '0.53rem', color: '#4a4a64', lineHeight: 1.45, fontFamily: "'Rajdhani', sans-serif" }}>{description.length > 90 ? description.slice(0, 87) + '…' : description}</div>}
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top}    style={{ opacity: 0 }} />
    </div>
  )
}

const nodeTypes = { stat: EditorStatNode, skill: EditorSkillNode }
const edgeTypes = { dashed: DashedEdge }

// ── Node state calc ───────────────────────────────────────
function getNodeState(node, treeStat, character) {
  const unlockedInTree = character?.unlockedNodes?.[treeStat] ?? {}
  const blockedInTree  = character?.blockedNodes?.[treeStat]  ?? []
  if (blockedInTree.includes(node.id)) return 'blocked'
  const threshold = TIER_THRESHOLDS[treeStat]?.[node.tier]
  if (threshold !== undefined && (character?.stats?.[treeStat] ?? 0) < threshold) return 'locked'
  const purchases = unlockedInTree[node.id] ?? 0
  if (node.type === 'stat'  && purchases >= (node.maxPurchases ?? 1)) return 'purchased'
  if (node.type === 'skill' && purchases > 0) return 'purchased'
  for (const reqId of (node.requires ?? [])) { if (!(unlockedInTree[reqId] > 0)) return 'locked' }
  return 'available'
}

// ── Nazo Tree Editor ──────────────────────────────────────
function NazoTreeEditor({ characters }) {
  const [selCharId, setSelCharId] = useState('')
  const [charDoc,   setCharDoc]   = useState(null)
  const [nazoTree,  setNazoTree]  = useState(null)   // { nodes, edges, ... }
  const [saving,    setSaving]    = useState(false)
  const [selNodeId, setSelNodeId] = useState(null)

  // Node form state
  const [nodeType, setNodeType]       = useState('stat')
  const [nodeLabel, setNodeLabel]     = useState('')
  const [nodeDesc, setNodeDesc]       = useState('')
  const [nodeTier, setNodeTier]       = useState(1)
  const [nodeMaxP, setNodeMaxP]       = useState(1)
  const [nodeStatG, setNodeStatG]     = useState('tamashi')
  const [nodeStatAmt, setNodeStatAmt] = useState(1)
  const [nodeReqs, setNodeReqs]       = useState('')

  // React Flow state
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([])
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([])

  // Load character
  useEffect(() => {
    if (!selCharId) return
    const unsub = onSnapshot(doc(db, 'characters', selCharId), snap => {
      if (snap.exists()) setCharDoc({ id: snap.id, ...snap.data() })
    })
    return unsub
  }, [selCharId])

  // Load nazo tree
  useEffect(() => {
    if (!selCharId) return
    const treeId = 'nazo_' + (characters.find(c => c.id === selCharId)?.identifier ?? selCharId)
    const unsub = onSnapshot(doc(db, 'skillTrees', treeId), snap => {
      if (snap.exists()) setNazoTree({ id: snap.id, ...snap.data() })
      else setNazoTree({ id: treeId, stat: 'nazo', isDefault: false, characterId: selCharId, nodes: [], edges: [] })
    })
    return unsub
  }, [selCharId])

  // Build React Flow nodes
  useEffect(() => {
    if (!nazoTree?.nodes) return
    const nodes = nazoTree.nodes.map(node => {
      const state = getNodeState(node, 'nazo', charDoc)
      return {
        id: node.id, type: node.type,
        position: node.position,
        selected: node.id === selNodeId,
        data: {
          label: node.label, description: node.description ?? '',
          maxPurchases: node.maxPurchases ?? 1,
          currentPurchases: charDoc?.unlockedNodes?.nazo?.[node.id] ?? 0,
          state,
          onClick: () => { setSelNodeId(node.id); loadNodeForm(node) },
        },
      }
    })
    const edges = (nazoTree.edges ?? []).map(e => ({
      id: e.id, source: e.source, target: e.target, type: 'dashed',
      data: { purchased: false, available: true },
    }))
    setRfNodes(nodes)
    setRfEdges(edges)
  }, [nazoTree, charDoc, selNodeId])

  function loadNodeForm(node) {
    setNodeType(node.type)
    setNodeLabel(node.label)
    setNodeDesc(node.description ?? '')
    setNodeTier(node.tier ?? 1)
    setNodeMaxP(node.maxPurchases ?? 1)
    setNodeStatG(Object.keys(node.statGrants ?? {})[0] ?? 'tamashi')
    setNodeStatAmt(Object.values(node.statGrants ?? {})[0] ?? 1)
    setNodeReqs((node.requires ?? []).join(', '))
  }

  function resetForm() {
    setSelNodeId(null)
    setNodeType('stat'); setNodeLabel(''); setNodeDesc('')
    setNodeTier(1); setNodeMaxP(1); setNodeStatG('tamashi'); setNodeStatAmt(1); setNodeReqs('')
  }

  async function saveTree(newNodes, newEdges) {
    if (!nazoTree?.id) return
    setSaving(true)
    try {
      await setDoc(doc(db, 'skillTrees', nazoTree.id), {
        ...nazoTree, nodes: newNodes, edges: newEdges, updatedAt: serverTimestamp(),
      })
    } finally { setSaving(false) }
  }

  function handleAddOrUpdateNode() {
    if (!nodeLabel.trim()) return
    const existingNode = nazoTree?.nodes?.find(n => n.id === selNodeId)
    const nodeId = selNodeId ?? `nazo_${Date.now()}`
    const newNode = {
      id: nodeId, type: nodeType, label: nodeLabel.trim(),
      description: nodeDesc.trim() || undefined,
      tier: nodeTier, maxPurchases: nodeType === 'stat' ? nodeMaxP : 1,
      statGrants: nodeType === 'stat' ? { [nodeStatG]: nodeStatAmt } : {},
      requires: nodeReqs.split(',').map(s => s.trim()).filter(Boolean),
      blocks: [], tags: [],
      position: existingNode?.position ?? { x: 200 + Math.random() * 400, y: 200 + Math.random() * 400 },
    }
    const newNodes = selNodeId
      ? nazoTree.nodes.map(n => n.id === selNodeId ? newNode : n)
      : [...(nazoTree?.nodes ?? []), newNode]
    const newEdges = buildEdges(newNodes)
    saveTree(newNodes, newEdges)
    resetForm()
  }

  function handleDeleteNode() {
    if (!selNodeId) return
    const newNodes = nazoTree.nodes.filter(n => n.id !== selNodeId)
    const newEdges = buildEdges(newNodes)
    saveTree(newNodes, newEdges)
    resetForm()
  }

  async function handleAdminUnlock(nodeId) {
    if (!charDoc || !nazoTree) return
    const check = canUnlock(nodeId, 'nazo', charDoc, nazoTree, false)
    if (!check.ok) { alert('Cannot unlock: ' + check.reason); return }
    await applyUnlock(nodeId, 'nazo', charDoc, { ...DEFAULT_SKILL_TREES, nazo: nazoTree }, true)
  }

  // Save positions after drag
  const onNodeDragStop = useCallback((_, __, nodes) => {
    const updNodes = (nazoTree?.nodes ?? []).map(n => {
      const rn = nodes.find(r => r.id === n.id)
      return rn ? { ...n, position: rn.position } : n
    })
    saveTree(updNodes, nazoTree?.edges ?? [])
  }, [nazoTree])

  const selectedChar = characters.find(c => c.id === selCharId)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', alignItems: 'start' }}>
      {/* Lewa — controls */}
      <div>
        <Card title="CHARACTER">
          <select value={selCharId} onChange={e => { setSelCharId(e.target.value); resetForm() }} style={{ ...inp }}>
            <option value="">— select character —</option>
            {characters.map(c => <option key={c.id} value={c.id}>{c.identifier}{c.alias ? ' · ' + c.alias : ''}</option>)}
          </select>
          {selectedChar && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.62rem', color: 'var(--color-bo-muted)', display: 'flex', gap: '0.75rem' }}>
              <span>Nazo stat: <b style={{ color: 'var(--color-bo-text)' }}>{charDoc?.stats?.nazo ?? 0}</b></span>
              <span>Unlocked: <b style={{ color: charDoc?.nazoUnlocked ? '#60c080' : 'var(--color-bo-red)' }}>{charDoc?.nazoUnlocked ? charDoc.nazoName ?? 'YES' : 'NO'}</b></span>
            </div>
          )}
        </Card>

        {selCharId && (
          <>
            {/* Unlock nazo */}
            {charDoc && !charDoc.nazoUnlocked && (
              <Card title="UNLOCK NAZO TREE">
                <F label="NAZO TREE NAME">
                  <input id="nazo-name-inp" style={inp} placeholder="e.g. Research, Void" />
                </F>
                <button onClick={async () => {
                  const name = document.getElementById('nazo-name-inp').value.trim()
                  if (!name) return
                  await updateDoc(doc(db, 'characters', selCharId), { nazoUnlocked: true, nazoName: name })
                }} style={{ width: '100%', background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.45rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  UNLOCK & REVEAL TREE
                </button>
              </Card>
            )}

            {/* Add / edit node */}
            <Card title={selNodeId ? '✎ EDIT NODE' : '+ ADD NODE'}>
              <F label="TYPE">
                <select value={nodeType} onChange={e => setNodeType(e.target.value)} style={inp}>
                  <option value="stat">stat (circle)</option>
                  <option value="skill">skill (rounded rect)</option>
                </select>
              </F>
              <F label="LABEL"><input value={nodeLabel} onChange={e => setNodeLabel(e.target.value)} style={inp} placeholder="+1 TSH / Skill Name" /></F>
              {nodeType === 'skill' && (
                <F label="DESCRIPTION"><textarea value={nodeDesc} onChange={e => setNodeDesc(e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} /></F>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.4rem' }}>
                <F label="TIER"><select value={nodeTier} onChange={e => setNodeTier(+e.target.value)} style={inp}><option value={1}>1</option><option value={2}>2</option></select></F>
                {nodeType === 'stat' && <F label="MAX PURCHASES"><input type="number" min={1} max={6} value={nodeMaxP} onChange={e => setNodeMaxP(+e.target.value)} style={inp} /></F>}
              </div>
              {nodeType === 'stat' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '0 0.4rem' }}>
                  <F label="GRANTS STAT">
                    <select value={nodeStatG} onChange={e => setNodeStatG(e.target.value)} style={inp}>
                      {['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </F>
                  <F label="AMT"><input type="number" min={1} value={nodeStatAmt} onChange={e => setNodeStatAmt(+e.target.value)} style={inp} /></F>
                </div>
              )}
              <F label="REQUIRES (node IDs, comma separated)">
                <input value={nodeReqs} onChange={e => setNodeReqs(e.target.value)} style={inp} placeholder="nazo_abc, nazo_def" />
              </F>
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem' }}>
                {selNodeId && <button onClick={handleDeleteNode} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.4rem 0.6rem', fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>DELETE</button>}
                {selNodeId && <button onClick={resetForm} style={{ background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-muted)', padding: '0.4rem 0.6rem', fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>CANCEL</button>}
                <button onClick={handleAddOrUpdateNode} disabled={!nodeLabel.trim()} style={{ flex: 1, background: 'rgba(220,50,50,0.1)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.4rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: !nodeLabel.trim() ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: !nodeLabel.trim() ? 0.5 : 1 }}>
                  {saving ? 'SAVING...' : selNodeId ? 'SAVE NODE' : 'ADD NODE'}
                </button>
              </div>
              {selNodeId && (
                <button onClick={() => handleAdminUnlock(selNodeId)} style={{ width: '100%', marginTop: '0.35rem', background: 'rgba(96,192,128,0.08)', border: '1px solid rgba(96,192,128,0.3)', color: '#60c080', padding: '0.4rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  ▶ GRANT SELECTED NODE TO PLAYER
                </button>
              )}
            </Card>

            <Card title="NODE IDs IN TREE">
              <div style={{ fontSize: '0.58rem', color: 'var(--color-bo-muted)', lineHeight: 2, maxHeight: '120px', overflow: 'auto' }}>
                {(nazoTree?.nodes ?? []).map(n => (
                  <div key={n.id} onClick={() => { setSelNodeId(n.id); loadNodeForm(n) }} style={{ cursor: 'pointer', color: n.id === selNodeId ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0 2px' }}>
                    {n.id}
                  </div>
                ))}
                {!nazoTree?.nodes?.length && <span>no nodes yet</span>}
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Prawa — canvas */}
      <div>
        {selCharId && nazoTree ? (
          <div style={{ height: '650px', background: '#0a0a0f', border: '1px solid var(--color-bo-border)' }}>
            <ReactFlow
              nodes={rfNodes}
              edges={rfEdges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeDragStop={onNodeDragStop}
              nodesDraggable={true}
              nodesConnectable={false}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              minZoom={0.3} maxZoom={2}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#1e1e2a" gap={40} size={1} />
              <Controls style={{ background: 'var(--color-bo-surface)', border: '1px solid var(--color-bo-border)' }} />
            </ReactFlow>
          </div>
        ) : (
          <div style={{ height: '650px', border: '1px dashed var(--color-bo-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bo-surface)' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)' }}>SELECT A CHARACTER TO EDIT THEIR NAZO TREE</span>
          </div>
        )}
        <div style={{ marginTop: '0.5rem', fontSize: '0.58rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>
          TIP: Click a node to select it and edit properties. Drag nodes to reposition. Connections auto-generate from "requires" field.
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function SkillTreeEditor() {
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    getDocs(query(collection(db, 'characters'), orderBy('identifier'))).then(snap =>
      setCharacters(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
  }, [])

  return (
    <PageShell title="SKILL TREE EDITOR" subtitle="NAZO TREE MANAGEMENT — CUSTOM NODES PER CHARACTER">
      <NazoTreeEditor characters={characters} />
    </PageShell>
  )
}
