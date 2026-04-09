import { useState } from 'react'
import { parseMarkup, formulaTooltip } from '../../data/techMarkup'

/* Pojedynczy segment z opcjonalnym tooltipem formuły */
function FormulaSegment({ seg, stats }) {
  const [hover, setHover] = useState(false)

  const tip = formulaTooltip(seg.formulaRaw, stats)

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{
        color: '#d4a840',
        fontWeight: 700,
        borderBottom: '1px dashed rgba(212,168,64,0.5)',
        cursor: 'help',
        fontFamily: 'var(--font-body)',
      }}>
        {seg.value}
      </span>
      {hover && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: '#0a0a0f', border: '1px solid var(--color-bo-border)',
          padding: '0.4rem 0.65rem', zIndex: 100, whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.7)', pointerEvents: 'none',
          fontSize: '0.65rem', color: 'var(--color-bo-text-dim)', lineHeight: 1.7,
        }}>
          <span style={{ color: 'var(--color-bo-muted)', fontSize: '0.58rem', display: 'block', marginBottom: '2px', letterSpacing: '0.1em' }}>FORMULA</span>
          <span style={{ color: 'var(--color-bo-text-dim)', fontFamily: 'var(--font-body)' }}>{tip}</span>
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '4px solid transparent', borderTopColor: 'var(--color-bo-border)' }} />
        </div>
      )}
    </span>
  )
}

/* Renderuje jedną linię segmentów */
function SegmentLine({ segments, stats, style }) {
  if (segments.length === 0) return <span>&nbsp;</span>

  return (
    <span style={style}>
      {segments.map((seg, i) => {
        if (seg.isFormula) return <FormulaSegment key={i} seg={seg} stats={stats} />
        if (seg.bold)   return <strong key={i}>{seg.text}</strong>
        if (seg.color)  return <span key={i} style={{ color: seg.color }}>{seg.text}</span>
        return <span key={i}>{seg.text}</span>
      })}
    </span>
  )
}

/**
 * TechMarkupRenderer
 * Renders multi-line markup text (description or technicalDetails).
 *
 * For technicalDetails: detects lines that look like stat/formula lines
 * and applies the sidebar-accent style.
 */
export default function TechMarkupRenderer({ text, stats = {}, isTechDetails = false }) {
  if (!text) return null

  const lines = parseMarkup(text, stats)

  if (!isTechDetails) {
    // Plain description — paragraphs, just line breaks
    return (
      <p style={{ fontSize: '0.78rem', lineHeight: 1.8, color: 'var(--color-bo-text)', margin: 0 }}>
        {lines.map((segs, i) => (
          <span key={i}>
            {segs.length === 0
              ? <br />
              : <SegmentLine segments={segs} stats={stats} />
            }
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    )
  }

  // Technical details — per-line analysis
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      {lines.map((segs, i) => {
        const rawLine = text.split('\n')[i] ?? ''
        const trimmed = rawLine.trim()

        if (!trimmed) return <div key={i} style={{ height: '0.4rem' }} />

        // Header line: ends with ':'
        const isHeader = trimmed.endsWith(':')
        // Stat/formula line: contains : or × or [ or =
        const isStat   = !isHeader && /[:×\[\]=]/.test(trimmed)

        const lineStyle = {
          fontSize: isHeader ? '0.58rem' : '0.72rem',
          letterSpacing: isHeader ? '0.14em' : '0',
          color: isHeader ? 'var(--color-bo-muted)' : 'var(--color-bo-text)',
          fontWeight: isHeader ? 600 : 400,
          lineHeight: 1.65,
          paddingLeft: isStat ? '0.75rem' : '0',
          borderLeft: isStat ? '2px solid var(--color-bo-red-dim)' : 'none',
          paddingTop: isHeader && i > 0 ? '0.25rem' : '0',
        }

        return (
          <div key={i} style={lineStyle}>
            <SegmentLine segments={segs} stats={stats} />
          </div>
        )
      })}
    </div>
  )
}
