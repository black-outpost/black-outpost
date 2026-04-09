import { calcNDRFromReisen, nextNDRCost } from '../../data/ndrCalc'

/**
 * Pasek postępu + breakdown NDR z Reisena.
 * Używany i w widoku gracza i w adminie.
 */
export default function NDRBreakdown({ character }) {
  const c = character ?? {}
  const reisenAbsorbed = c.reisenAbsorbed ?? 0
  const ndrFromReisen  = calcNDRFromReisen(reisenAbsorbed)
  const ndrFromAdmin   = c.ndr ?? 0
  const totalNDR       = ndrFromReisen + ndrFromAdmin

  const spentNDR = Object.values(c.unlockedNodes ?? {})
    .reduce((sum, tree) => sum + Object.values(tree).reduce((s2, v) => s2 + v, 0), 0)
  const availableNDR = totalNDR - spentNDR

  const nextCost = nextNDRCost(reisenAbsorbed)

  // Ile Reisena zebrano w kierunku następnego NDR
  // Odtwarzamy ile zostało "reszty" po obliczeniu ndrFromReisen
  function getRemainder() {
    let remaining = reisenAbsorbed
    let cost = 4
    let countAtThisCost = 0
    while (remaining >= cost) {
      remaining -= cost
      countAtThisCost++
      if (countAtThisCost % 3 === 0) cost++
    }
    return remaining // ile zebrano z nextCost
  }
  const progressReisen = getRemainder()
  const progressPct    = Math.round((progressReisen / nextCost) * 100)

  return (
    <div>
      {/* Pasek postępu do następnego NDR */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)' }}>
            NEXT NODE POINT
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-bo-text-dim)' }}>
            <span style={{ color: progressPct > 0 ? 'var(--color-bo-text)' : 'var(--color-bo-text-dim)' }}>{progressReisen}</span>
            <span style={{ color: 'var(--color-bo-muted)' }}> / {nextCost} ₹</span>
          </span>
        </div>
        {/* Track */}
        <div style={{ height: '6px', background: 'var(--color-bo-elevated)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${progressPct}%`,
            background: progressPct >= 100
              ? '#60c080'
              : `linear-gradient(90deg, var(--color-bo-red-dim), var(--color-bo-red))`,
            borderRadius: '3px',
            transition: 'width 0.4s ease',
            minWidth: progressPct > 0 ? '4px' : '0',
          }} />
        </div>
        <div style={{ fontSize: '0.58rem', color: 'var(--color-bo-muted)', marginTop: '3px', letterSpacing: '0.05em' }}>
          {progressPct}% toward next NDR
        </div>
      </div>

      {/* Breakdown */}
      <div style={{
        background: 'var(--color-bo-elevated)',
        border: '1px solid var(--color-bo-border)',
        padding: '0.65rem 0.75rem',
      }}>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>
          NDR BREAKDOWN
        </div>
        {[
          [`From Reisen (${reisenAbsorbed} absorbed)`, ndrFromReisen, false],
          [`Admin bonus`,                              ndrFromAdmin,  false],
          [`Total earned`,                            totalNDR,      true ],
          [`Spent in trees`,                          `-${spentNDR}`,false],
        ].map(([lbl, val, bold]) => (
          <div key={lbl} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: bold ? '3px 0 0' : '2px 0',
            borderTop: bold ? '1px solid var(--color-bo-border)' : 'none',
            marginTop: bold ? '4px' : '0',
          }}>
            <span style={{ fontSize: '0.65rem', color: bold ? 'var(--color-bo-text-dim)' : 'var(--color-bo-muted)' }}>{lbl}</span>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-display)', color: bold ? 'var(--color-bo-text)' : 'var(--color-bo-text-dim)', fontWeight: bold ? 700 : 400 }}>{val}</span>
          </div>
        ))}
        {/* Dostępne NDR — wyróżnione */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '4px 0 0', marginTop: '4px',
          borderTop: '1px solid var(--color-bo-border)',
        }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-bo-text)', letterSpacing: '0.05em' }}>Available NDR</span>
          <span style={{
            fontSize: '0.85rem', fontFamily: 'var(--font-display)',
            color: availableNDR > 0 ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)',
            fontWeight: 700,
          }}>{availableNDR}</span>
        </div>
      </div>
    </div>
  )
}
