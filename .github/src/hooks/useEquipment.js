import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, doc,
  updateDoc, addDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Hook nasłuchujący na itemy postaci w czasie rzeczywistym.
 * items/{characterId}/items subcollection
 */
export function useItems(characterId) {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!characterId) { setItems([]); setLoading(false); return }
    const ref = collection(db, 'characters', characterId, 'items')
    const unsub = onSnapshot(ref,
      snap => { setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false) },
      err  => { console.error(err); setLoading(false) }
    )
    return unsub
  }, [characterId])

  return { items, loading }
}

/** Założ/zdejmij item (toggle equipped) */
export async function toggleEquip(characterId, itemId, currentlyEquipped) {
  await updateDoc(
    doc(db, 'characters', characterId, 'items', itemId),
    { equipped: !currentlyEquipped }
  )
}

/** Dodaj nowy item do gracza (używane przez admina) */
export async function addItem(characterId, itemData) {
  return addDoc(
    collection(db, 'characters', characterId, 'items'),
    { ...itemData, createdAt: serverTimestamp() }
  )
}

/** Usuń item */
export async function removeItem(characterId, itemId) {
  return deleteDoc(doc(db, 'characters', characterId, 'items', itemId))
}
