import { useEffect, useState } from 'react'
import { getSettings, saveSettings } from '../db/settingsRepository'
import { migrateSettingsFromLocalStorage } from '../db/migrateSettings'
import type { SettingsConfig } from '../types'

const DEFAULT_SETTINGS: SettingsConfig = {
    sortBy: 'created',
    sortOrder: 'desc',
    showFullText: false,
    coloredKeywords: ['todo', 'idea', 'read', 'listen'],
    syncLocation: 'local',
}

export function useSettings() {
    const [settings, setSettingsState] = useState(DEFAULT_SETTINGS)

    useEffect(() => {
        (async () => {
            await migrateSettingsFromLocalStorage()
            const stored = await getSettings()
            if (stored?.data) {
                setSettingsState({ ...DEFAULT_SETTINGS, ...stored.data })
            }
        })()
    }, [])

    const setSettings = (value: any) => {
        setSettingsState(prev => {
            const next =
                typeof value === 'function' ? value(prev) : value

            saveSettings(next)
            return next
        })
    }

    const addKeyword = (keyword: string) => {
        setSettings((prev: any) => ({
            ...prev,
            coloredKeywords: [...prev.coloredKeywords, keyword],
        }))
    }

    const removeKeyword = (keyword: string) => {
        setSettings((prev: any) => ({
            ...prev,
            coloredKeywords: prev.coloredKeywords.filter(
                (k: string) => k !== keyword
            ),
        }))
    }

    const importSettings = async (file: File) => {
        const text = await file.text()
        const parsed = JSON.parse(text)

        if (!parsed.settings || typeof parsed.settings !== 'object') {
            throw new Error('Invalid settings backup file')
        }

        await saveSettings(parsed.settings)

        // 🔥 instant UI update
        setSettingsState(parsed.settings)
    }

    return {
        settings,
        setSettings,
        addKeyword,
        removeKeyword,
        importSettings,
    }
}
