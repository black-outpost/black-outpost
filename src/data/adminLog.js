/**
 * adminLog.js — helper do zapisu logów akcji administracyjnych
 *
 * Kolekcja Firestore: adminLogs/{logId}
 * {
 *   timestamp:       serverTimestamp,
 *   adminIdentifier: string,
 *   adminUid:        string,
 *   action:          string,       // np. "edit_character", "create_character"
 *   targetId:        string,       // id dokumentu (character, item, itp.)
 *   targetName:      string,       // czytelna nazwa (np. "Akane Iwakuro (AkaIwa1234)")
 *   category:        string,       // "character" | "item" | "item_bank" | "rewards" | "technique" | "node" | "nazo" | "other"
 *   changes:         Array<{ field, before, after }> | null,
 *   note:            string | null, // opcjonalny opis
 * }
 */

import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export async function logAdminAction({
  adminIdentifier = '?',
  adminUid        = '',
  action          = '',
  targetId        = '',
  targetName      = '',
  category        = 'other',
  changes         = null,
  note            = null,
}) {
  try {
    await addDoc(collection(db, 'adminLogs'), {
      timestamp: serverTimestamp(),
      adminIdentifier,
      adminUid,
      action,
      targetId,
      targetName,
      category,
      changes: changes ?? [],
      note: note ?? '',
    })
  } catch (e) {
    // Logi nie powinny blokować głównej operacji
    console.warn('[adminLog] Failed to write log:', e.message)
  }
}

/**
 * Oblicza diff między dwoma obiektami płaskimi.
 * Zwraca tablicę { field, before, after } dla zmienionych pól.
 * Ignoruje pola z listy `ignore`.
 */
export function diffObjects(before, after, ignore = []) {
  const changes = []
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)])
  for (const key of allKeys) {
    if (ignore.includes(key)) continue
    const bVal = before[key]
    const aVal = after[key]
    const bStr = JSON.stringify(bVal)
    const aStr = JSON.stringify(aVal)
    if (bStr !== aStr) {
      changes.push({ field: key, before: bVal ?? null, after: aVal ?? null })
    }
  }
  return changes
}
