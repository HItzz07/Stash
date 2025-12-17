import { dbPromise } from './db'
import { saveSettings } from './settingsRepository'

export async function migrateSettingsFromLocalStorage() {
    const raw = localStorage.getItem('stash-settings')
    if (!raw) return

    const db = await dbPromise
    const existing = await db.get('settings', 'app-settings')
    if (existing) return

    const parsed = JSON.parse(raw)
    await saveSettings(parsed)

    localStorage.removeItem('stash-settings')
    console.log('✅ Settings migrated to IndexedDB')
}
