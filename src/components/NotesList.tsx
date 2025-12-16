import { useState, useRef, useEffect } from 'react';
import type { Note, Theme, SettingsConfig } from '../types';
import { NoteItem } from './NoteItem';

interface NotesListProps {
    notes: Note[];
    onUpdate: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    onAdd: (content: string) => void;
    theme: Theme;
    isDark: boolean;
    settings: SettingsConfig;
}

export const NotesList = ({ notes, onUpdate, onDelete, onAdd, theme, isDark, settings }: NotesListProps) => {
    const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
    const [pullDistance, setPullDistance] = useState(0);
    const [startY, setStartY] = useState(0);
    const [isAtTop, setIsAtTop] = useState(true);
    const [newNotePosition, setNewNotePosition] = useState<'top' | 'bottom' | null>(null);
    const [newNoteContent, setNewNoteContent] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const newNoteRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (newNotePosition && newNoteRef.current) {
            newNoteRef.current.focus();
        }
    }, [newNotePosition]);

    const handleScroll = () => {
        if (scrollRef.current) {
            setIsAtTop(scrollRef.current.scrollTop === 0);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isAtTop && expandedNoteId === null) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isAtTop || expandedNoteId !== null || startY === 0) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0 && distance < 120) {
            setPullDistance(distance);
        }
    };

    const handleTouchEnd = () => {
        if (pullDistance > 80) {
            // Trigger add note at top
            setNewNotePosition('top');
            setNewNoteContent('');
        }
        setPullDistance(0);
        setStartY(0);
    };

    const handleBottomClick = () => {
        if (expandedNoteId === null) {
            setNewNotePosition('bottom');
            setNewNoteContent('');
        }
    };

    const handleTabToNext = () => {
        if (!expandedNoteId) return;

        const currentIndex = notes.findIndex(n => n.id === expandedNoteId);
        const nextIndex = currentIndex + 1;

        setExpandedNoteId(null);

        if (nextIndex < notes.length) {
            setTimeout(() => {
                setExpandedNoteId(notes[nextIndex].id);
            }, 50);
        }
    };

    const saveNewNote = () => {
        if (newNoteContent.trim()) {
            onAdd(newNoteContent);
        }
        setNewNotePosition(null);
        setNewNoteContent('');
    };

    const handleNewNoteKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
            e.preventDefault();
            saveNewNote();
        } else if (e.key === 'Escape') {
            setNewNotePosition(null);
            setNewNoteContent('');
        }
    };

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-24 scrollbar-hide relative"
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                transform: `translateY(${pullDistance}px)`,
                transition: pullDistance === 0 ? 'transform 0.3s ease' : 'none'
            }}
        >
            {/* Pull indicator */}
            {pullDistance > 0 && (
                <div
                    className={`absolute top-0 left-0 right-0 flex items-center justify-center ${theme.textMuted} text-xs font-medium`}
                    style={{ height: `${pullDistance}px`, opacity: pullDistance / 80 }}
                >
                    {pullDistance > 80 ? '↓ Release to add note' : '↓ Pull down to add note'}
                </div>
            )}

            <div className="pt-4">
                {/* New note at top */}
                {newNotePosition === 'top' && (
                    <div className="mb-8 animate-in fade-in duration-200">
                        <textarea
                            ref={newNoteRef}
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value.toLowerCase())}
                            onKeyDown={handleNewNoteKeyDown}
                            onBlur={saveNewNote}
                            placeholder="capture a thought..."
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            className={`w-full bg-transparent text-[16px] leading-[1.75rem] ${theme.text} 
                          placeholder:${theme.textMuted}/50 outline-none resize-none min-h-[60px]`}
                        />
                        <div className={`mt-3 h-[1px] ${theme.divider} w-full`} />
                    </div>
                )}

                {/* Existing notes */}
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

                {/* New note at bottom */}
                {newNotePosition === 'bottom' && (
                    <div className="mb-8 animate-in fade-in duration-200">
                        <textarea
                            ref={newNoteRef}
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value.toLowerCase())}
                            onKeyDown={handleNewNoteKeyDown}
                            onBlur={saveNewNote}
                            placeholder="capture a thought..."
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            className={`w-full bg-transparent text-[16px] leading-[1.75rem] ${theme.text} 
                          placeholder:${theme.textMuted}/50 outline-none resize-none min-h-[60px]`}
                        />
                        <div className={`mt-3 h-[1px] ${theme.divider} w-full`} />
                    </div>
                )}

                {/* Click area at bottom to add note */}
                {expandedNoteId === null && newNotePosition === null && (
                    <div
                        onClick={handleBottomClick}
                        className={`h-24 cursor-pointer transition-all duration-200 flex items-center justify-center group`}
                    >
                        <div className={`${theme.textMuted} opacity-40 group-hover:opacity-70 transition-opacity flex flex-col items-center gap-1`}>
                            <div className="text-2xl">+</div>
                            <span className="text-xs font-medium">Tap to create note</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
