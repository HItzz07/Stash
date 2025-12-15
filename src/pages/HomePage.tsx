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

    const filteredNotes = useMemo(() => {
        if (!searchQuery) return notes;
        return notes.filter(n => n.content.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [notes, searchQuery]);

    const handleAddNote = (content: string) => {
        onAdd(content);
        setIsModalOpen(false);
    };

    return (
        <>
            <NotesList
                notes={filteredNotes}
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
