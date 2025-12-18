import { useState, useMemo } from 'react'
import type { Theme, SettingsConfig } from '../types'
import { NotesList } from '../components/NotesList'
import { FAB } from '../components/FAB'
import { AddNoteModal } from '../components/AddNoteModal'

interface HomePageProps {
    notes: any[]
    onUpdate: (id: string, content: string) => void
    onDelete: (id: string) => void
    onAdd: (content: string) => void
    theme: Theme
    isDark: boolean
    settings: SettingsConfig
    searchQuery: string
}

export const HomePage = ({
    notes,
    onUpdate,
    onDelete,
    onAdd,
    theme,
    isDark,
    settings,
    searchQuery,
}: HomePageProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null)

    const filteredAndSortedNotes = useMemo(() => {
        let filtered = notes

        if (searchQuery) {
            filtered = notes.filter(n =>
                n.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // 🔥 Freeze sorting while editing
        if (expandedNoteId) {
            return filtered
        }

        return [...filtered].sort((a, b) => {
            let timeA: number
            let timeB: number

            if (settings.sortBy === 'updated') {
                timeA = a.updatedAt ?? a.createdAt
                timeB = b.updatedAt ?? b.createdAt
            } else {
                timeA = a.createdAt
                timeB = b.createdAt
            }

            return settings.sortOrder === 'desc'
                ? timeB - timeA
                : timeA - timeB
        })
    }, [
        notes,
        searchQuery,
        settings.sortBy,
        settings.sortOrder,
        expandedNoteId,
    ])

    const handleAddNote = (content: string) => {
        onAdd(content)
        setIsModalOpen(false)
    }

    return (
        <>
            <NotesList
                notes={filteredAndSortedNotes}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAdd={onAdd}
                theme={theme}
                isDark={isDark}
                settings={settings}
                expandedNoteId={expandedNoteId}
                setExpandedNoteId={setExpandedNoteId}
            />

            <FAB onClick={() => setIsModalOpen(true)} theme={theme} />

            <AddNoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddNote}
                theme={theme}
                settings={settings}
                isDark={isDark}
            />
        </>
    )
}
