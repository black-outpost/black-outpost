import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCharacter } from '../../hooks/useCharacter'
import { useItems, toggleEquip } from '../../hooks/useEquipment'
import { calcEffectiveStats } from '../../data/statCalc'
import { useSkillTrees } from '../../hooks/useSkillTrees'
import PageShell, { Card } from '../../components/ui/PageShell'
import TechMarkupRenderer from '../../components/ui/TechMarkupRenderer'

/* ── Rozwijalna karta przedmiotu ── */
function ItemCard({ item, characterId, equippedCountByType, handSlotsUsed, equipmentTypes, onToggle, charStats }) {
  const [expanded, setExpanded] = useState(false)
  const bonuses    = (item.statBonuses ?? []).filter(b => b.flat || b.percent)
  const isEquipment = item.itemType === 'equipment'
  const typeName    = isEquipment ? equipmentTypes.find(t => t.id === item.equipmentTypeId)?.name : null
  const typeData    = isEquipment ? equipmentTypes.find(t => t.id === item.equipmentTypeId) : null
  const isEquipped  = item.equipped ?? false

  function canEquip() {
    if (!isEquipment || isEquipped) return true
    if (!typeData) return true
    // Check regular slot limit
    if ((equippedCountByType[item.equipmentTypeId] ?? 0) >= typeData.limit) return false
    // Check hand slots
    const itemHands = typeData.handSlots ?? 0
    if (itemHands > 0 && (handSlotsUsed ?? 0) + itemHands > 2) return false
    // Check excludes
    for (const excId of (typeData.excludes ?? [])) {
      if ((equippedCountByType[excId] ?? 0) > 0) return false
    }
    return true
  }
  const canToggle = canEquip()
  const hasContent = item.description || bonuses.length > 0 || item.imageUrl

  return (
    <div style={{
      border: `1px solid ${isEquipped ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'}`,
      background: isEquipped ? 'rgba(220,50,50,0.04)' : 'var(--color-bo-surface)',
      marginBottom: '2px', transition: 'all 0.15s',
    }}>
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0.75rem' }}>
        {/* Icon */}
        <div style={{ width: 32, height: 32, flexShrink: 0, background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: isEquipped ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', cursor: hasContent ? 'pointer' : 'default' }}
          onClick={() => hasContent && setExpanded(e => !e)}>
          {item.imageUrl
            ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (isEquipment ? '⚔' : '◻')}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, cursor: hasContent ? 'pointer' : 'default' }} onClick={() => hasContent && setExpanded(e => !e)}>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', fontWeight: isEquipped ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
            {item.rank && <span style={{ marginLeft: 5, fontSize: '0.6rem', color: '#d4a840', fontWeight: 400 }}>({item.rank})</span>}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1px' }}>
            {isEquipment && typeName && <span style={{ color: 'var(--color-bo-text-dim)' }}>{typeName}</span>}
            {isEquipped && <span style={{ color: 'var(--color-bo-red)', border: '1px solid var(--color-bo-red-dim)', padding: '0 3px', letterSpacing: '0.08em' }}>EQUIPPED</span>}
            {!isEquipment && (item.quantity ?? 1) > 1 && <span>×{item.quantity}</span>}
            {isEquipped && bonuses.map((b, i) => (
              <span key={i} style={{ color: '#60c080', fontSize: '0.58rem' }}>
                {b.flat    ? `${b.flat > 0 ? '+' : ''}${b.flat} ${b.stat} ` : ''}
                {b.percent ? `${b.percent > 0 ? '+' : ''}${b.percent}% ${b.stat}` : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Expand indicator */}
        {hasContent && (
          <span style={{ color: 'var(--color-bo-muted)', fontSize: '0.6rem', cursor: 'pointer', flexShrink: 0 }} onClick={() => setExpanded(e => !e)}>
            {expanded ? '▲' : '▼'}
          </span>
        )}

        {/* Equip toggle */}
        {isEquipment && (
          <button onClick={() => onToggle(item)} disabled={!canToggle && !isEquipped} style={{
            background: isEquipped ? 'rgba(220,50,50,0.1)' : 'rgba(96,192,128,0.08)',
            border: `1px solid ${isEquipped ? 'var(--color-bo-red-dim)' : 'rgba(96,192,128,0.3)'}`,
            color: isEquipped ? 'var(--color-bo-red)' : (!canToggle ? 'var(--color-bo-muted)' : '#60c080'),
            padding: '0.25rem 0.55rem', fontSize: '0.58rem', letterSpacing: '0.1em',
            cursor: (!canToggle && !isEquipped) ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-body)', flexShrink: 0,
            opacity: !canToggle && !isEquipped ? 0.5 : 1,
          }}>
            {isEquipped ? 'UNEQUIP' : 'EQUIP'}
          </button>
        )}
      </div>

      {/* Expanded content — full width inline */}
      {expanded && hasContent && (
        <div style={{ borderTop: '1px solid var(--color-bo-border)', padding: '0.65rem 0.75rem', background: 'rgba(0,0,0,0.15)' }}>
          {item.imageUrl && (
            <div style={{ width: '100%', height: '160px', overflow: 'hidden', marginBottom: '0.6rem', border: '1px solid var(--color-bo-border)' }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          {item.description && (
            <div style={{ marginBottom: bonuses.length > 0 ? '0.5rem' : 0 }}>
              <TechMarkupRenderer text={item.description} stats={charStats ?? {}} />
            </div>
          )}
          {bonuses.length > 0 && (
            <div style={{ borderTop: item.description ? '1px solid var(--color-bo-border)' : 'none', paddingTop: item.description ? '0.4rem' : 0 }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)', marginBottom: '0.3rem' }}>
                {isEquipped ? 'ACTIVE BONUSES' : 'BONUSES WHEN EQUIPPED'}
              </div>
              {bonuses.map((b, i) => (
                <div key={i} style={{ fontSize: '0.72rem', color: isEquipped ? '#60c080' : 'var(--color-bo-text-dim)', lineHeight: 1.6 }}>
                  {b.flat    ? `${b.flat > 0 ? '+' : ''}${b.flat} ${b.stat}  ` : ''}
                  {b.percent ? `${b.percent > 0 ? '+' : ''}${b.percent}% ${b.stat}` : ''}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Ikona przedmiotu ── */
function ItemIcon({ item, isEquipped }) {
  if (item.imageUrl) {
    return (
      <div style={{ width: 32, height: 32, overflow: 'hidden', border: '1px solid var(--color-bo-border)', flexShrink: 0 }}>
        <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }
  return (
    <div style={{ width: 32, height: 32, background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: isEquipped ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', flexShrink: 0 }}>
      {item.itemType === 'equipment' ? '⚔' : '◻'}
    </div>
  )
}

export default function EquipmentView() {
  const { character, loading: charLoading } = useCharacter()
  const { items, loading: itemsLoading }    = useItems(character?.id)
  const { trees: globalTrees } = useSkillTrees()
  const [equipmentTypes, setEquipmentTypes] = useState([])
  const [search, setSearch] = useState('')
  const [sort,   setSort]   = useState('equipped')

  useEffect(() => {
    getDocs(collection(db, 'equipmentTypes')).then(snap =>
      setEquipmentTypes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
  }, [])

  const loading = charLoading || itemsLoading

  const tbtn = active => ({ background: active ? 'rgba(220,50,50,0.1)' : 'none', border: '1px solid ' + (active ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: active ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.28rem 0.6rem', fontSize: '0.58rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' })
  const sortFn = (a, b) => sort === 'name' ? a.name.localeCompare(b.name) : (a.equipped ? -1 : 1)

  const allItems       = search ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : items
  const simpleItems    = allItems.filter(i => i.itemType !== 'equipment').sort(sortFn)
  const equipmentItems = allItems.filter(i => i.itemType === 'equipment').sort(sortFn)

  // Count equipped per type
  const equippedCountByType = {}
  for (const item of equipmentItems.filter(i => i.equipped)) {
    equippedCountByType[item.equipmentTypeId] = (equippedCountByType[item.equipmentTypeId] ?? 0) + 1
  }

  // Count hand slots used
  let handSlotsUsed = 0
  for (const item of equipmentItems.filter(i => i.equipped)) {
    const typeData = equipmentTypes.find(t => t.id === item.equipmentTypeId)
    handSlotsUsed += typeData?.handSlots ?? 0
  }

  const { effective: charStats, breakdown } = calcEffectiveStats(character ?? {}, items, globalTrees)
  const hasAnyBonus = Object.values(breakdown).some(b => b.hasBonus)

  async function handleToggle(item) {
    if (!character?.id) return
    await toggleEquip(character.id, item.id, item.equipped ?? false)
  }

  if (loading) return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>

  return (
    <PageShell title="EQUIPMENT" subtitle="INVENTORY & GEAR MANAGEMENT">
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." style={{ background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '0.32rem 0.6rem', fontSize: '0.78rem', fontFamily: 'var(--font-body)', width: '180px', outline: 'none' }} />
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
              : equipmentItems.map(item => <ItemCard key={item.id} item={item} characterId={character?.id} equippedCountByType={equippedCountByType} handSlotsUsed={handSlotsUsed} equipmentTypes={equipmentTypes} onToggle={handleToggle} charStats={charStats} />)
            }
          </Card>

          {/* Slot Status */}
          {equipmentTypes.length > 0 && equipmentItems.length > 0 && (
            <Card title="SLOT STATUS">
              {/* Hand slots */}
              <div style={{ marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--color-bo-text-dim)' }}>Hands</span>
                  <span style={{ fontSize: '0.65rem', color: handSlotsUsed >= 2 ? 'var(--color-bo-red)' : 'var(--color-bo-muted)' }}>{handSlotsUsed}/2</span>
                </div>
                <div style={{ height: '4px', background: 'var(--color-bo-elevated)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: Math.min(100, handSlotsUsed * 50) + '%', background: handSlotsUsed >= 2 ? 'var(--color-bo-red)' : '#60a0c0', borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
              </div>
              {equipmentTypes.filter(t => (t.limit ?? 1) > 0 && (t.handSlots ?? 0) === 0 && items.filter(i => i.itemType === 'equipment' && i.equipmentTypeId === t.id).length > 0).map(type => {
                const count = equippedCountByType[type.id] ?? 0
                const pct   = Math.min(100, Math.round((count / type.limit) * 100))
                return (
                  <div key={type.id} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: 'var(--color-bo-text-dim)' }}>{type.name}</span>
                      <span style={{ fontSize: '0.62rem', color: count >= type.limit ? 'var(--color-bo-red)' : 'var(--color-bo-muted)' }}>{count}/{type.limit}</span>
                    </div>
                    <div style={{ height: '3px', background: 'var(--color-bo-elevated)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: pct + '%', background: count >= type.limit ? 'var(--color-bo-red)' : 'var(--color-bo-muted)', borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                )
              })}
            </Card>
          )}

          {/* Active bonuses */}
          {hasAnyBonus && (
            <Card title="TOTAL STAT BONUSES">
              {Object.entries(breakdown).filter(([, b]) => b.hasBonus).map(([stat, b]) => (
                <div key={stat} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-bo-text-dim)', letterSpacing: '0.08em' }}>{stat.toUpperCase()}</span>
                  <span style={{ fontSize: '0.65rem', color: '#60c080' }}>
                    {b.flat > 0 ? `+${b.flat} ` : ''}{b.percent !== 0 ? `+${b.percent}%` : ''}
                  </span>
                </div>
              ))}
            </Card>
          )}
        </div>

        <div>
          <Card title="INVENTORY">
            {simpleItems.length === 0
              ? <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem', letterSpacing: '0.1em', padding: '1.5rem 0', textAlign: 'center' }}>INVENTORY EMPTY</div>
              : simpleItems.map(item => <ItemCard key={item.id} item={item} characterId={character?.id} equippedCountByType={equippedCountByType} handSlotsUsed={handSlotsUsed} equipmentTypes={equipmentTypes} onToggle={handleToggle} charStats={charStats} />)
            }
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
