import { saveSettings } from '../db/settingsRepository'

export async function importSettingsFromJSON(file: File) {
    const text = await file.text()
    const parsed = JSON.parse(text)

    if (!parsed.settings || typeof parsed.settings !== 'object') {
        throw new Error('Invalid settings backup file')
    }

    await saveSettings(parsed.settings)
}
