import { useState, useEffect } from 'react';
import type { Note } from '../types';
import { detectCategory, generateUUID } from '../utils/helpers';

export const useNotes = () => {
    const [notes, setNotes] = useState<Note[]>(() => {
        const saved = localStorage.getItem('stash-notes');
        return saved ? JSON.parse(saved) : [
            { id: '1', content: 'todo: call insurance about claim\n- Ask about dental coverage\n- Confirm deductible', category: 'todo', createdAt: Date.now() },
            { id: '2', content: 'listen: Podcast Freakonomics ep latest', category: 'listen', createdAt: Date.now() - 3600000 },
        ];
    });

    useEffect(() => {
        localStorage.setItem('stash-notes', JSON.stringify(notes));
    }, [notes]);

    const addNote = (content: string) => {
        const newNote: Note = {
            id: generateUUID(),
            content,
            category: detectCategory(content),
            createdAt: Date.now(),
        };
        setNotes([newNote, ...notes]);
    };

    const updateNote = (id: string, newContent: string) => {
        setNotes(prev => {
            const updated = prev.map(n =>
                n.id === id ? {
                    ...n,
                    content: newContent,
                    category: detectCategory(newContent),
                    updatedAt: Date.now()
                } : n
            );
            return updated.sort((a, b) => {
                const timeA = a.updatedAt || a.createdAt;
                const timeB = b.updatedAt || b.createdAt;
                return timeB - timeA;
            });
        });
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    const exportNotes = () => {
        const dataStr = JSON.stringify(notes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stash-notes-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const importNotes = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target?.result as string);
                setNotes(imported);
            } catch (error) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    return { notes, addNote, updateNote, deleteNote, exportNotes, importNotes };
};
