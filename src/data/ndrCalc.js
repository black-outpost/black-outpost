/**
 * Koszt węzłów NDR w Reisen Absorbed:
 *   Węzły  1–12 : cena rośnie co 3 węzły (4→5→6→7)
 *   Węzły 13–30 : cena rośnie co 2 węzły (8→9→10→…→16)
 *   Węzły 31+   : cena rośnie co 1 węzeł (17→18→19→…)
 */
function advanceCost(ndr, cost) {
  if (ndr <= 12) {
    if (ndr % 3 === 0) return cost + 1
  } else if (ndr <= 30) {
    if ((ndr - 12) % 2 === 0) return cost + 1
  } else {
    return cost + 1
  }
  return cost
}

export function calcNDRFromReisen(reisenAbsorbed) {
  let remaining = reisenAbsorbed
  let ndr  = 0
  let cost = 4
  while (remaining >= cost) {
    remaining -= cost
    ndr++
    cost = advanceCost(ndr, cost)
  }
  return ndr
}

export function nextNDRCost(reisenAbsorbed) {
  let remaining = reisenAbsorbed
  let ndr  = 0
  let cost = 4
  while (remaining >= cost) {
    remaining -= cost
    ndr++
    cost = advanceCost(ndr, cost)
  }
  return cost
}
