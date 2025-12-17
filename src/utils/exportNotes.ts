import { getAllNotes } from '../db/notesRepository'

export async function exportNotesAsJSON() {
    const notes = await getAllNotes()

    const payload = {
        version: 1,
        exportedAt: Date.now(),
        notes,
    }

    const blob = new Blob(
        [JSON.stringify(payload, null, 2)],
        { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stash-notes-backup.json'
    a.click()
    URL.revokeObjectURL(url)
}
