/**
 * Oblicza HP i RP postaci na podstawie formuły (np. "1x[Vitality]").
 * Domyślne formuły: HP = 1x[Vitality], RP = 1x[Reiatsu]
 * Formuły obsługują: 1x[Stat], 2.5x[Stat], 0x[Stat]+500, etc.
 */

const STAT_ALIASES = {
  strength: 'Strength', vitality: 'Vitality', speed: 'Speed', defense: 'Defense',
  reiatsu: 'Reiatsu', reiryoku: 'Reiryoku', bujutsu: 'Bujutsu', bukijutsu: 'Bukijutsu',
  tamashi: 'Tamashi', nazo: 'Nazo',
}

export const DEFAULT_HP_FORMULA = '1x[Vitality]'
export const DEFAULT_RP_FORMULA = '1x[Reiatsu]'

/**
 * Parsuje formułę "1.5x[Vitality]+0.5x[Strength]+100" i oblicza wartość.
 * Zwraca liczbę całkowitą.
 */
export function calcFromFormula(formula, effectiveStats) {
  if (!formula) return 0
  try {
    let result = 0
    // Tokeny: Nx[Stat] lub liczba
    const tokens = formula.split(/([+\-])/).map(t => t.trim()).filter(Boolean)
    let sign = 1
    for (const tok of tokens) {
      if (tok === '+') { sign = 1; continue }
      if (tok === '-') { sign = -1; continue }
      const statMatch = tok.match(/^([\d.]+)x\[(\w+)\]$/i)
      if (statMatch) {
        const factor = parseFloat(statMatch[1])
        const statName = statMatch[2].toLowerCase()
        const statVal = effectiveStats[statName] ?? 0
        result += sign * factor * statVal
      } else {
        const num = parseFloat(tok)
        if (!isNaN(num)) result += sign * num
      }
      sign = 1
    }
    return Math.round(result)
  } catch {
    return 0
  }
}

export function calcHP(character, effectiveStats) {
  return calcFromFormula(character.hpFormula || DEFAULT_HP_FORMULA, effectiveStats)
}

export function calcRP(character, effectiveStats) {
  return calcFromFormula(character.rpFormula || DEFAULT_RP_FORMULA, effectiveStats)
}
