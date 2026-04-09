/**
 * useSkillTrees — loads the merged skill tree map:
 *   Firestore `skillTrees/{stat}` overrides DEFAULT_SKILL_TREES[stat]
 *
 * Returns: { trees: { strength: {...}, vitality: {...}, ... }, loading }
 *
 * Each entry follows the shape: { stat, nodes[], edges[] }
 * If no Firestore document exists for a stat, the default is used as-is.
 */
import { useState, useEffect, useMemo } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { DEFAULT_SKILL_TREES } from '../data/defaultSkillTrees'

const STATS = ['strength','vitality','speed','defense','reiatsu','reiryoku','bujutsu','bukijutsu','tamashi']

export function useSkillTrees() {
  const [firestoreOverrides, setFirestoreOverrides] = useState({}) // stat → treeDoc
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'skillTrees'),
      (snap) => {
        const overrides = {}
        snap.docs.forEach(d => {
          const data = d.data()
          // Only override the 9 standard stats (not nazo per-character trees)
          if (data.isDefault && data.stat && STATS.includes(data.stat)) {
            overrides[data.stat] = { ...data, id: d.id }
          }
        })
        setFirestoreOverrides(overrides)
        setLoading(false)
      },
      (err) => {
        console.warn('useSkillTrees: Firestore read failed, using defaults', err)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  const trees = useMemo(() => {
    const result = { ...DEFAULT_SKILL_TREES }
    for (const stat of STATS) {
      if (firestoreOverrides[stat]) {
        result[stat] = firestoreOverrides[stat]
      }
    }
    return result
  }, [firestoreOverrides])

  return { trees, loading }
}
