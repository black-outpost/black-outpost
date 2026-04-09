/**
 * Oblicza efektywne statystyki postaci uwzględniając:
 * 1. Base stats (character.stats)
 * 2. Flat bonusy z założonych itemów
 * 3. Procenty z założonych itemów + nadane przez admina statMultipliers
 *    (flat bonusy wchodzą pierwsze, potem % mnożniki)
 * 
 * Wzór: final = (base + sum_flat) * (1 + sum_all_percent / 100)
 */

const STAT_KEYS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']

/**
 * @param {object} character - dokument postaci z Firestore
 * @param {Array}  items     - lista itemów z subcollection characters/{id}/items
 * @returns {object} { effective: {stat: value}, breakdown: {stat: {base, flat, percent, final, sources}} }
 */
export function calcEffectiveStats(character, items = []) {
  const base    = character.stats ?? {}
  const multipliers = character.statMultipliers ?? [] // [{id, stat, percent, source}]

  const effective  = {}
  const breakdown  = {}

  for (const stat of STAT_KEYS) {
    const baseVal = base[stat] ?? 0

    // Zbierz flat bonusy z założonych itemów
    const flatSources = []
    let totalFlat = 0
    for (const item of items) {
      if (!item.equipped) continue
      for (const bonus of (item.statBonuses ?? [])) {
        if (bonus.stat === stat && bonus.flat) {
          totalFlat += bonus.flat
          flatSources.push({ value: bonus.flat, source: item.name, type: 'flat' })
        }
      }
    }

    const afterFlat = baseVal + totalFlat

    // Zbierz % bonusy z założonych itemów
    const percentSources = []
    let totalPercent = 0
    for (const item of items) {
      if (!item.equipped) continue
      for (const bonus of (item.statBonuses ?? [])) {
        if (bonus.stat === stat && bonus.percent) {
          totalPercent += bonus.percent
          percentSources.push({ value: bonus.percent, source: item.name, type: 'percent' })
        }
      }
    }
    // % bonusy od admina
    for (const m of multipliers) {
      if (m.stat === stat) {
        totalPercent += m.percent
        percentSources.push({ value: m.percent, source: m.source, type: 'percent' })
      }
    }

    const final = totalPercent !== 0
      ? Math.round(afterFlat * (1 + totalPercent / 100))
      : afterFlat

    effective[stat] = final
    breakdown[stat] = {
      base: baseVal,
      flat: totalFlat,
      percent: totalPercent,
      afterFlat,
      final,
      flatSources,
      percentSources,
      hasBonus: totalFlat !== 0 || totalPercent !== 0,
    }
  }

  return { effective, breakdown }
}
