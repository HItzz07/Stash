import { dbPromise } from './db'
import { nanoid } from 'nanoid'

export async function getAllNotes() {
    const db = await dbPromise
    return db.getAll('notes')
}

export async function addNote(content: string) {
    const db = await dbPromise
    const now = Date.now()

    const note = {
        id: nanoid(),
        content,
        createdAt: now,
        updatedAt: now,
    }

    await db.put('notes', note)
    return note
}

export async function updateNote(id: string, content: string) {
    const db = await dbPromise
    const note = await db.get('notes', id)
    if (!note) return

    note.content = content
    note.updatedAt = Date.now()

    await db.put('notes', note)
}

export async function deleteNote(id: string) {
    const db = await dbPromise
    await db.delete('notes', id)
}
