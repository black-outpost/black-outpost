import { useState, useEffect } from 'react'
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, getDocs, updateDoc, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import PageShell, { Card } from '../../components/ui/PageShell'

const inp = { background:'var(--color-bo-elevated)', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-text)', padding:'0.45rem 0.6rem', fontSize:'0.82rem', fontFamily:'var(--font-body)', width:'100%', boxSizing:'border-box' }
const btn = (extra={}) => ({ background:'none', border:'1px solid var(--color-bo-border)', color:'var(--color-bo-text-dim)', padding:'0.35rem 0.65rem', fontSize:'0.6rem', letterSpacing:'0.12em', cursor:'pointer', fontFamily:'var(--font-body)', ...extra })

const PRESET_TAGS = [
  { name: 'alive',    color: '#60c080', desc: 'Postać żyje' },
  { name: 'deceased', color: '#c04040', desc: 'Postać nie żyje' },
  { name: 'm.i.a.',   color: '#c08020', desc: 'Zaginiony/a' },
]

export default function TagManager() {
  const [tags,       setTags]       = useState([])
  const [characters, setCharacters] = useState([])
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor,setNewTagColor]= useState('#6080c0')
  const [saving,     setSaving]     = useState(false)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'characterTags'), snap => {
      const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => a.name.localeCompare(b.name))
      setTags(loaded)
    })
    getDocs(query(collection(db, 'characters'), orderBy('identifier'))).then(snap =>
      setCharacters(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  async function initPresets() {
    for (const t of PRESET_TAGS) {
      const exists = tags.some(x => x.name === t.name)
      if (!exists) await addDoc(collection(db, 'characterTags'), { name: t.name, color: t.color, desc: t.desc, createdAt: serverTimestamp() })
    }
  }

  async function createTag() {
    if (!newTagName.trim()) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'characterTags'), { name: newTagName.trim().toLowerCase(), color: newTagColor, createdAt: serverTimestamp() })
      setNewTagName('')
    } finally { setSaving(false) }
  }

  async function deleteTag(id, tagName) {
    if (!window.confirm(`Usunąć tag "${tagName}"? Zostanie usunięty też ze wszystkich postaci.`)) return
    await deleteDoc(doc(db, 'characterTags', id))
    // Usuń z wszystkich postaci
    for (const c of characters) {
      const charTags = c.tags ?? []
      if (charTags.includes(tagName)) {
        await updateDoc(doc(db, 'characters', c.id), { tags: charTags.filter(t => t !== tagName) })
      }
    }
  }

  async function toggleCharTag(charId, tagName, hasCurrently) {
    const c = characters.find(x => x.id === charId)
    if (!c) return
    const curr = c.tags ?? []
    const next = hasCurrently ? curr.filter(t => t !== tagName) : [...curr, tagName]
    await updateDoc(doc(db, 'characters', charId), { tags: next })
    setCharacters(prev => prev.map(x => x.id === charId ? { ...x, tags: next } : x))
  }

  return (
    <PageShell title="CHARACTER TAGS" subtitle="Tagi wyświetlane w Personnel Search — żywy, poległy, zaginiony itd.">
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>

        {/* Lewa — zarządzanie tagami */}
        <div>
          <Card title="TAGI">
            {tags.length === 0 && (
              <button onClick={initPresets} style={{ ...btn({ color: 'var(--color-bo-red)', border: '1px solid var(--color-bo-red-dim)', width: '100%', marginBottom: '0.75rem', textAlign: 'center' }) }}>
                + DODAJ PODSTAWOWE TAGI (alive / deceased / m.i.a.)
              </button>
            )}
            {tags.map(tag => (
              <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid var(--color-bo-border)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: tag.color ?? '#6080c0', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '0.72rem', color: 'var(--color-bo-text)', fontFamily: 'var(--font-body)' }}>{tag.name}</span>
                <button onClick={() => deleteTag(tag.id, tag.name)} style={{ background: 'none', border: 'none', color: 'var(--color-bo-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              </div>
            ))}

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-bo-border)' }}>
              <div style={{ fontSize: '0.52rem', letterSpacing: '0.16em', color: 'var(--color-bo-muted)', marginBottom: '0.5rem' }}>NOWY TAG</div>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <input value={newTagName} onChange={e => setNewTagName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createTag()} placeholder="nazwa tagu..." style={{ ...inp, flex: 1 }} />
                <input type="color" value={newTagColor} onChange={e => setNewTagColor(e.target.value)} style={{ width: '38px', height: '38px', border: '1px solid var(--color-bo-border)', background: 'var(--color-bo-elevated)', cursor: 'pointer', padding: '2px' }} />
              </div>
              <button onClick={createTag} disabled={saving || !newTagName.trim()} style={{ ...btn({ width: '100%', textAlign: 'center', background: 'rgba(220,50,50,0.08)', border: '1px solid var(--color-bo-red-dim)', color: 'var(--color-bo-red)', opacity: !newTagName.trim() ? 0.5 : 1 }) }}>
                {saving ? 'DODAWANIE...' : '+ DODAJ TAG'}
              </button>
            </div>
          </Card>
        </div>

        {/* Prawa — przypisywanie tagów do postaci */}
        <Card title="PRZYPISZ TAGI DO POSTACI">
          {tags.length === 0
            ? <div style={{ fontSize: '0.7rem', color: 'var(--color-bo-muted)', padding: '2rem 0', textAlign: 'center' }}>Najpierw utwórz tagi po lewej</div>
            : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', fontSize: '0.52rem', letterSpacing: '0.14em', color: 'var(--color-bo-muted)', borderBottom: '1px solid var(--color-bo-border)', fontWeight: 400 }}>POSTAĆ</th>
                      {tags.map(tag => (
                        <th key={tag.id} style={{ textAlign: 'center', padding: '0.4rem 0.5rem', fontSize: '0.52rem', letterSpacing: '0.1em', color: tag.color ?? 'var(--color-bo-muted)', borderBottom: '1px solid var(--color-bo-border)', fontWeight: 400, whiteSpace: 'nowrap' }}>
                          {tag.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {characters.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(46,46,63,0.5)' }}>
                        <td style={{ padding: '0.35rem 0.6rem', color: 'var(--color-bo-text-dim)' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--color-bo-text)' }}>{c.identifier}</span>
                          {c.firstName && <span style={{ fontSize: '0.58rem', color: 'var(--color-bo-muted)', marginLeft: '0.4rem' }}>{c.firstName} {c.lastName}</span>}
                        </td>
                        {tags.map(tag => {
                          const has = (c.tags ?? []).includes(tag.name)
                          return (
                            <td key={tag.id} style={{ textAlign: 'center', padding: '0.35rem 0.5rem' }}>
                              <button
                                onClick={() => toggleCharTag(c.id, tag.name, has)}
                                style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${has ? tag.color ?? '#6080c0' : 'var(--color-bo-border)'}`, background: has ? (tag.color ?? '#6080c0') + '33' : 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: has ? (tag.color ?? '#6080c0') : 'var(--color-bo-muted)' }}
                              >{has ? '✓' : ''}</button>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </Card>
      </div>
    </PageShell>
  )
}
