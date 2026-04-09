import { memo, useState, useRef } from 'react'
import { Handle, Position } from '@xyflow/react'
import { parseSegments } from '../../data/techMarkup'

// Skrót: pierwsze zdanie lub max N znaków
function getSnippet(text, maxLen = 72) {
  if (!text) return ''
  const dot = text.search(/[.!?](\s|$)/)
  const cut  = dot !== -1 && dot + 1 <= maxLen ? dot + 1 : Math.min(text.length, maxLen)
  const s    = text.slice(0, cut).trimEnd()
  return s.length < text.length ? s + '…' : s
}

// Prosty renderer z obsługą formuł
function FormulaText({ text, stats, style }) {
  if (!text) return null
  const segments = parseSegments(text, stats ?? {})
  return (
    <span style={style}>
      {segments.map((seg, i) => {
        if (seg.isFormula) {
          return (
            <span key={i} style={{ color: '#80c0e0', fontWeight: 600, cursor: 'help', borderBottom: '1px dotted #80c0e0' }}
              title={`Formuła: ${seg.formulaRaw}\nWynik: ${seg.value}`}>
              {seg.value}
            </span>
          )
        }
        return <span key={i}>{seg.text}</span>
      })}
    </span>
  )
}

const TREE_COLORS = {
  strength:  { stroke: '#e07030', bg: 'rgba(224,112,48,0.06)',  title: '#f0a070' },
  vitality:  { stroke: '#c03030', bg: 'rgba(192,48,48,0.06)',   title: '#e07070' },
  speed:     { stroke: '#30a050', bg: 'rgba(48,160,80,0.06)',   title: '#70d090' },
  defense:   { stroke: '#c0a020', bg: 'rgba(192,160,32,0.06)',  title: '#e8d060' },
  reiatsu:   { stroke: '#3060c0', bg: 'rgba(48,96,192,0.06)',   title: '#7090e0' },
  reiryoku:  { stroke: '#8030b0', bg: 'rgba(128,48,176,0.06)',  title: '#c070e0' },
  tamashi:   { stroke: '#b0b0b0', bg: 'rgba(176,176,176,0.05)', title: '#e0e0e0' },
  bukijutsu: { stroke: '#6060a0', bg: 'rgba(96,96,160,0.06)',   title: '#9090c8' },
  bujutsu:   { stroke: '#a07850', bg: 'rgba(160,120,80,0.06)',  title: '#d0a878' },
  nazo:      { stroke: '#dc3232', bg: 'rgba(220,50,50,0.06)',   title: '#e08080' },
}

const SkillNode = memo(function SkillNode({ data }) {
  const {
    label,
    shortDescription = '',
    longDescription  = '',
    description      = '',
    state = 'locked',
    onUnlock,
    effectiveStats = {},
    treeStat = '',
  } = data
  const [hover,    setHover]    = useState(false)
  const [tipHover, setTipHover] = useState(false)
  const cardTimer = useRef(null)
  const tipTimer  = useRef(null)

  // Określ co wyświetlić jako krótki i długi opis
  const shortText = shortDescription || description
  const longText  = longDescription || (description.length > shortText.length ? description : '')
  const showTooltip = (hover || tipHover) && longText && longText !== shortText

  const treeC = TREE_COLORS[treeStat]
  const colors = {
    locked:          { border: '#2e2e3f', bg: '#111118', text: '#4a4a64',   title: '#4a4a64' },
    available:       { border: '#6a6a8a', bg: '#14141e', text: '#8080a0',   title: '#c0c0d0' },
    purchased:       { border: treeC?.stroke ?? '#dc3232', bg: treeC?.bg ?? '#1e0a0a', text: '#9090aa', title: treeC?.title ?? '#e8e8f0' },
    revocable:       { border: '#dc6020', bg: '#1e0e04', text: '#c09050',   title: '#e8c080' },
    admin_available: { border: '#4060a0', bg: '#0e1020', text: '#6080b0',   title: '#80a0d0' },
    blocked:         { border: '#1a1a24', bg: '#0a0a0f', text: '#1e1e2a',   title: '#1e1e2a' },
  }
  const c = colors[state] ?? colors.locked
  const isClickable = ['available','revocable','admin_available','purchased'].includes(state)

  return (
    <div
      onClick={isClickable ? onUnlock : undefined}
      onMouseEnter={() => { clearTimeout(cardTimer.current); setHover(true) }}
      onMouseLeave={() => { cardTimer.current = setTimeout(() => setHover(false), 100) }}
      style={{
        width: 160, minHeight: 60,
        background: c.bg, border: `1px solid ${c.border}`, borderRadius: '8px',
        padding: '8px 10px',
        cursor: isClickable ? 'pointer' : 'default',
        opacity: state === 'blocked' ? 0.3 : 1,
        boxShadow: state === 'purchased' || state === 'revocable'
          ? `0 0 10px ${state === 'revocable' ? 'rgba(220,96,32,0.2)' : 'rgba(220,50,50,0.2)'}`
          : (state === 'available' || state === 'admin_available') && hover
          ? `0 0 14px ${state === 'admin_available' ? 'rgba(64,96,160,0.35)' : 'rgba(106,106,138,0.35)'}`
          : 'none',
        transition: 'box-shadow 0.15s',
        position: 'relative',
      }}
    >
      {state === 'purchased'       && <div style={{ position: 'absolute', top: 4, right: 6, fontSize: '0.5rem', color: '#dc3232' }}>✓</div>}
      {state === 'revocable'       && <div style={{ position: 'absolute', top: 3, right: 5, fontSize: '0.65rem', color: '#dc6020' }}>↩</div>}
      {state === 'admin_available' && <div style={{ position: 'absolute', top: 4, right: 6, fontSize: '0.45rem', color: '#4060a0' }}>✦ADM</div>}

      <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: c.title, lineHeight: 1.3, marginBottom: shortText ? '4px' : 0, fontFamily: "'Rajdhani', sans-serif", paddingRight: 18 }}>
        {label}
      </div>

      {shortText && (
        <div style={{ fontSize: '0.55rem', color: c.text, lineHeight: 1.5, fontFamily: "'Rajdhani', sans-serif" }}>
          <FormulaText text={shortText} stats={effectiveStats} />
        </div>
      )}

      {/* Tooltip z pełnym opisem + formuły */}
      {showTooltip && (
        <div
          onMouseEnter={() => { clearTimeout(cardTimer.current); clearTimeout(tipTimer.current); setTipHover(true) }}
          onMouseLeave={() => { tipTimer.current = setTimeout(() => setTipHover(false), 100) }}
          style={{
            position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
            transform: 'translateX(-50%)', zIndex: 9999, width: 260,
            background: '#0e0e18', border: `1px solid ${c.border}`,
            borderRadius: '6px', padding: '10px 12px',
            pointerEvents: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.75)',
          }}>
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `6px solid ${c.border}` }} />
          <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', color: c.title, fontFamily: "'Rajdhani', sans-serif", marginBottom: '6px' }}>{label}</div>
          <div style={{ fontSize: '0.56rem', color: '#a0a0c0', lineHeight: 1.65, fontFamily: "'Rajdhani', sans-serif", whiteSpace: 'pre-wrap' }}>
            <FormulaText text={longText} stats={effectiveStats} />
          </div>
        </div>
      )}

      <Handle type="target" position={Position.Top}    style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0, zIndex: -1 }} />
      <Handle type="source" position={Position.Bottom} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0, zIndex: -1 }} />
    </div>
  )
})

export default SkillNode
