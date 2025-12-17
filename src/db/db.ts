import { openDB } from 'idb'
import type { DBSchema } from 'idb'

export interface StashDB extends DBSchema {
    notes: {
        key: string
        value: {
            id: string
            content: string
            createdAt: number
            updatedAt: number
            deleted?: boolean
        }
        indexes: { 'by-updatedAt': number }
    }

    settings: {
        key: string
        value: {
            id: string
            data: any
            updatedAt: number
        }
    }
}

export const dbPromise = openDB<StashDB>('stash-db', 2, {
    upgrade(db, oldVersion) {
        if (oldVersion < 1) {
            const notes = db.createObjectStore('notes', { keyPath: 'id' })
            notes.createIndex('by-updatedAt', 'updatedAt')
        }

        if (oldVersion < 2) {
            db.createObjectStore('settings', { keyPath: 'id' })
        }
    },
})
