import { getSettings } from '../db/settingsRepository'

export async function exportSettingsAsJSON() {
    const settings = await getSettings()

    const payload = {
        version: 1,
        exportedAt: Date.now(),
        settings: settings?.data ?? {},
    }

    const blob = new Blob(
        [JSON.stringify(payload, null, 2)],
        { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stash-settings-backup.json'
    a.click()
    URL.revokeObjectURL(url)
}
