import { useState, useEffect, useMemo } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCharacter } from '../../hooks/useCharacter'
import { useItems, toggleEquip } from '../../hooks/useEquipment'
import { calcEffectiveStats } from '../../data/statCalc'
import PageShell, { Card } from '../../components/ui/PageShell'

/* ── Rich tooltip z obrazkiem, opisem i bonusami ── */
function ItemTooltip({ item, equipTypeName, isEquipped, children }) {
  const [show, setShow] = useState(false)
  const bonuses = (item.statBonuses ?? []).filter(b => b.flat || b.percent)
  const hasContent = item.imageUrl || item.description || bonuses.length > 0

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && hasContent && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '0',
          width: '240px',
          background: '#0d0d14', border: '1px solid var(--color-bo-border)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.7)',
          zIndex: 200, pointerEvents: 'none',
        }}>
          {/* Obrazek */}
          {item.imageUrl && (
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid var(--color-bo-border)' }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ padding: '0.6rem 0.75rem' }}>
            {/* Nazwa + typ */}
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-bo-text)', marginBottom: equipTypeName ? '2px' : '0' }}>{item.name}</div>
            {equipTypeName && (
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', marginBottom: '0.4rem' }}>{equipTypeName.toUpperCase()}</div>
            )}
            {/* Opis */}
            {item.description && (
              <p style={{ fontSize: '0.7rem', color: 'var(--color-bo-text-dim)', lineHeight: 1.6, margin: '0 0 0.4rem', wordBreak: 'break-word' }}>
                {item.description}
              </p>
            )}
            {/* Bonusy */}
            {bonuses.length > 0 && (
              <div style={{ borderTop: item.description ? '1px solid var(--color-bo-border)' : 'none', paddingTop: item.description ? '0.4rem' : '0' }}>
                <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', marginBottom: '0.3rem' }}>
                  {isEquipped ? 'ACTIVE BONUSES' : 'BONUSES WHEN EQUIPPED'}
                </div>
                {bonuses.map((b, i) => (
                  <div key={i} style={{ fontSize: '0.7rem', color: isEquipped ? '#60c080' : 'var(--color-bo-text-dim)', lineHeight: 1.5 }}>
                    {b.flat    ? <span>{b.flat    > 0 ? '+' : ''}{b.flat} {b.stat}    </span> : null}
                    {b.percent ? <span>{b.percent > 0 ? '+' : ''}{b.percent}% {b.stat}</span> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Strzałka */}
          <div style={{ position: 'absolute', top: '100%', left: '18px', border: '5px solid transparent', borderTopColor: 'var(--color-bo-border)' }} />
        </div>
      )}
    </div>
  )
}

/* ── Ikona przedmiotu z obrazkiem lub emoji ── */
function ItemIcon({ item, isEquipped }) {
  if (item.imageUrl) {
    return (
      <div style={{ width: '36px', height: '36px', flexShrink: 0, border: '1px solid ' + (isEquipped ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), overflow: 'hidden' }}>
        <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }
  return (
    <div style={{ width: '36px', height: '36px', flexShrink: 0, background: 'var(--color-bo-elevated)', border: '1px solid ' + (isEquipped ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: isEquipped ? 'var(--color-bo-red)' : 'var(--color-bo-muted)' }}>
      {item.itemType === 'equipment' ? '⚔' : '◻'}
    </div>
  )
}

/* ── Karta pojedynczego itemu ── */
function ItemCard({ item, characterId, equippedCountByType, equipmentTypes, onToggle }) {
  const isEquipment = item.itemType === 'equipment'
  const isEquipped  = item.equipped ?? false
  const typeName    = equipmentTypes.find(t => t.id === item.equipmentTypeId)?.name ?? ''

  function canEquip() {
    if (!isEquipment || isEquipped) return true
    const typeData = equipmentTypes.find(t => t.id === item.equipmentTypeId)
    if (!typeData) return true
    if ((equippedCountByType[item.equipmentTypeId] ?? 0) >= typeData.limit) return false
    for (const excId of (typeData.excludes ?? [])) {
      if ((equippedCountByType[excId] ?? 0) > 0) return false
    }
    return true
  }
  const canToggle = canEquip()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0.75rem', background: isEquipped ? 'rgba(220,50,50,0.06)' : 'var(--color-bo-surface)', border: '1px solid ' + (isEquipped ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), marginBottom: '2px', transition: 'all 0.15s' }}>

      <ItemTooltip item={item} equipTypeName={typeName} isEquipped={isEquipped}>
        <ItemIcon item={item} isEquipped={isEquipped} />
      </ItemTooltip>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', fontWeight: isEquipped ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', marginTop: '1px', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isEquipment && typeName && <span style={{ color: 'var(--color-bo-text-dim)' }}>{typeName}</span>}
          {!isEquipment && (item.quantity ?? 1) > 1 && <span>×{item.quantity}</span>}
          {isEquipped && (item.statBonuses ?? []).filter(b => b.flat || b.percent).map((b, i) => (
            <span key={i} style={{ color: '#60c080', fontSize: '0.58rem' }}>
              {b.flat    ? (b.flat    > 0 ? '+' : '') + b.flat    + ' ' + b.stat    + ' ' : ''}
              {b.percent ? (b.percent > 0 ? '+' : '') + b.percent + '% ' + b.stat : ''}
            </span>
          ))}
        </div>
      </div>

      {isEquipment && (
        <button
          onClick={() => onToggle(item)}
          disabled={!canToggle && !isEquipped}
          title={!canToggle && !isEquipped ? 'Slot full or type conflict' : undefined}
          style={{ background: isEquipped ? 'rgba(220,50,50,0.15)' : 'none', border: '1px solid ' + (isEquipped ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: isEquipped ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.25rem 0.65rem', fontSize: '0.6rem', letterSpacing: '0.12em', cursor: (!canToggle && !isEquipped) ? 'not-allowed' : 'pointer', opacity: (!canToggle && !isEquipped) ? 0.4 : 1, fontFamily: 'var(--font-body)', transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {isEquipped ? 'UNEQUIP' : 'EQUIP'}
        </button>
      )}
    </div>
  )
}

export default function EquipmentView() {
  const { character } = useCharacter()
  const { items, loading } = useItems(character?.id)
  const [equipmentTypes, setEquipmentTypes] = useState([])
  const [search, setSearch] = useState('')
  const [sort,   setSort]   = useState('name')

  useEffect(() => {
    getDocs(collection(db, 'equipmentTypes')).then(snap =>
      setEquipmentTypes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
  }, [])

  const tbtn = active => ({ background: active ? 'rgba(220,50,50,0.1)' : 'none', border: '1px solid ' + (active ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: active ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.28rem 0.6rem', fontSize: '0.58rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' })
  const sortFn = (a, b) => sort === 'name' ? a.name.localeCompare(b.name) : (a.equipped ? -1 : 1)

  const allItems    = search ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : items
  const simpleItems    = allItems.filter(i => i.itemType !== 'equipment').sort(sortFn)
  const equipmentItems = allItems.filter(i => i.itemType === 'equipment').sort(sortFn)

  const equippedCountByType = {}
  for (const item of equipmentItems.filter(i => i.equipped)) {
    equippedCountByType[item.equipmentTypeId] = (equippedCountByType[item.equipmentTypeId] ?? 0) + 1
  }

  const { breakdown } = calcEffectiveStats(character ?? {}, items)
  const hasAnyBonus   = Object.values(breakdown).some(b => b.hasBonus)

  async function handleToggle(item) {
    if (!character?.id) return
    await toggleEquip(character.id, item.id, item.equipped ?? false)
  }

  if (loading) return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>

  return (
    <PageShell title="EQUIPMENT" subtitle="INVENTORY & GEAR MANAGEMENT">
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." style={{ background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '0.32rem 0.6rem', fontSize: '0.78rem', fontFamily: 'var(--font-body)', width: '180px' }} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
          <button onClick={() => setSort('name')}     style={tbtn(sort === 'name')}>A–Z</button>
          <button onClick={() => setSort('equipped')} style={tbtn(sort === 'equipped')}>EQUIPPED FIRST</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <Card title="EQUIPPED GEAR">
            {equipmentItems.length === 0
              ? <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em', padding: '1.5rem 0', textAlign: 'center' }}>NO EQUIPMENT ASSIGNED</div>
              : equipmentItems.map(item => <ItemCard key={item.id} item={item} characterId={character?.id} equippedCountByType={equippedCountByType} equipmentTypes={equipmentTypes} onToggle={handleToggle} />)
            }
          </Card>

          {equipmentTypes.length > 0 && equipmentItems.length > 0 && (
            <Card title="SLOT STATUS">
              {equipmentTypes.map(type => {
                const count = equippedCountByType[type.id] ?? 0
                const pct   = Math.round((count / type.limit) * 100)
                return (
                  <div key={type.id} style={{ marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--color-bo-text-dim)' }}>{type.name}</span>
                      <span style={{ fontSize: '0.65rem', color: count >= type.limit ? 'var(--color-bo-red)' : 'var(--color-bo-muted)' }}>{count}/{type.limit}</span>
                    </div>
                    <div style={{ height: '3px', background: 'var(--color-bo-elevated)' }}>
                      <div style={{ height: '100%', width: pct + '%', background: count >= type.limit ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                )
              })}
            </Card>
          )}
        </div>

        <div>
          <Card title="INVENTORY">
            {simpleItems.length === 0
              ? <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em', padding: '1.5rem 0', textAlign: 'center' }}>INVENTORY EMPTY</div>
              : simpleItems.map(item => <ItemCard key={item.id} item={item} characterId={character?.id} equippedCountByType={equippedCountByType} equipmentTypes={equipmentTypes} onToggle={handleToggle} />)
            }
          </Card>

          {hasAnyBonus && (
            <Card title="ACTIVE STAT BONUSES">
              {Object.entries(breakdown).filter(([, b]) => b.hasBonus).map(([stat, b]) => (
                <div key={stat} style={{ padding: '0.45rem 0', borderBottom: '1px solid var(--color-bo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--color-bo-text-dim)' }}>{stat.toUpperCase()}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-bo-text)', fontFamily: 'var(--font-display)' }}>
                    {b.base}
                    {b.flat !== 0 && <span style={{ color: 'var(--color-bo-red)', fontSize: '0.65rem' }}> +{b.flat}</span>}
                    {b.percent !== 0 && <span style={{ color: '#60a0e0', fontSize: '0.65rem' }}> {b.percent > 0 ? '+' : ''}{b.percent}%</span>}
                    <span style={{ color: 'var(--color-bo-muted)', fontSize: '0.6rem' }}> = </span>
                    <span style={{ color: b.final > b.base ? '#60c080' : 'var(--color-bo-text)' }}>{b.final}</span>
                  </span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  )
}
