export function calcNDRFromReisen(reisenAbsorbed) {
  let remaining = reisenAbsorbed
  let ndr = 0
  let cost = 4
  let countAtThisCost = 0
  while (remaining >= cost) {
    remaining -= cost
    ndr++
    countAtThisCost++
    if (countAtThisCost % 3 === 0) cost++
  }
  return ndr
}

export function nextNDRCost(reisenAbsorbed) {
  let remaining = reisenAbsorbed
  let cost = 4
  let countAtThisCost = 0
  while (remaining >= cost) {
    remaining -= cost
    countAtThisCost++
    if (countAtThisCost % 3 === 0) cost++
  }
  return cost
}
