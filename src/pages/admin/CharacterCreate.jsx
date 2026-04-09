import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDocs, collection, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db, secondaryAuth } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import PageShell, { Card } from '../../components/ui/PageShell'
import { logAdminAction } from '../../data/adminLog'

// ── Generator identyfikatora ──────────────────────────────
function extractSyllables(name) {
  const vowels = 'aeiouAEIOU'
  const syllables = []
  let i = 0
  while (i < name.length) {
    if (vowels.includes(name[i])) { syllables.push(name[i]); i++ }
    else {
      let syl = name[i]; i++
      while (i < name.length && !vowels.includes(name[i])) { syl += name[i]; i++ }
      if (i < name.length) { syl += name[i]; i++ }
      if (syl.length > 1) syllables.push(syl)
    }
  }
  return syllables.length > 0 ? syllables : [name.slice(0, 3)]
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() }
function generateDID() {
  return String(Math.floor(100000 + Math.random() * 900000))
}
function generateIdentifier(firstName, lastName) {
  const fs = extractSyllables(firstName)
  const p1 = cap(fs[Math.floor(Math.random() * fs.length)])
  if (lastName && lastName.trim()) {
    const ls = extractSyllables(lastName.trim())
    const p2 = cap(ls[Math.floor(Math.random() * ls.length)])
    return p1 + p2 + Math.floor(1000 + Math.random() * 9000)
  }
  // Brak nazwiska — użyj dwóch sylab z imienia lub losowych liter
  const p2 = fs.length > 1
    ? cap(fs.filter((_, i) => i !== fs.indexOf(cap(p1).toLowerCase()) ).find(s => s) ?? 'Xx')
    : cap(['Kr','Zr','Vx','Nr','Br','Sr'][Math.floor(Math.random() * 6)])
  return p1 + p2 + Math.floor(1000 + Math.random() * 9000)
}

// ── Stałe ─────────────────────────────────────────────────
const RACES = ['Soul Reaper', 'Quincy', 'Fullbringer', 'Arrancar']
const RANKS = ['I','II','III','IV','V','VI','VII','VIII','IX','X']
const SLV_SCA_OPTIONS = [
  { value: 'I',   label: 'I   — Public'           },
  { value: 'II',  label: 'II  — Restricted'       },
  { value: 'III', label: 'III — Confidential'     },
  { value: 'IV',  label: 'IV  — Secret'           },
  { value: 'V',   label: 'V   — Top Secret'       },
  { value: 'VI',  label: 'VI  — Classified'       },
  { value: 'VII', label: 'VII — Eyes Only'        },
  { value: 'VIII',label: 'VIII — Black Level'     },
  { value: 'IX',  label: 'IX  — Omega Clearance'  },
  { value: 'X',   label: 'X   — Absolute Seal'    },
]

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--color-bo-elevated)',
  border: '1px solid var(--color-bo-border)',
  color: 'var(--color-bo-text)',
  padding: '0.55rem 0.75rem',
  fontSize: '0.85rem', fontFamily: 'var(--font-body)',
}
const selectStyle = { ...inputStyle, cursor: 'pointer' }

function Field({ label, error, hint, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--color-bo-muted)', marginBottom: '0.35rem' }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: '0.58rem', color: 'var(--color-bo-muted)', marginTop: '0.2rem' }}>{hint}</div>}
      {error && <div style={{ fontSize: '0.6rem', color: '#e07070', marginTop: '0.2rem' }}>{error}</div>}
    </div>
  )
}

export default function CharacterCreate() {
  const { identifier: adminId, currentUser } = useAuth()
  const navigate = useNavigate()

  const [positions, setPositions] = useState([])
  const [form, setForm]   = useState({ firstName: '', lastName: '', identifier: '', race: 'Soul Reaper', rank: 'I', position: '', slv: 'I', sca: 'I', isNPC: false })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [globalErr, setGlobalErr] = useState('')

  useEffect(() => {
    getDocs(query(collection(db, 'positions'), orderBy('name')))
      .then(snap => setPositions(snap.docs.map(d => d.data().name)))
      .catch(() => {})
  }, [])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function handleGenerate() {
    if (!form.firstName.trim()) {
      setErrors(e => ({ ...e, identifier: 'Wpisz najpierw imię' }))
      return
    }
    set('identifier', generateIdentifier(form.firstName, form.lastName))
  }

  function validate() {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'Required'
    // lastName is optional
    if (!form.identifier.trim()) errs.identifier = 'Required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true); setGlobalErr('')
    try {
      const email    = `${form.identifier}@blackoutpost.local`
      const cred     = await createUserWithEmailAndPassword(secondaryAuth, email, form.identifier)
      const uid      = cred.user.uid
      await secondaryAuth.signOut()

      const characterId = `char_${form.identifier}`
      const statsDefault = { strength:1, vitality:1, speed:1, defense:1, reiatsu:1, reiryoku:1, bujutsu:1, bukijutsu:1, tamashi:1, nazo:0 }

      await setDoc(doc(db, 'characters', characterId), {
        userId: uid, identifier: form.identifier,
        firstName: form.firstName.trim(), lastName: form.lastName.trim(),
        photoUrl: null, race: form.race, rank: form.rank,
        position: form.position || null, slv: form.slv, sca: form.sca,
        riatsuColor: { hex: '#ffffff', name: 'White' },
        height: null, weight: null, age: null, appearance: '', personality: '', history: '',
        publicInfo: '', additionalInfo: '', privateInfo: '', ostUrl: '',
        stats: statsDefault,
        pdr: 0, ndr: 0, reisenHand: 0, reisenAbsorbed: 0, reisenBanked: 0, loyalty: 0, yen: 0,
        unlockedNodes: { strength:{}, vitality:{}, speed:{}, defense:{}, reiatsu:{}, bujutsu:{}, bukijutsu:{}, tamashi:{}, nazo:{} },
        blockedNodes: {},
        nazoTreeId: `nazo_${form.identifier}`, nazoName: null, nazoUnlocked: false,
        skills: [], techniques: [], equipment: { slots: {}, inventory: [] },
        alias: form.alias.trim() || null,
        did: generateDID(),
        status: 'alive',
        isNPC: form.isNPC, createdAt: serverTimestamp(), createdBy: adminId,
      })
      await setDoc(doc(db, 'users', uid), { identifier: form.identifier, isAdmin: false, characterId })
      await setDoc(doc(db, 'skillTrees', `nazo_${form.identifier}`), { stat: 'nazo', isDefault: false, characterId: form.identifier, nodes: [], edges: [] })

      await logAdminAction({
        adminIdentifier: adminId, adminUid: currentUser?.uid ?? '',
        action: 'create_character',
        targetId: characterId,
        targetName: `${form.firstName.trim()} ${form.lastName.trim()} (${form.identifier})`,
        category: 'character',
        note: `Rasa: ${form.race}, Ranga: ${form.rank}`,
      })

      navigate('/admin/characters')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setGlobalErr('Identifier already in use — generate a new one.')
        setErrors(e => ({ ...e, identifier: 'Already taken' }))
      } else {
        setGlobalErr(`Error: ${err.message}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageShell title="CREATE CHARACTER" subtitle="REGISTER NEW PERSONNEL RECORD">
      <form onSubmit={handleSubmit} style={{ maxWidth: '760px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

          <Card title="IDENTITY">
            <Field label="FIRST NAME" error={errors.firstName}>
              <input value={form.firstName} onChange={e => set('firstName', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="LAST NAME (opcjonalne)" error={errors.lastName}>
              <input value={form.lastName} onChange={e => set('lastName', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="IDENTIFIER" error={errors.identifier} hint="This is the player's login AND password. Share privately.">
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input value={form.identifier} onChange={e => set('identifier', e.target.value)} placeholder="AkaIwa1234" style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={handleGenerate} style={{
                  background: 'var(--color-bo-elevated)', border: '1px solid var(--color-bo-border)',
                  color: 'var(--color-bo-text-dim)', padding: '0 0.85rem',
                  fontSize: '0.6rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
                }}>↺ GENERATE</button>
              </div>
            </Field>
            <Field label="ALIAS (optional — public nickname shown on ID card)">
              <input value={form.alias} onChange={e => set('alias', e.target.value)} placeholder="e.g. The Reaper" style={inputStyle} />
            </Field>
            <Field label="RACE">
              <select value={form.race} onChange={e => set('race', e.target.value)} style={selectStyle}>
                {RACES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </Card>

          <Card title="CLASSIFICATION">
            <Field label="RANK">
              <select value={form.rank} onChange={e => set('rank', e.target.value)} style={selectStyle}>
                {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="POSITION">
              <select value={form.position} onChange={e => set('position', e.target.value)} style={selectStyle}>
                <option value="">— None —</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="SECURITY LEVEL (SLV) — how hidden is this character">
              <select value={form.slv} onChange={e => set('slv', e.target.value)} style={selectStyle}>
                {SLV_SCA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="SECURITY CLEARANCE (SCA) — what this character can see">
              <select value={form.sca} onChange={e => set('sca', e.target.value)} style={selectStyle}>
                {SLV_SCA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="isNPC" checked={form.isNPC} onChange={e => set('isNPC', e.target.checked)} style={{ cursor: 'pointer', accentColor: 'var(--color-bo-red)' }} />
              <label htmlFor="isNPC" style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: 'var(--color-bo-text-dim)', cursor: 'pointer' }}>NPC (non-player character)</label>
            </div>
          </Card>
        </div>

        {globalErr && (
          <div style={{ color: '#e07070', fontSize: '0.72rem', padding: '0.75rem', border: '1px solid var(--color-bo-red-dim)', background: 'rgba(220,50,50,0.05)', marginTop: '0.5rem' }}>
            {globalErr}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/admin/characters')} style={{
            background: 'none', border: '1px solid var(--color-bo-border)',
            color: 'var(--color-bo-text-dim)', padding: '0.6rem 1.5rem',
            fontSize: '0.65rem', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>CANCEL</button>
          <button type="submit" disabled={saving} style={{
            background: 'rgba(220,50,50,0.12)', border: '1px solid var(--color-bo-red-dim)',
            color: 'var(--color-bo-red)', padding: '0.6rem 2rem',
            fontSize: '0.65rem', letterSpacing: '0.2em', cursor: saving ? 'wait' : 'pointer', fontFamily: 'var(--font-body)',
          }}>{saving ? 'CREATING...' : 'CREATE CHARACTER'}</button>
        </div>
      </form>
    </PageShell>
  )
}
