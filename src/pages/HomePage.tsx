import { useState, useMemo } from 'react';
import type { Theme, SettingsConfig } from '../types';
import { NotesList } from '../components/NotesList';
import { FAB } from '../components/FAB';
import { AddNoteModal } from '../components/AddNoteModal';

interface HomePageProps {
    notes: any[];
    onUpdate: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    onAdd: (content: string) => void;
    theme: Theme;
    isDark: boolean;
    settings: SettingsConfig;
    searchQuery: string;
}

export const HomePage = ({
    notes,
    onUpdate,
    onDelete,
    onAdd,
    theme,
    isDark,
    settings,
    searchQuery
}: HomePageProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredAndSortedNotes = useMemo(() => {
        let filtered = notes;

        // Filter by search query
        if (searchQuery) {
            filtered = notes.filter(n => n.content.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Sort based on settings
        const sorted = [...filtered].sort((a, b) => {
            if (settings.sortBy === 'updated') {
                const timeA = a.updatedAt || a.createdAt;
                const timeB = b.updatedAt || b.createdAt;
                return timeB - timeA;
            } else {
                // Default: sort by created
                return b.createdAt - a.createdAt;
            }
        });

        return sorted;
    }, [notes, searchQuery, settings.sortBy]);

    const handleAddNote = (content: string) => {
        onAdd(content);
        setIsModalOpen(false);
    };

    return (
        <>
            <NotesList
                notes={filteredAndSortedNotes}
                onUpdate={onUpdate}
                onDelete={onDelete}
                theme={theme}
                isDark={isDark}
                settings={settings}
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
    );
};
