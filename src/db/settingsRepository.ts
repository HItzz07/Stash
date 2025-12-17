import { dbPromise } from './db'

const SETTINGS_ID = 'app-settings'

export async function getSettings() {
    const db = await dbPromise
    return db.get('settings', SETTINGS_ID)
}

export async function saveSettings(data: any) {
    const db = await dbPromise
    await db.put('settings', {
        id: SETTINGS_ID,
        data,
        updatedAt: Date.now(),
    })
}
