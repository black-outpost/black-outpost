import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, increment, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import PageShell, { Card } from '../../components/ui/PageShell'
import { logAdminAction } from '../../data/adminLog'

const REWARD_FIELDS = [
  { key: 'pdr',           label: 'PDR — Points to Distribute',       unit: 'pts' },
  { key: 'ndr',           label: 'NDR — Node Points to Distribute',  unit: 'pts' },
  { key: 'reisenHand',    label: 'Reisen (in hand)',                  unit: '₹'   },
  { key: 'reisenBanked',  label: 'Reisen Banked',                     unit: '₹'   },
  { key: 'reisenAbsorbed',label: 'Reisen Absorbed',                   unit: '₹'   },
  { key: 'loyalty',       label: 'Loyalty',                           unit: '✦'   },
  { key: 'yen',           label: 'Yen',                               unit: '¥'   },
]

export default function RewardsManager() {
  const { identifier: adminIdentifier, currentUser } = useAuth()
  const [chars, setChars]     = useState([])
  const [selected, setSelected] = useState('')
  const [rewards, setRewards]   = useState({})
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [charData, setCharData] = useState(null)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(query(collection(db, 'characters'), orderBy('createdAt', 'desc')))
      setChars(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  function selectChar(id) {
    setSelected(id)
    setSaved(false)
    setRewards({})
    const c = chars.find(c => c.id === id)
    setCharData(c ?? null)
  }

  function setReward(key, val) {
    setRewards(r => ({ ...r, [key]: val }))
    setSaved(false)
  }

  async function handleGrant() {
    if (!selected) return
    const updates = {}
    for (const [k, v] of Object.entries(rewards)) {
      const n = parseInt(v)
      if (!isNaN(n) && n !== 0) updates[k] = increment(n)
    }
    if (Object.keys(updates).length === 0) return

    setSaving(true)
    try {
      await updateDoc(doc(db, 'characters', selected), updates)

      // Log
      const target = chars.find(c => c.id === selected)
      const changes = Object.entries(rewards)
        .filter(([k, v]) => !isNaN(parseInt(v)) && parseInt(v) !== 0)
        .map(([k, v]) => ({ field: k, before: charData?.[k] ?? 0, after: (charData?.[k] ?? 0) + parseInt(v) }))
      await logAdminAction({
        adminIdentifier, adminUid: currentUser?.uid ?? '',
        action: 'grant_rewards',
        targetId: selected,
        targetName: target ? `${target.firstName} ${target.lastName} (${target.identifier})` : selected,
        category: 'rewards',
        changes,
      })
      // Odśwież lokalny charData
      setCharData(c => {
        const copy = { ...c }
        for (const [k] of Object.entries(updates)) {
          copy[k] = (copy[k] ?? 0) + (parseInt(rewards[k]) || 0)
        }
        return copy
      })
      setRewards({})
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const selectStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--color-bo-elevated)',
    border: '1px solid var(--color-bo-border)',
    color: 'var(--color-bo-text)',
    padding: '0.55rem 0.75rem',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)',
    outline: 'none', cursor: 'pointer',
  }

  return (
    <PageShell title="REWARDS & POINTS" subtitle="GRANT RESOURCES TO PLAYERS">
      <div style={{ maxWidth: '700px' }}>
        <Card title="SELECT PERSONNEL">
          <select value={selected} onChange={e => selectChar(e.target.value)} style={selectStyle}>
            <option value="">— Select character —</option>
            {chars.map(c => (
              <option key={c.id} value={c.id}>{c.identifier} — {c.firstName} {c.lastName}</option>
            ))}
          </select>
        </Card>

        {charData && (
          <>
            <Card title={`CURRENT RESOURCES: ${charData.identifier}`}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {REWARD_FIELDS.map(f => (
                  <div key={f.key} style={{ padding: '0.5rem', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)' }}>
                    <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginBottom: '0.2rem' }}>{f.key.toUpperCase()}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-bo-text)' }}>
                      {charData[f.key] ?? 0} <span style={{ fontSize: '0.6rem', color: 'var(--color-bo-muted)' }}>{f.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="GRANT REWARDS (use negative to subtract)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                {REWARD_FIELDS.map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--color-bo-muted)', marginBottom: '0.25rem' }}>
                      {f.label}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={rewards[f.key] ?? ''}
                      onChange={e => setReward(f.key, e.target.value)}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: 'var(--color-bo-elevated)',
                        border: '1px solid var(--color-bo-border)',
                        color: 'var(--color-bo-text)',
                        padding: '0.45rem 0.6rem',
                        fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleGrant} disabled={saving} style={{
                  background: saved ? 'rgba(50,200,100,0.1)' : 'rgba(220,50,50,0.12)',
                  border: `1px solid ${saved ? 'rgba(50,200,100,0.4)' : 'var(--color-bo-red-dim)'}`,
                  color: saved ? '#60c080' : 'var(--color-bo-red)',
                  padding: '0.6rem 2rem', fontSize: '0.65rem', letterSpacing: '0.2em',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.3s',
                }}>
                  {saving ? 'GRANTING...' : saved ? '✓ GRANTED' : 'GRANT REWARDS'}
                </button>
              </div>
            </Card>
          </>
        )}
      </div>
    </PageShell>
  )
}
