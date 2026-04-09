/**
 * techMarkup.js
 *
 * Mini markup language for technique descriptions.
 *
 * Supported syntax:
 *   **text**          → bold
 *   {red|text}        → colored text
 *                       Colors: red, green, blue, gold, orange, cyan, dim, muted, white
 *                       or any CSS color/hex: {#ff6644|text}
 *   `0.2x[Tamashi]`   → formula auto-calculated from character stats
 *
 * Formula syntax (inline, no backticks needed):
 *   0.2x[StatName]   or  0.2 x [StatName]
 *   [StatName] x 2
 *   Multiple terms: 0.2x[Tamashi] + 0.2x[Reiatsu]
 *   The entire formula expression is detected and evaluated.
 */

// Stat key lookup — case-insensitive
const STAT_ALIASES = {
  strength:  'strength',  str:        'strength',
  vitality:  'vitality',  vit:        'vitality',
  speed:     'speed',     spd:        'speed',
  defense:   'defense',   def:        'defense',
  reiatsu:   'reiatsu',   rei:        'reiatsu',
  reiryoku:  'reiryoku',  ryo:        'reiryoku',
  bujutsu:   'bujutsu',   buj:        'bujutsu',   hakuda: 'bujutsu',
  bukijutsu: 'bukijutsu', buk:        'bukijutsu', zanjutsu: 'bukijutsu', kyudo: 'bukijutsu',
  tamashi:   'tamashi',   tam:        'tamashi',
  nazo:      'nazo',
}

function resolveStatKey(name) {
  return STAT_ALIASES[name.toLowerCase()] ?? name.toLowerCase()
}

const COLOR_MAP = {
  red:    'var(--color-bo-red)',
  green:  '#60c080',
  blue:   '#5090d0',
  gold:   '#d4a840',
  orange: '#e07840',
  cyan:   '#40c0c0',
  dim:    'var(--color-bo-text-dim)',
  muted:  'var(--color-bo-muted)',
  white:  'var(--color-bo-text)',
}

function resolveColor(c) {
  return COLOR_MAP[c.toLowerCase()] ?? c
}

// ─────────────────────────────────────────────
// Formula evaluation
// ─────────────────────────────────────────────

/**
 * Detect formula spans in a string.
 * A formula is any expression containing [StatName] references.
 * Returns array of { start, end, raw } for each formula found.
 */
function findFormulas(text) {
  // Match expressions: optional number + multiplier + [Stat] chains connected with +/-
  // e.g. "0.2x[Tamashi]+0.2x[Reiatsu]" or "[Speed]*2" or "2 x [Strength] + 50"
  const formulaRe = /(?:[\d.]+\s*[x*×]\s*)?\[[\w ]+\](?:\s*[+\-]\s*(?:[\d.]+\s*[x*×]\s*)?\[[\w ]+\])*(?:\s*[+\-]\s*[\d.]+)?/g
  const results = []
  let m
  while ((m = formulaRe.exec(text)) !== null) {
    results.push({ start: m.index, end: m.index + m[0].length, raw: m[0] })
  }
  return results
}

/**
 * Evaluate a formula like "0.2x[Tamashi]+0.2x[Reiatsu]"
 * Returns { value, breakdown } where breakdown is array of {coef, stat, statValue, part}
 */
export function evalFormula(raw, stats = {}) {
  const breakdown = []
  let value = 0

  // Parse terms: [coef x] [StatName] or number literals
  const termRe = /([\d.]+)\s*[x*×]\s*\[([\w ]+)\]|\[([\w ]+)\](?:\s*[x*×]\s*([\d.]+))?|([\d.]+)/g
  const cleaned = raw.replace(/\s+/g, ' ')
  let m

  while ((m = termRe.exec(cleaned)) !== null) {
    if (m[1] !== undefined && m[2] !== undefined) {
      // coef x [Stat]
      const coef = parseFloat(m[1])
      const key  = resolveStatKey(m[2])
      const sv   = stats[key] ?? 0
      const part = coef * sv
      breakdown.push({ coef, stat: m[2], statValue: sv, part })
      value += part
    } else if (m[3] !== undefined) {
      // [Stat] x coef  OR just [Stat]
      const coef = m[4] !== undefined ? parseFloat(m[4]) : 1
      const key  = resolveStatKey(m[3])
      const sv   = stats[key] ?? 0
      const part = coef * sv
      breakdown.push({ coef, stat: m[3], statValue: sv, part })
      value += part
    } else if (m[5] !== undefined) {
      // plain number
      const num = parseFloat(m[5])
      breakdown.push({ coef: null, stat: null, statValue: null, part: num })
      value += num
    }
  }

  return { value: Math.round(value * 100) / 100, breakdown }
}

/** Format breakdown for hover tooltip */
export function formulaTooltip(raw, stats) {
  const { value, breakdown } = evalFormula(raw, stats)
  const parts = breakdown.map(b => {
    if (b.stat === null) return String(b.part)
    if (b.coef === 1)   return `[${b.statValue} (${b.stat})]`
    return `[${b.coef}×${b.statValue} (${b.stat})]`
  })
  return parts.join(' + ') + ' = ' + value
}

// ─────────────────────────────────────────────
// Markup parser → React elements
// ─────────────────────────────────────────────

/**
 * Parse a single line of text into React-renderable segments.
 * Returns array of { text, bold, color, isFormula, formulaRaw, formulaResult }.
 */
export function parseSegments(text, stats = {}) {
  if (!text) return []
  const segments = []

  // We'll process the string left-to-right with a manual scanner
  let i = 0
  const len = text.length

  // Find all special spans in order: **bold**, {color|text}, [Stat] formulas
  // Build a sorted list of spans
  const spans = []

  // ** bold **
  const boldRe = /\*\*(.+?)\*\*/g
  let bm
  while ((bm = boldRe.exec(text)) !== null)
    spans.push({ start: bm.index, end: bm.index + bm[0].length, type: 'bold', content: bm[1] })

  // {color|text}
  const colorRe = /\{([^|{}]+)\|([^}]+)\}/g
  let cm
  while ((cm = colorRe.exec(text)) !== null)
    spans.push({ start: cm.index, end: cm.index + cm[0].length, type: 'color', color: cm[1].trim(), content: cm[2] })

  // formulas
  const formulas = findFormulas(text)
  for (const f of formulas) {
    // Make sure it's not inside a bold/color span
    const overlaps = spans.some(s => f.start < s.end && f.end > s.start)
    if (!overlaps) spans.push({ start: f.start, end: f.end, type: 'formula', raw: f.raw })
  }

  // Sort by start position
  spans.sort((a, b) => a.start - b.start)

  // Remove overlapping spans (keep first)
  const clean = []
  let lastEnd = 0
  for (const s of spans) {
    if (s.start >= lastEnd) { clean.push(s); lastEnd = s.end }
  }

  // Emit segments
  i = 0
  for (const span of clean) {
    if (i < span.start) segments.push({ text: text.slice(i, span.start) })
    if (span.type === 'bold')    segments.push({ text: span.content, bold: true })
    if (span.type === 'color')   segments.push({ text: span.content, color: resolveColor(span.color) })
    if (span.type === 'formula') {
      const { value, breakdown } = evalFormula(span.raw, stats)
      segments.push({ isFormula: true, formulaRaw: span.raw, value, breakdown })
    }
    i = span.end
  }
  if (i < len) segments.push({ text: text.slice(i) })

  return segments
}

/**
 * Parse full multi-line text — returns array of lines,
 * each line is array of segments.
 */
export function parseMarkup(text, stats = {}) {
  if (!text) return []
  return text.split('\n').map(line => parseSegments(line, stats))
}
