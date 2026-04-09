import { useState, useEffect } from 'react'
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

// Nasłuchuje na kartę postaci zalogowanego gracza w czasie rzeczywistym
export function useCharacter() {
  const { characterId } = useAuth()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (!characterId) {
      setCharacter(null)
      setLoading(false)
      return
    }

    const ref = doc(db, 'characters', characterId)
    const unsub = onSnapshot(ref,
      snap => {
        if (snap.exists()) {
          setCharacter({ id: snap.id, ...snap.data() })
        } else {
          setCharacter(null)
        }
        setLoading(false)
      },
      err => {
        console.error('useCharacter error:', err)
        setError(err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [characterId])

  return { character, loading, error }
}

// Wyszukuje kartę po identyfikatorze (do PublicSearch)
export async function findCharacterByIdentifier(identifier) {
  const q = query(
    collection(db, 'characters'),
    where('identifier', '==', identifier)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}
