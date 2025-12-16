import { useState } from 'react';
import type { Note, Theme, SettingsConfig } from '../types';
import { NoteItem } from './NoteItem';

interface NotesListProps {
    notes: Note[];
    onUpdate: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    theme: Theme;
    isDark: boolean;
    settings: SettingsConfig;
}

export const NotesList = ({ notes, onUpdate, onDelete, theme, isDark, settings }: NotesListProps) => {
    const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

    const handleTabToNext = () => {
        if (!expandedNoteId) return;

        const currentIndex = notes.findIndex(n => n.id === expandedNoteId);
        const nextIndex = currentIndex + 1;

        // Close current
        setExpandedNoteId(null);

        // Open next if exists
        if (nextIndex < notes.length) {
            setTimeout(() => {
                setExpandedNoteId(notes[nextIndex].id);
            }, 50);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-4 pb-24 scrollbar-hide">
            {notes.map((note) => {
                const isExpanded = expandedNoteId === note.id;

                return (
                    <NoteItem
                        key={note.id}
                        note={note}
                        isExpanded={isExpanded}
                        onExpand={() => setExpandedNoteId(note.id)}
                        onUpdate={(content) => onUpdate(note.id, content)}
                        onDelete={() => { onDelete(note.id); setExpandedNoteId(null); }}
                        onSave={() => setExpandedNoteId(null)}
                        onTabNext={handleTabToNext}
                        theme={theme}
                        isDark={isDark}
                        showFullText={settings.showFullText}
                        keywords={settings.coloredKeywords}
                    />
                );
            })}
        </div>
    );
};
