import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, getDocs, collection, orderBy, query, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import PageShell, { Card } from '../../components/ui/PageShell'
import StatMultiplierPanel from '../../components/ui/StatMultiplierPanel'
import { logAdminAction, diffObjects } from '../../data/adminLog'
import { CHARACTER_STATUSES, STATUS_NONE } from '../../data/characterStatuses'

const RACES   = ['Soul Reaper', 'Quincy', 'Fullbringer', 'Arrancar']
const RANKS   = ['I','II','III','IV','V','VI','VII','VIII','IX','X']
const SLV_SCA = [
  { value: 'I',    label: 'I   — Public'          },
  { value: 'II',   label: 'II  — Restricted'      },
  { value: 'III',  label: 'III — Confidential'    },
  { value: 'IV',   label: 'IV  — Secret'          },
  { value: 'V',    label: 'V   — Top Secret'      },
  { value: 'VI',   label: 'VI  — Classified'      },
  { value: 'VII',  label: 'VII — Eyes Only'       },
  { value: 'VIII', label: 'VIII — Black Level'    },
  { value: 'IX',   label: 'IX  — Omega Clearance' },
  { value: 'X',    label: 'X   — Absolute Seal'   },
]
const STATS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi','nazo']

const inp = { width: '100%', boxSizing: 'border-box', background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text)', padding: '0.5rem 0.65rem', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }
const sel = { ...inp }

function F({ label, children }) {
  return (
    <div style={{ marginBottom: '0.8rem' }}>
      <label style={{ display: 'block', fontSize: '0.58rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.3rem' }}>{label}</label>
      {children}
    </div>
  )
}

export default function CharacterEdit() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { identifier: adminIdentifier, currentUser } = useAuth()

  const [form,      setForm]      = useState(null)
  const [charLive,  setCharLive]  = useState(null)
  const [positions, setPositions] = useState([])
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [err,       setErr]       = useState('')

  const originalForm = useRef(null) // zapamiętaj stan przed edycją dla diffa

  // Jednorazowo załaduj dane do formularza
  useEffect(() => {
    if (!id) return
    getDoc(doc(db, 'characters', id)).then(snap => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() }
        setForm(data)
        originalForm.current = data
      }
    })
    getDocs(query(collection(db, 'positions'), orderBy('name')))
      .then(snap => setPositions(snap.docs.map(d => d.data().name)))
  }, [id])

  // Live listener — tylko dla multipliers (żeby się odświeżały bez Save)
  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(doc(db, 'characters', id), snap => {
      if (snap.exists()) setCharLive({ id: snap.id, ...snap.data() })
    })
    return unsub
  }, [id])

  function set(path, value) {
    setForm(f => {
      if (path.includes('.')) {
        const [p, c] = path.split('.')
        return { ...f, [p]: { ...f[p], [c]: value } }
      }
      return { ...f, [path]: value }
    })
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true); setErr('')
    try {
      const { id: _id, userId, identifier, createdAt, createdBy, nazoTreeId, statMultipliers, ...rest } = form
      await updateDoc(doc(db, 'characters', id), rest)

      // Log
      const ignore = ['id','userId','identifier','createdAt','createdBy','nazoTreeId','statMultipliers']
      const before = originalForm.current ?? {}
      const changes = diffObjects(before, form, ignore)
      if (changes.length > 0) {
        await logAdminAction({
          adminIdentifier, adminUid: currentUser?.uid ?? '',
          action: 'edit_character',
          targetId: id,
          targetName: `${form.firstName ?? ''} ${form.lastName ?? ''} (${form.identifier ?? id})`.trim(),
          category: 'character',
          changes,
        })
        originalForm.current = form // zaktualizuj baseline po zapisie
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) { setErr(e.message) }
    finally { setSaving(false) }
  }

  if (!form) return <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.75rem', letterSpacing: '0.15em', padding: '2rem' }}>LOADING...</div>

  const btnBase = { fontSize: '0.62rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)' }

  return (
    <PageShell title={'EDIT: ' + (form.identifier ?? '')} subtitle={(form.firstName ?? '') + ' ' + (form.lastName ?? '')}>

      {/* Górny pasek */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/admin/view/' + id)} style={{ ...btnBase, background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.5rem 1rem' }}>👁 VIEW</button>
        <button onClick={() => navigate('/admin/characters')} style={{ ...btnBase, background: 'none', border: '1px solid var(--color-bo-border)', color: 'var(--color-bo-text-dim)', padding: '0.5rem 1rem' }}>BACK</button>
        <button onClick={handleSave} disabled={saving} style={{ ...btnBase, background: saved ? 'rgba(50,200,100,0.1)' : 'rgba(220,50,50,0.12)', border: '1px solid ' + (saved ? 'rgba(50,200,100,0.4)' : 'var(--color-bo-red-dim)'), color: saved ? '#60c080' : 'var(--color-bo-red)', padding: '0.5rem 1.5rem', transition: 'all 0.3s' }}>
          {saving ? 'SAVING...' : saved ? '✓ SAVED' : 'SAVE CHANGES'}
        </button>
      </div>

      {/* Status */}
      <Card title="STATUS POSTACI" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={form.status ?? ''}
            onChange={e => set('status', e.target.value || null)}
            style={{ ...inp, width: 'auto', minWidth: '200px' }}
          >
            <option value="">— brak statusu —</option>
            {CHARACTER_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {form.status && (() => {
            const s = CHARACTER_STATUSES.find(x => x.value === form.status)
            if (!s) return null
            return (
              <span style={{ padding: '3px 14px', fontSize: '0.68rem', letterSpacing: '0.1em', border: `1px solid ${s.color}55`, color: s.color, background: s.color + '18', borderRadius: '3px' }}>
                {s.label}
              </span>
            )
          })()}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Tożsamość */}
        <Card title="IDENTITY">
          <F label="FIRST NAME"><input value={form.firstName ?? ''} onChange={e => set('firstName', e.target.value)} style={inp} /></F>
          <F label="LAST NAME"><input value={form.lastName ?? ''} onChange={e => set('lastName', e.target.value)} style={inp} /></F>
          <F label="DID (Document ID — shown on ID card)"><input value={form.did ?? ''} onChange={e => set('did', e.target.value)} placeholder="000000" style={inp} /></F>
          <F label="JOIN DATE (on ID card, e.g. 2025-3-12 AD.)"><input value={form.joinDate ?? ''} onChange={e => set('joinDate', e.target.value)} placeholder="2025-3-12 AD." style={inp} /></F>
          <F label="ALIAS (public nickname)"><input value={form.alias ?? ''} onChange={e => set('alias', e.target.value)} placeholder="e.g. The Reaper" style={inp} /></F>
          <F label="PHOTO URL"><input value={form.photoUrl ?? ''} onChange={e => set('photoUrl', e.target.value)} placeholder="https://..." style={inp} /></F>
          <F label="RACE">
            <select value={form.race ?? ''} onChange={e => set('race', e.target.value)} style={sel}>
              {RACES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </F>
          <F label="RANK">
            <select value={form.rank ?? 'I'} onChange={e => set('rank', e.target.value)} style={sel}>
              {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </F>
          <F label="POSITION">
            <select value={form.position ?? ''} onChange={e => set('position', e.target.value)} style={sel}>
              <option value="">— None —</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </F>
        </Card>

        <div>
          <Card title="SECURITY">
            <F label="SECURITY LEVEL (SLV)">
              <select value={form.slv ?? 'I'} onChange={e => set('slv', e.target.value)} style={sel}>
                {SLV_SCA.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </F>
            <F label="SECURITY CLEARANCE (SCA)">
              <select value={form.sca ?? 'I'} onChange={e => set('sca', e.target.value)} style={sel}>
                {SLV_SCA.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </F>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input type="checkbox" id="isNPC" checked={form.isNPC ?? false} onChange={e => set('isNPC', e.target.checked)} style={{ cursor: 'pointer', accentColor: 'var(--color-bo-red)' }} />
              <label htmlFor="isNPC" style={{ fontSize: '0.68rem', color: 'var(--color-bo-text-dim)', cursor: 'pointer' }}>NPC</label>
            </div>
          </Card>

          <Card title="REIATSU COLOR">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', alignItems: 'flex-end' }}>
              <F label="HEX">
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input type="color" value={form.riatsuColor?.hex ?? '#ffffff'} onChange={e => set('riatsuColor', { ...form.riatsuColor, hex: e.target.value })} style={{ width: '40px', height: '32px', border: '1px solid var(--color-bo-border)', background: 'var(--color-bo-elevated)', cursor: 'pointer', padding: '2px' }} />
                  <input value={form.riatsuColor?.hex ?? ''} onChange={e => set('riatsuColor', { ...form.riatsuColor, hex: e.target.value })} style={{ ...inp, flex: 1 }} />
                </div>
              </F>
              <F label="COLOR NAME">
                <input value={form.riatsuColor?.name ?? ''} onChange={e => set('riatsuColor', { ...form.riatsuColor, name: e.target.value })} placeholder="e.g. White" style={inp} />
              </F>
            </div>
          </Card>
        </div>
      </div>

      {/* Statystyki */}
      <Card title="COMBAT STATISTICS">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem 0.75rem' }}>
          {STATS.map(stat => (
            <F key={stat} label={stat.toUpperCase()}>
              <input type="number" min="0" value={form.stats?.[stat] ?? 0} onChange={e => set('stats.' + stat, Number(e.target.value))} style={{ ...inp, padding: '0.4rem 0.5rem' }} />
            </F>
          ))}
        </div>
      </Card>

      {/* Punkty i zasoby */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <Card title="POINTS TO DISTRIBUTE">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 0.75rem' }}>
            <F label="PDR — Stat Points"><input type="number" min="0" value={form.pdr ?? 0} onChange={e => set('pdr', Number(e.target.value))} style={{ ...inp, padding: '0.4rem 0.5rem' }} /></F>
            <F label="NDR — Node Points (admin bonus)"><input type="number" min="0" value={form.ndr ?? 0} onChange={e => set('ndr', Number(e.target.value))} style={{ ...inp, padding: '0.4rem 0.5rem' }} /></F>
          </div>
        </Card>
        <Card title="CURRENCIES & RESOURCES">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 0.75rem' }}>
            {[['reisenHand','Reisen (Hand)'],['reisenAbsorbed','Reisen Absorbed'],['reisenBanked','Reisen Banked'],['loyalty','Loyalty'],['yen','Yen']].map(([k, lbl]) => (
              <F key={k} label={lbl}><input type="number" min="0" value={form[k] ?? 0} onChange={e => set(k, Number(e.target.value))} style={{ ...inp, padding: '0.4rem 0.5rem' }} /></F>
            ))}
          </div>
        </Card>
      </div>

      {/* Dossier */}
      <Card title="DOSSIER" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <F label="HEIGHT (cm)"><input type="number" value={form.height ?? ''} onChange={e => set('height', e.target.value ? Number(e.target.value) : null)} style={inp} /></F>
          <F label="WEIGHT (kg)"><input type="number" value={form.weight ?? ''} onChange={e => set('weight', e.target.value ? Number(e.target.value) : null)} style={inp} /></F>
          <F label="AGE"><input type="number" min="0" value={form.age ?? ''} onChange={e => set('age', e.target.value ? Number(e.target.value) : null)} style={inp} /></F>
        </div>
        <F label="OST URL (bezpośredni link do pliku audio — mp3, ogg, itd.)">
          <input value={form.ostUrl ?? ''} onChange={e => set('ostUrl', e.target.value)} style={inp} placeholder="https://..." />
        </F>
        {[['appearance','APPEARANCE'],['personality','PERSONALITY'],['history','HISTORY'],['additionalInfo','ADDITIONAL INFO (widoczne dla gracza w History & Lore)'],['publicInfo','PUBLIC INFO (widoczne dla innych graczy w Personnel Search)']].map(([k, lbl]) => (
          <F key={k} label={lbl}>
            <textarea value={form[k] ?? ''} onChange={e => set(k, e.target.value)} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
          </F>
        ))}
        <F label="PRIVATE INFO — TYLKO ADMIN (nie wyświetlane graczowi)">
          <textarea value={form.privateInfo ?? ''} onChange={e => set('privateInfo', e.target.value)} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6, borderColor: 'var(--color-bo-red-dim)' }} />
        </F>
      </Card>

      {/* Nazo */}
      <Card title="NAZO (HIDDEN STAT)" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="nazoUnlocked" checked={form.nazoUnlocked ?? false} onChange={e => set('nazoUnlocked', e.target.checked)} style={{ cursor: 'pointer', accentColor: 'var(--color-bo-red)' }} />
            <label htmlFor="nazoUnlocked" style={{ fontSize: '0.75rem', color: 'var(--color-bo-text-dim)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {form.nazoUnlocked ? '✓ Unlocked' : '✕ Locked (???)'}
            </label>
          </div>
          <F label="NAZO NAME (visible to player when unlocked)">
            <input value={form.nazoName ?? ''} onChange={e => set('nazoName', e.target.value)} placeholder="e.g. Research" disabled={!form.nazoUnlocked} style={{ ...inp, opacity: form.nazoUnlocked ? 1 : 0.4 }} />
          </F>
        </div>
      </Card>

      {/* Multipliers — live, nie wymagają Save */}
      <Card title="STAT MULTIPLIERS" style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-bo-muted)', marginBottom: '0.75rem', lineHeight: 1.7 }}>
          % modifiers applied after flat equipment bonuses. Saves instantly — no need to click Save Changes.
          Source description is shown to the player on hover over the stat.
        </div>
        {charLive
          ? <StatMultiplierPanel character={charLive} />
          : <div style={{ color: 'var(--color-bo-muted)', fontSize: '0.72rem' }}>Loading...</div>
        }
      </Card>

      {err && <div style={{ color: '#e07070', fontSize: '0.72rem', marginTop: '0.75rem' }}>{err}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button onClick={handleSave} disabled={saving} style={{ ...btnBase, background: saved ? 'rgba(50,200,100,0.1)' : 'rgba(220,50,50,0.12)', border: '1px solid ' + (saved ? 'rgba(50,200,100,0.4)' : 'var(--color-bo-red-dim)'), color: saved ? '#60c080' : 'var(--color-bo-red)', padding: '0.6rem 2.5rem', transition: 'all 0.3s' }}>
          {saving ? 'SAVING...' : saved ? '✓ SAVED' : 'SAVE CHANGES'}
        </button>
      </div>
    </PageShell>
  )
}
