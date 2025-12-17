import { useEffect, useState } from 'react'
import * as repo from '../db/notesRepository'
import { migrateFromLocalStorage } from '../db/migrate'
import { dbPromise } from '../db/db'

export function useNotes() {
    const [notes, setNotes] = useState<any[]>([])

    useEffect(() => {
        (async () => {
            await migrateFromLocalStorage()
            const all = await repo.getAllNotes()
            setNotes(all)
        })()
    }, [])

    const addNote = async (content: string) => {
        const note = await repo.addNote(content)
        setNotes(prev => [note, ...prev])
    }

    const updateNote = async (id: string, content: string) => {
        await repo.updateNote(id, content)
        setNotes(prev =>
            prev.map(n =>
                n.id === id ? { ...n, content, updatedAt: Date.now() } : n
            )
        )
    }

    const deleteNote = async (id: string) => {
        await repo.deleteNote(id)
        setNotes(prev => prev.filter(n => n.id !== id))
    }

    const importNotes = async (file: File) => {
        const text = await file.text()
        const parsed = JSON.parse(text)

        if (!Array.isArray(parsed.notes)) {
            throw new Error('Invalid notes backup file')
        }

        const db = await dbPromise

        // overwrite DB
        await db.clear('notes')
        for (const note of parsed.notes) {
            await db.put('notes', note)
        }

        // 🔥 update UI immediately
        setNotes(parsed.notes)
    }

    return {
        notes,
        addNote,
        updateNote,
        deleteNote,
        importNotes,
    }
}
