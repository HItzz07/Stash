import { dbPromise } from '../db/db'

export async function importNotesFromJSON(file: File) {
    const text = await file.text()
    const parsed = JSON.parse(text)

    if (!Array.isArray(parsed.notes)) {
        throw new Error('Invalid notes backup file')
    }

    const db = await dbPromise

    for (const note of parsed.notes) {
        await db.put('notes', note)
    }
}
