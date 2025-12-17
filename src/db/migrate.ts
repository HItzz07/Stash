import { dbPromise } from './db'

export async function migrateFromLocalStorage() {
    const raw = localStorage.getItem('stash-notes')
    if (!raw) return

    const parsed = JSON.parse(raw)
    const db = await dbPromise

    const existing = await db.count('notes')
    if (existing > 0) return

    for (const note of parsed) {
        await db.put('notes', note)
    }

    localStorage.removeItem('stash-notes')
    console.log('✅ Migrated notes to IndexedDB')
}
