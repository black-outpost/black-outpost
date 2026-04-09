/**
 * techMarkup.js — Mini markup language for technique descriptions.
 *
 * Supported syntax:
 *   **text**              → bold
 *   {red|text}            → colored text (red/green/blue/gold/orange/cyan/dim/muted/white or hex)
 *   0.4x[Bukijutsu]       → formula auto-calculated from character stats
 *
 * Formula syntax supports full math:
 *   0.4x[Bukijutsu]+0.2x[Reiatsu]
 *   (1x[Strength]+0.5x[Speed])x1.25
 *   (1x[Strength]+0.5x[Speed])/2
 *   [Strength]*2+50
 *   NUMx[Stat], [Stat]xNUM, [Stat]*NUM, [Stat]/NUM — all supported
 */

// ── Stat aliases ─────────────────────────────────────────────────────────────

const STAT_ALIASES = {
  strength: 'strength', str: 'strength',
  vitality: 'vitality', vit: 'vitality',
  speed:    'speed',    spd: 'speed',
  defense:  'defense',  def: 'defense',
  reiatsu:  'reiatsu',  rei: 'reiatsu',
  reiryoku: 'reiryoku', ryo: 'reiryoku',
  bujutsu:  'bujutsu',  buj: 'bujutsu', hakuda: 'bujutsu',
  bukijutsu:'bukijutsu',buk: 'bukijutsu',zanjutsu:'bukijutsu',kyudo:'bukijutsu',
  tamashi:  'tamashi',  tam: 'tamashi', zanpakuto:'tamashi', 'zanpakuto mastery':'tamashi',
  'blood mastery':'reiatsu', 'fullbring mastery':'tamashi',
  nazo: 'nazo',
}

function resolveStatKey(name) {
  const lower = name.toLowerCase().trim()
  return STAT_ALIASES[lower] ?? lower
}

const COLOR_MAP = {
  red: 'var(--color-bo-red)', green: '#60c080', blue: '#5090d0',
  gold: '#d4a840', orange: '#e07840', cyan: '#40c0c0',
  dim: 'var(--color-bo-text-dim)', muted: 'var(--color-bo-muted)', white: 'var(--color-bo-text)',
}
function resolveColor(c) { return COLOR_MAP[c.toLowerCase()] ?? c }

// ── Math expression tokenizer and evaluator ───────────────────────────────────

function tokenizeExpr(str) {
  const tokens = []
  let i = 0
  while (i < str.length) {
    const ch = str[i]
    if (ch === ' ' || ch === '\t') { i++; continue }
    if ('+-*/()'.includes(ch)) { tokens.push({ type: 'op', val: ch }); i++; continue }
    if (/\d/.test(ch) || (ch === '.' && /\d/.test(str[i + 1] ?? ''))) {
      let num = ''
      while (i < str.length && /[\d.]/.test(str[i])) num += str[i++]
      tokens.push({ type: 'num', val: parseFloat(num) })
      continue
    }
    i++ // skip unknown chars
  }
  return tokens
}

/**
 * Safely evaluate a math expression string (no stat refs — those are pre-substituted).
 * Supports: +, -, *, /, (), unary minus, floats.
 */
function evalMathExpr(str) {
  const tokens = tokenizeExpr(str)
  let pos = 0

  function peek() { return tokens[pos] ?? null }
  function consume() { return tokens[pos++] ?? null }

  function parseExpr() { return parseAddSub() }

  function parseAddSub() {
    let left = parseMulDiv()
    while (pos < tokens.length) {
      const t = peek()
      if (t?.type === 'op' && (t.val === '+' || t.val === '-')) {
        consume()
        const right = parseMulDiv()
        left = t.val === '+' ? left + right : left - right
      } else break
    }
    return left
  }

  function parseMulDiv() {
    let left = parseUnary()
    while (pos < tokens.length) {
      const t = peek()
      if (t?.type === 'op' && (t.val === '*' || t.val === '/')) {
        consume()
        const right = parseUnary()
        left = t.val === '*' ? left * right : (right !== 0 ? left / right : 0)
      } else break
    }
    return left
  }

  function parseUnary() {
    const t = peek()
    if (t?.type === 'op' && t.val === '-') { consume(); return -parsePrimary() }
    if (t?.type === 'op' && t.val === '+') { consume(); return parsePrimary() }
    return parsePrimary()
  }

  function parsePrimary() {
    const t = peek()
    if (!t) return 0
    if (t.type === 'op' && t.val === '(') {
      consume() // '('
      const val = parseExpr()
      if (peek()?.val === ')') consume() // ')'
      return val
    }
    if (t.type === 'num') { consume(); return t.val }
    consume(); return 0
  }

  try {
    const result = parseExpr()
    return isNaN(result) || !isFinite(result) ? 0 : result
  } catch { return 0 }
}

// ── Formula substitution and evaluation ──────────────────────────────────────

/**
 * Given a raw formula string like "0.4x[Bukijutsu]+0.2x[Reiatsu]" or
 * "(1x[Strength]+0.5x[Speed])x1.25", substitute stat references with
 * their numeric values and evaluate the resulting math expression.
 *
 * Returns { value: number, breakdown: [{label, val}] }
 */
export function evalFormula(raw, stats = {}) {
  const breakdown = []
  let expr = raw.trim()

  // --- Step 1: Replace NUMx[Stat] and NUMx[Stat] variants ---
  // Pattern: number (x|X|×|*) [StatName]
  expr = expr.replace(/([\d.]+)\s*[xX×*]\s*\[([^\]]+)\]/g, (_, coef, statName) => {
    const key = resolveStatKey(statName)
    const sv = stats[key] ?? 0
    const c = parseFloat(coef)
    breakdown.push({ label: `${c}×${statName}`, val: c * sv })
    return `(${c}*${sv})`
  })

  // --- Step 2: Replace [Stat]x/*/NUM variants ---
  expr = expr.replace(/\[([^\]]+)\]\s*[xX×*]\s*([\d.]+)/g, (_, statName, coef) => {
    const key = resolveStatKey(statName)
    const sv = stats[key] ?? 0
    const c = parseFloat(coef)
    // avoid double-counting if already replaced
    breakdown.push({ label: `${statName}×${c}`, val: sv * c })
    return `(${sv}*${c})`
  })

  // --- Step 3: Replace bare [Stat] references ---
  expr = expr.replace(/\[([^\]]+)\]/g, (_, statName) => {
    const key = resolveStatKey(statName)
    const sv = stats[key] ?? 0
    breakdown.push({ label: statName, val: sv })
    return String(sv)
  })

  // --- Step 4: Replace remaining x/× between numbers/parens as * ---
  expr = expr.replace(/([)\d])\s*[xX×]\s*([(0-9])/g, '$1*$2')

  // --- Step 5: Evaluate ---
  const value = evalMathExpr(expr)

  return { value, breakdown }
}

/** Short tooltip string: "0.4×Kyudo[13] + 0.2×Reiatsu[29] = 11" */
export function formulaTooltip(raw, stats) {
  // Rebuild breakdown step by step
  const parts = []
  let expr = raw.trim()

  // Step 1: NUMx[Stat]
  expr = expr.replace(/([\d.]+)\s*[xX×*]\s*\[([^\]]+)\]/g, (_, coef, statName) => {
    const key = resolveStatKey(statName)
    const sv = stats[key] ?? 0
    const c = parseFloat(coef)
    parts.push(`${c}×${statName}[${sv}]`)
    return `(${c}*${sv})`
  })

  // Step 2: [Stat]xNUM
  expr = expr.replace(/\[([^\]]+)\]\s*[xX×*]\s*([\d.]+)/g, (_, statName, coef) => {
    const key = resolveStatKey(statName)
    const sv = stats[key] ?? 0
    const c = parseFloat(coef)
    parts.push(`${statName}[${sv}]×${c}`)
    return `(${sv}*${c})`
  })

  // Step 3: bare [Stat]
  expr = expr.replace(/\[([^\]]+)\]/g, (_, statName) => {
    const key = resolveStatKey(statName)
    const sv = stats[key] ?? 0
    parts.push(`${statName}[${sv}]`)
    return String(sv)
  })

  expr = expr.replace(/([)\d])\s*[xX×]\s*([(0-9])/g, '$1*$2')
  const value = evalMathExpr(expr)

  const precise = Number.isInteger(value) ? String(value) : value.toFixed(4).replace(/\.?0+$/, '')
  const displayed = Math.floor(value)

  if (parts.length === 0) return `= ${displayed}`
  return parts.join(' + ') + ` = ${displayed}${displayed !== value ? ` (${precise})` : ''}`
}

// ── Formula detection in text ─────────────────────────────────────────────────

/**
 * Detect formula spans in text — any expression containing [Stat] references.
 * Handles: 0.4x[Stat]+0.2x[Stat], (expr)xN, (expr)/N, etc.
 */
function findFormulas(text) {
  const results = []

  // Find all [StatName] positions first
  const statRe = /\[[^\]]{1,30}\]/g
  let m

  while ((m = statRe.exec(text)) !== null) {
    // Check if this is actually a stat name
    const inner = m[0].slice(1, -1).trim()
    if (!resolveStatKey(inner) && !(inner.toLowerCase() in STAT_ALIASES)) {
      // Only skip if truly unrecognized AND contains spaces (likely not a stat)
      if (inner.includes(' ') && !STAT_ALIASES[inner.toLowerCase()]) continue
    }

    let start = m.index
    let end = m.index + m[0].length

    // Expand left: eat math chars — digits, ., operators, x/×/*, spaces, open parens
    // But stop at non-math chars (letters other than x, commas, colons, etc.)
    while (start > 0) {
      const ch = text[start - 1]
      if (/[\d.\s]/.test(ch)) { start--; continue }
      if ('xX×*+-/'.includes(ch)) { start--; continue }
      if (ch === '(') {
        // Include the opening paren only if it seems to start a grouped formula
        // Look further left — if preceded by math or start of string, include it
        const before = start >= 2 ? text[start - 2] : ' '
        if (/[\s+\-*\/x×(]/.test(before) || start === 1) { start--; continue }
      }
      break
    }

    // Expand right: eat math chars including [Stat] refs, operators, closing parens, trailing xN
    while (end < text.length) {
      const ch = text[end]
      if (/[\d.\s]/.test(ch)) { end++; continue }
      if ('xX×*+-/'.includes(ch)) { end++; continue }
      if (ch === '[') { end++; continue } // start of another [Stat]
      if (ch === ']') { end++; continue } // end of [Stat]
      if (/[a-zA-Z]/.test(ch)) {
        // Could be part of stat name inside [], or 'x' multiplier
        // Keep going only if inside brackets or immediately after a number (for stat names)
        end++; continue
      }
      if (ch === ')') { end++; continue }
      break
    }

    // Trim trailing non-math chars from both sides
    let raw = text.slice(start, end).trim()
    // Remove trailing standalone operators
    raw = raw.replace(/[+\-*/xX×\s]+$/, '').trim()
    // Remove leading standalone operators (except minus for unary)
    raw = raw.replace(/^[+*/xX×\s]+/, '').trim()

    if (raw.length > 0 && /\[[^\]]+\]/.test(raw)) {
      results.push({ start: text.indexOf(raw, start), end: text.indexOf(raw, start) + raw.length, raw })
    }
  }

  // Merge overlapping spans (keep merged raw)
  results.sort((a, b) => a.start - b.start)
  const merged = []
  for (const r of results) {
    if (merged.length > 0 && r.start <= merged[merged.length - 1].end) {
      const prev = merged[merged.length - 1]
      prev.end = Math.max(prev.end, r.end)
      prev.raw = text.slice(prev.start, prev.end).trim()
    } else {
      merged.push({ ...r })
    }
  }

  return merged
}

// ── Markup parser → segments ──────────────────────────────────────────────────

export function parseSegments(text, stats = {}) {
  if (!text) return []
  const segments = []
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

  // Formulas
  const formulas = findFormulas(text)
  for (const f of formulas) {
    const overlaps = spans.some(s => f.start < s.end && f.end > s.start)
    if (!overlaps) spans.push({ start: f.start, end: f.end, type: 'formula', raw: f.raw })
  }

  spans.sort((a, b) => a.start - b.start)

  // Remove overlapping (keep first)
  const clean = []
  let lastEnd = 0
  for (const s of spans) {
    if (s.start >= lastEnd) { clean.push(s); lastEnd = s.end }
  }

  let i = 0
  for (const span of clean) {
    if (i < span.start) segments.push({ text: text.slice(i, span.start) })
    if (span.type === 'bold')    segments.push({ text: span.content, bold: true })
    if (span.type === 'color')   segments.push({ text: span.content, color: resolveColor(span.color) })
    if (span.type === 'formula') {
      const { value } = evalFormula(span.raw, stats)
      segments.push({ isFormula: true, formulaRaw: span.raw, value: Math.floor(value) })
    }
    i = span.end
  }
  if (i < text.length) segments.push({ text: text.slice(i) })

  return segments
}

export function parseMarkup(text, stats = {}) {
  if (!text) return []
  return text.split('\n').map(line => parseSegments(line, stats))
}
