import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'
import IdentifierCard from '../../components/ui/IdentifierCard'
import NDRBreakdown from '../../components/ui/NDRBreakdown'
import StatMultiplierPanel from '../../components/ui/StatMultiplierPanel'
import TechMarkupRenderer from '../../components/ui/TechMarkupRenderer'
import { calcEffectiveStats } from '../../data/statCalc'

const STAT_NAMES = {
  bujutsu:   { 'Soul Reaper':'Hakuda','Arrancar':'Hakuda','Quincy':'Hakuda','Fullbringer':'Hakuda',default:'Bujutsu' },
  bukijutsu: { 'Soul Reaper':'Zanjutsu','Arrancar':'Zanjutsu','Quincy':'Kyudo','Fullbringer':'Bukijutsu',default:'Bukijutsu' },
  tamashi:   { 'Soul Reaper':'Zanpakuto Mastery','Arrancar':'Zanpakuto Mastery','Quincy':'Blood Mastery','Fullbringer':'Fullbring Mastery',default:'Tamashi' },
}
function getStatName(stat, race) {
  return STAT_NAMES[stat]?.[race] ?? STAT_NAMES[stat]?.default ?? stat.toUpperCase()
}

function StatRow({ label, value = 0, bd }) {
  const [hover, setHover] = useState(false)
  const final    = bd?.final ?? value
  const hasBonus = bd?.hasBonus
  const pct      = Math.round((Math.min(final, 500) / 500) * 100)

  function tooltipLines() {
    if (!bd || !hasBonus) return null
    const lines = ['Base: ' + bd.base]
    if (bd.flat !== 0) {
      lines.push('Flat bonuses: ' + (bd.flat > 0 ? '+' : '') + bd.flat)
      for (const s of bd.flatSources) lines.push('  • ' + (s.value > 0 ? '+' : '') + s.value + ' from ' + s.source)
    }
    if (bd.percent !== 0) {
      if (bd.flat !== 0) lines.push('After flat: ' + bd.afterFlat)
      lines.push('Multipliers: ' + (bd.percent > 0 ? '+' : '') + bd.percent + '%')
      for (const s of bd.percentSources) lines.push('  • ' + (s.value > 0 ? '+' : '') + s.value + '% — ' + s.source)
    }
    lines.push('Total: ' + bd.final)
    return lines
  }
  const tipLines = tooltipLines()

  return (
    <div style={{ marginBottom: '0.9rem', position: 'relative' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', cursor: hasBonus ? 'help' : 'default' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--color-bo-text-dim)', borderBottom: hasBonus ? '1px dashed var(--color-bo-muted)' : 'none' }}>{label}</span>
        <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-display)', color: hasBonus ? '#60c080' : 'var(--color-bo-text)' }}>
          {final}
          {hasBonus && bd.flat !== 0 && (
            <span style={{ fontSize: '0.6rem', color: 'var(--color-bo-red)', marginLeft: '4px' }}>
              ({value}{bd.flat > 0 ? '+' : ''}{bd.flat})
            </span>
          )}
        </span>
      </div>
      <div style={{ height: '2px', background: 'var(--color-bo-elevated)' }}>
        <div style={{ height: '100%', width: pct + '%', background: hasBonus ? '#60c080' : 'var(--color-bo-red)', opacity: final > 0 ? 1 : 0.2 }} />
      </div>
      {hover && tipLines && (
        <div style={{ position: 'absolute', right: 0, bottom: '100%', marginBottom: '6px', background: '#0a0a0f', border: '1px solid var(--color-bo-border)', padding: '0.55rem 0.75rem', zIndex: 50, boxShadow: '0 4px 20px rgba(0,0,0,0.6)', minWidth: '200px', pointerEvents: 'none' }}>
          {tipLines.map((line, i) => (
            <div key={i} style={{ fontSize: line.startsWith('Total') ? '0.65rem' : line.startsWith('  •') ? '0.6rem' : '0.65rem', color: line.startsWith('Total') ? '#60c080' : line.startsWith('  •') ? 'var(--color-bo-text-dim)' : 'var(--color-bo-text)', fontWeight: line.startsWith('Total') ? 700 : 400, lineHeight: 1.6, borderTop: line.startsWith('Total') ? '1px solid var(--color-bo-border)' : 'none', marginTop: line.startsWith('Total') ? '4px' : 0, paddingTop: line.startsWith('Total') ? '4px' : 0 }}>{line}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function DataRow({ label, value = 0, unit }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
      <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: 'var(--color-bo-text-dim)' }}>{label}</span>
      <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-display)', color: 'var(--color-bo-text)' }}>
        {value}{unit && <span style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', marginLeft: '3px' }}>{unit}</span>}
      </span>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
      <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--color-bo-muted)' }}>{label}</span>
      <span style={{ fontSize: '0.78rem', color: 'var(--color-bo-text)' }}>{value || '—'}</span>
    </div>
  )
}

const TABS = [
  { key: 'stats',       label: 'STATISTICS' },
  { key: 'multipliers', label: 'MULTIPLIERS' },
  { key: 'equipment',   label: 'EQUIPMENT' },
  { key: 'techniques',  label: 'TECHNIQUES' },
  { key: 'identifier',  label: 'IDENTIFIER CARD' },
  { key: 'history',     label: 'HISTORY & LORE' },
]

/* Rozwijalna karta techniki w admin view */
function AdminTechRow({ tech, charStats }) {
  const [expanded, setExpanded] = useState(false)
  const [imgOk,    setImgOk]    = useState(false)

  return (
    <div style={{ border: '1px solid ' + (expanded ? 'var(--color-bo-muted)' : 'var(--color-bo-border)'), marginBottom: '3px', background: 'var(--color-bo-surface)', transition: 'border-color 0.15s' }}>
      <button onClick={() => setExpanded(e => !e)} style={{ width: '100%', background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'stretch', cursor: 'pointer', textAlign: 'left' }}>
        {tech.imageUrl && (
          <div style={{ width: '64px', flexShrink: 0, overflow: 'hidden', background: 'var(--color-bo-elevated)' }}>
            <img src={tech.imageUrl} alt="" onLoad={() => setImgOk(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: imgOk ? 'block' : 'none', minHeight: '64px' }} />
            {!imgOk && <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bo-border)', fontSize: '1.1rem' }}>◈</div>}
          </div>
        )}
        <div style={{ flex: 1, padding: '0.55rem 0.85rem', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            {tech.classification && <span style={{ fontSize: '0.5rem', letterSpacing: '0.12em', color: 'var(--color-bo-red)', background: 'rgba(220,50,50,0.08)', border: '1px solid var(--color-bo-red-dim)', padding: '1px 5px' }}>CLASS {tech.classification}</span>}
            {tech.stat && <span style={{ fontSize: '0.5rem', letterSpacing: '0.1em', color: '#5090d0', background: 'rgba(80,144,208,0.08)', border: '1px solid rgba(80,144,208,0.25)', padding: '1px 5px' }}>{tech.stat.toUpperCase()}</span>}
            {tech.origin && <span style={{ fontSize: '0.5rem', color: 'var(--color-bo-muted)', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', padding: '1px 5px' }}>{tech.origin}</span>}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-bo-text)', fontWeight: 600, lineHeight: 1.3 }}>{tech.name}</div>
          {!expanded && tech.description && (
            <div style={{ fontSize: '0.68rem', color: 'var(--color-bo-text-dim)', marginTop: '0.2rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {tech.description.replace(/\*\*(.*?)\*\*/g,'$1').replace(/\{[^|{}]+\|([^}]+)\}/g,'$1')}
            </div>
          )}
        </div>
        <div style={{ padding: '0.55rem 0.7rem', display: 'flex', alignItems: 'center', color: 'var(--color-bo-muted)', fontSize: '0.65rem', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</div>
      </button>

      {expanded && (
        <div style={{ padding: '0.7rem 0.85rem 0.85rem', borderTop: '1px solid var(--color-bo-border)' }}>
          {tech.imageUrl && (
            <div style={{ height: '160px', overflow: 'hidden', marginBottom: '0.75rem', border: '1px solid var(--color-bo-border)' }}>
              <img src={tech.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          {tech.description && (
            <TechMarkupRenderer text={tech.description} stats={charStats} />
          )}
          {tech.technicalDetails && (
            <div style={{ marginTop: '0.75rem', background: 'rgba(220,50,50,0.04)', border: '1px solid var(--color-bo-border)', borderLeft: '3px solid var(--color-bo-red-dim)', padding: '0.6rem 0.8rem' }}>
              <div style={{ fontSize: '0.52rem', letterSpacing: '0.18em', color: 'var(--color-bo-red)', marginBottom: '0.4rem' }}>TECHNICAL DETAILS</div>
              <TechMarkupRenderer text={tech.technicalDetails} stats={charStats} isTechDetails />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CharacterView() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [char,    setChar]    = useState(null)
  const [items,      setItems]      = useState([])
  const [techniques, setTechniques] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('stats')

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(doc(db, 'characters', id), snap => {
      if (snap.exists()) setChar({ id: snap.id, ...snap.data() })
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [id])

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(collection(db, 'characters', id, 'items'),
      snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [id])

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(collection(db, 'characters', id, 'techniques'),
      snap => setTechniques(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [id])

  if (loading) return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>
  if (!char)   return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>CHARACTER NOT FOUND</div>

  const race = char.race ?? ''
  const s    = char.stats ?? {}
  const { breakdown } = calcEffectiveStats(char, items)

  return (
    <PageShell title={'VIEW: ' + char.identifier} subtitle="ADMIN CHARACTER OVERVIEW">
      <div style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid var(--color-bo-red-dim)', padding: '0.5rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'var(--color-bo-red)' }}>▲ ADMIN VIEW</span>
        <button onClick={() => navigate('/admin/edit/' + id)} style={{ background: 'none', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', padding: '0.3rem 0.85rem', fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>✎ EDIT</button>
      </div>

      <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ background: tab === t.key ? 'rgba(220,50,50,0.15)' : 'var(--color-bo-surface)', border: '1px solid ' + (tab === t.key ? 'var(--color-bo-red-dim)' : 'var(--color-bo-border)'), color: tab === t.key ? 'var(--color-bo-red)' : 'var(--color-bo-text-dim)', padding: '0.4rem 1rem', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{t.label}</button>
        ))}
      </div>

      {tab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Card title="COMBAT STATISTICS">
            <StatRow label="STRENGTH"                       value={s.strength}  bd={breakdown.strength}  />
            <StatRow label="VITALITY"                       value={s.vitality}  bd={breakdown.vitality}  />
            <StatRow label="SPEED"                          value={s.speed}     bd={breakdown.speed}     />
            <StatRow label="DEFENSE"                        value={s.defense}   bd={breakdown.defense}   />
            <StatRow label="REIATSU"                        value={s.reiatsu}   bd={breakdown.reiatsu}   />
            <StatRow label="REIRYOKU"                       value={s.reiryoku}  bd={breakdown.reiryoku}  />
            <StatRow label={getStatName('bujutsu',   race)} value={s.bujutsu}   bd={breakdown.bujutsu}   />
            <StatRow label={getStatName('bukijutsu', race)} value={s.bukijutsu} bd={breakdown.bukijutsu} />
            <StatRow label={getStatName('tamashi',   race)} value={s.tamashi}   bd={breakdown.tamashi}   />
            <StatRow label={char.nazoUnlocked ? (char.nazoName ?? '???') : '???'} value={s.nazo} bd={breakdown.nazo} />
          </Card>
          <div>
            <Card title="NODE POINTS (NDR)">
              <DataRow label="PDR — STAT POINTS" value={char.pdr ?? 0} />
              <div style={{ marginTop: '0.5rem' }}><NDRBreakdown character={char} /></div>
            </Card>
            <Card title="CURRENCIES">
              <DataRow label="REISEN (IN HAND)"  value={char.reisenHand ?? 0}     unit="₹" />
              <DataRow label="REISEN ABSORBED"   value={char.reisenAbsorbed ?? 0} unit="₹" />
              <DataRow label="REISEN BANKED"     value={char.reisenBanked ?? 0}   unit="₹" />
              <DataRow label="LOYALTY"           value={char.loyalty ?? 0}         unit="✦" />
              <DataRow label="YEN"               value={char.yen ?? 0}             unit="¥" />
            </Card>
            <Card title="PERSONNEL INFO">
              <InfoRow label="RACE"     value={char.race} />
              <InfoRow label="RANK"     value={char.rank} />
              <InfoRow label="POSITION" value={char.position} />
              <InfoRow label="SLV"      value={char.slv} />
              <InfoRow label="SCA"      value={char.sca} />
              {char.height && <InfoRow label="HEIGHT" value={char.height + ' cm'} />}
              {char.weight && <InfoRow label="WEIGHT" value={char.weight + ' kg'} />}
            </Card>
          </div>
        </div>
      )}

      {tab === 'multipliers' && (
        <div style={{ maxWidth: '700px' }}>
          <Card title="STAT MULTIPLIERS">
            <div style={{ fontSize: '0.65rem', color: 'var(--color-bo-muted)', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Percentage modifiers applied after flat equipment bonuses. Add a source description so the player knows where the bonus comes from.
            </div>
            <StatMultiplierPanel character={char} />
          </Card>
        </div>
      )}


      {tab === 'equipment' && (
        <div>
          {items.length === 0 ? (
            <div style={{ border: '1px dashed var(--color-bo-border)', padding: '3rem 2rem', textAlign: 'center', background: 'var(--color-bo-surface)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>NO ITEMS ASSIGNED</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Card title="EQUIPMENT">
                {items.filter(i => i.itemType === 'equipment').map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
                    {item.imageUrl ? (
                      <div style={{ width: '32px', height: '32px', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--color-bo-border)' }}>
                        <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '32px', height: '32px', flexShrink: 0, background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: item.equipped ? 'var(--color-bo-red)' : 'var(--color-bo-muted)' }}>⚔</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', fontWeight: item.equipped ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1px' }}>
                        {item.equipped && <span style={{ color: 'var(--color-bo-red)', border: '1px solid var(--color-bo-red-dim)', padding: '0 3px', letterSpacing: '0.08em' }}>EQUIPPED</span>}
                        {(item.statBonuses ?? []).filter(b => b.flat || b.percent).map((b, i) => (
                          <span key={i} style={{ color: '#60c080' }}>
                            {b.flat    ? (b.flat    > 0 ? '+' : '') + b.flat    + ' ' + b.stat + ' ' : ''}
                            {b.percent ? (b.percent > 0 ? '+' : '') + b.percent + '% ' + b.stat : ''}
                          </span>
                        ))}
                        {item.description && <span style={{ fontStyle: 'italic', color: 'var(--color-bo-muted)' }}>{item.description}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {items.filter(i => i.itemType === 'equipment').length === 0 && (
                  <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '1rem 0', textAlign: 'center' }}>NONE</div>
                )}
              </Card>
              <Card title="INVENTORY">
                {items.filter(i => i.itemType !== 'equipment').map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
                    {item.imageUrl ? (
                      <div style={{ width: '32px', height: '32px', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--color-bo-border)' }}>
                        <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '32px', height: '32px', flexShrink: 0, background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--color-bo-muted)' }}>◻</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-bo-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}{(item.quantity ?? 1) > 1 ? <span style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem' }}> ×{item.quantity}</span> : ''}
                      </div>
                      {item.description && <div style={{ fontSize: '0.62rem', color: 'var(--color-bo-muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>}
                    </div>
                  </div>
                ))}
                {items.filter(i => i.itemType !== 'equipment').length === 0 && (
                  <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '1rem 0', textAlign: 'center' }}>NONE</div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}

      {tab === 'techniques' && (
        <div>
          {techniques.length === 0 ? (
            <div style={{ border: '1px dashed var(--color-bo-border)', padding: '3rem 2rem', textAlign: 'center', background: 'var(--color-bo-surface)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-bo-muted)', letterSpacing: '0.1em' }}>NO TECHNIQUES REGISTERED</div>
            </div>
          ) : (
            [...techniques].sort((a, b) => a.name.localeCompare(b.name)).map(tech => (
              <AdminTechRow key={tech.id} tech={tech} charStats={char.stats ?? {}} />
            ))
          )}
        </div>
      )}
      {tab === 'identifier' && (
        <div>
          <IdentifierCard char={char} />
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(220,50,50,0.06)', border: '1px solid var(--color-bo-red-dim)', display: 'inline-block' }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--color-bo-red)' }}>
              ADMIN NOTE — DID: {char.did ?? '—'} · Login ID: {char.identifier}
            </span>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Card title="APPEARANCE"><p style={{ color: char.appearance ? 'var(--color-bo-text)' : 'var(--color-bo-muted)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{char.appearance || '— No data —'}</p></Card>
            <Card title="PERSONALITY"><p style={{ color: char.personality ? 'var(--color-bo-text)' : 'var(--color-bo-muted)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{char.personality || '— No data —'}</p></Card>
          </div>
          <Card title="HISTORY"><p style={{ color: char.history ? 'var(--color-bo-text)' : 'var(--color-bo-muted)', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{char.history || '— No data —'}</p></Card>
        </div>
      )}
    </PageShell>
  )
}
