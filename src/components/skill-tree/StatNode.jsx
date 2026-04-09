import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

const TREE_COLORS = {
  strength:  { stroke: '#e07030', purchasedFill: 'rgba(224,112,48,0.25)',  text: '#f0a070' },
  vitality:  { stroke: '#c03030', purchasedFill: 'rgba(192,48,48,0.25)',   text: '#e07070' },
  speed:     { stroke: '#30a050', purchasedFill: 'rgba(48,160,80,0.25)',   text: '#70d090' },
  defense:   { stroke: '#c0a020', purchasedFill: 'rgba(192,160,32,0.25)',  text: '#e8d060' },
  reiatsu:   { stroke: '#3060c0', purchasedFill: 'rgba(48,96,192,0.25)',   text: '#7090e0' },
  reiryoku:  { stroke: '#8030b0', purchasedFill: 'rgba(128,48,176,0.25)',  text: '#c070e0' },
  tamashi:   { stroke: '#b0b0b0', purchasedFill: 'rgba(176,176,176,0.20)', text: '#e0e0e0' },
  bukijutsu: { stroke: '#6060a0', purchasedFill: 'rgba(96,96,160,0.25)',   text: '#9090c8' },
  bujutsu:   { stroke: '#a07850', purchasedFill: 'rgba(160,120,80,0.25)',  text: '#d0a878' },
  nazo:      { stroke: '#dc3232', purchasedFill: 'rgba(220,50,50,0.25)',   text: '#e08080' },
}

const StatNode = memo(function StatNode({ data }) {
  const {
    label,
    maxPurchases = 1,
    currentPurchases = 0,
    state = 'locked',
    onUnlock,
    treeStat = '',
  } = data

  const radius = 38
  const cx = 50
  const cy = 50
  const SIZE = 100

  const treeC = TREE_COLORS[treeStat]

  const colors = {
    locked:          { stroke: '#2e2e3f', fill: '#111118', text: '#4a4a64' },
    available:       { stroke: '#6a6a8a', fill: '#1a1a2a', text: '#9090aa' },
    purchased:       { stroke: treeC?.stroke ?? '#dc3232', fill: '#111118', text: treeC?.text ?? '#e8e8f0' },
    revocable:       { stroke: '#dc6020', fill: '#1e0e04', text: '#e8c080' },
    admin_available: { stroke: '#4060a0', fill: '#0e1020', text: '#6080c0' },
    blocked:         { stroke: '#1e1e2a', fill: '#0a0a0f', text: '#2e2e3f' },
  }
  const c = colors[state] ?? colors.locked

  const purchasedFill = treeC?.purchasedFill ?? 'rgba(220,50,50,0.2)'

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

  const isClickable = state === 'available' || state === 'revocable' || state === 'admin_available' || state === 'purchased'
  const isRevocable  = state === 'revocable'
  const isAdminAvail = state === 'admin_available'

  const ringDash   = state === 'available' ? '4 2'
                   : state === 'admin_available' ? '2 3'
                   : 'none'
  const ringStroke = (state === 'purchased' || state === 'revocable') ? c.stroke
                   : state === 'available' ? '#6a6a8a'
                   : state === 'admin_available' ? '#4060a0'
                   : c.stroke
  const ringWidth  = (state === 'purchased' || state === 'revocable') ? 2 : 1

  const opacity = state === 'blocked' ? 0.3 : state === 'locked' ? 0.6 : 1

  return (
    <div
      onClick={isClickable ? onUnlock : undefined}
      style={{ width: SIZE, height: SIZE, cursor: isClickable ? 'pointer' : 'default', position: 'relative', opacity }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle cx={cx} cy={cy} r={radius} fill={c.fill} />

        {maxPurchases === 1 ? (
          <circle cx={cx} cy={cy} r={radius - 2}
            fill={currentPurchases >= 1 ? purchasedFill : 'none'}
            stroke={c.stroke} strokeWidth={currentPurchases >= 1 ? 2 : 1.5}
          />
        ) : (
          segments.map((seg, i) => (
            <path key={i} d={seg.path}
              fill={seg.purchased ? purchasedFill : c.fill}
              stroke={seg.purchased ? (treeC?.stroke ?? '#dc3232') : c.stroke}
              strokeWidth={seg.purchased ? 1.5 : 1}
            />
          ))
        )}

        <circle cx={cx} cy={cy} r={radius} fill="none"
          stroke={ringStroke} strokeWidth={ringWidth} strokeDasharray={ringDash}
        />

        {isRevocable && (
          <text x={cx + 14} y={cy - 18} fontSize={11} fill="#dc6020" fontFamily="sans-serif" opacity={0.85}>↩</text>
        )}
        {isAdminAvail && (
          <text x={cx + 13} y={cy - 18} fontSize={9} fill="#4060a0" fontFamily="sans-serif" opacity={0.75}>✦</text>
        )}

        <text x={cx} y={cy + 5} textAnchor="middle"
          fontSize={label.length > 5 ? 9 : 10}
          fontWeight={state === 'purchased' || state === 'revocable' ? 700 : 400}
          fill={c.text}
          fontFamily="'Rajdhani', sans-serif" letterSpacing="0.05em"
        >{label}</text>
      </svg>

      {(state === 'available' || state === 'admin_available') && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          boxShadow: state === 'admin_available'
            ? '0 0 10px rgba(64,96,160,0.4)'
            : '0 0 12px rgba(106,106,138,0.4)',
          pointerEvents: 'none',
        }} />
      )}

      {state === 'purchased' && treeC && (
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: `0 0 10px ${treeC.stroke}44`, pointerEvents: 'none' }} />
      )}

      <Handle type="target" position={Position.Top}    style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0, zIndex: -1 }} />
      <Handle type="source" position={Position.Bottom} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0, zIndex: -1 }} />
    </div>
  )
})

export default StatNode
