import { useState, useRef, useEffect } from 'react';
import { CornerDownLeft } from 'lucide-react';
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
    expandedNoteId: string | null
    setExpandedNoteId: (id: string | null) => void
}


export const NotesList = ({ notes, onUpdate, onDelete, onAdd, theme, isDark, settings, expandedNoteId, setExpandedNoteId }: NotesListProps) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [startY, setStartY] = useState(0);
    const [isAtTop, setIsAtTop] = useState(true);
    const [newNotePosition, setNewNotePosition] = useState<'top' | 'bottom' | null>(null);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const newNoteRef = useRef<HTMLTextAreaElement>(null);


    useEffect(() => {
        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                || window.innerWidth <= 768
                || ('ontouchstart' in window);
            setIsMobile(mobile);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);


    useEffect(() => {
        if (newNotePosition && newNoteRef.current) {
            newNoteRef.current.focus();
        }
    }, [newNotePosition]);


    useEffect(() => {
        // Find matching keyword for suggestion
        if (newNoteContent.length > 0 && !newNoteContent.includes(':')) {
            const matches = settings.coloredKeywords.filter(kw =>
                kw.toLowerCase().startsWith(newNoteContent.toLowerCase()) && kw.toLowerCase() !== newNoteContent.toLowerCase()
            );
            if (matches.length > 0) {
                setSuggestion(matches[0].slice(newNoteContent.length) + ': ');
            } else {
                setSuggestion('');
            }
        } else {
            setSuggestion('');
        }
    }, [newNoteContent, settings.coloredKeywords]);


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
            setNewNotePosition('top');
            setNewNoteContent('');
            setSuggestion('');
        }
        setPullDistance(0);
        setStartY(0);
    };


    const handleBottomClick = () => {
        if (expandedNoteId === null) {
            setNewNotePosition('bottom');
            setNewNoteContent('');
            setSuggestion('');
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
        setSuggestion('');
    };


    const acceptSuggestion = () => {
        if (suggestion) {
            setNewNoteContent(newNoteContent + suggestion);
            setSuggestion('');
            newNoteRef.current?.focus();
        }
    };


    const handleNewNoteKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab' && suggestion) {
            e.preventDefault();
            acceptSuggestion();
        } else if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
            e.preventDefault();
            saveNewNote();
        } else if (e.key === 'Escape') {
            setNewNotePosition(null);
            setNewNoteContent('');
            setSuggestion('');
        }
    };


    const renderNewNoteInput = () => (
        <div className="mb-8 animate-in fade-in duration-200">
            <div className="relative">
                {/* Ghost text overlay */}
                <div
                    className="absolute inset-0 text-[16px] leading-[1.75rem] whitespace-pre-wrap break-words pointer-events-none"
                    style={{
                        fontFamily: 'inherit',
                        padding: '0',
                        margin: '0',
                        letterSpacing: 'inherit',
                        wordSpacing: 'inherit',
                    }}
                >
                    <span className="invisible">{newNoteContent}</span>
                    <span className={`${theme.textMuted} opacity-40`}>{suggestion}</span>
                </div>


                {/* Actual input */}
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
                      placeholder:${theme.textMuted}/50 outline-none resize-none min-h-[60px] relative z-10`}
                    style={{ caretColor: isDark ? '#e8e2d9' : '#2d2a26' }}
                />


                {/* Mobile: Tap to accept suggestion button */}
                {suggestion && (
                    <button
                        onMouseDown={(e) => {
                            e.preventDefault();
                            acceptSuggestion();
                        }}
                        className={`absolute bottom-0 right-0 ${theme.bgSecondary} ${theme.text} px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md hover:opacity-80 transition-opacity z-20`}
                    >
                        <CornerDownLeft className="w-3 h-3" />
                        accept
                    </button>
                )}
            </div>
            <div className={`mt-3 h-[1px] ${theme.divider} w-full`} />
        </div>
    );


    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-24 scrollbar-hide relative"
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                paddingTop: pullDistance > 0 ? `${pullDistance + 16}px` : '16px',
                transition: pullDistance === 0 ? 'padding-top 0.3s ease' : 'none'
            }}
        >
            {/* Pull indicator - inside scroll view at top */}
            {pullDistance > 0 && (
                <div
                    className={`absolute left-6 right-6 flex items-center justify-center ${theme.textMuted} text-xs font-medium`}
                    style={{
                        top: '8px',
                        height: `${pullDistance}px`,
                        opacity: Math.min(pullDistance / 80, 1)
                    }}
                >
                    <div className={`${theme.bgSecondary} px-4 py-2 rounded-full`}>
                        {pullDistance > 80 ? '↓ Release to add note' : '↓ Pull down'}
                    </div>
                </div>
            )}


            {/* New note at top */}
            {newNotePosition === 'top' && renderNewNoteInput()}


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
            {newNotePosition === 'bottom' && renderNewNoteInput()}


            {/* Click area at bottom to add note */}
            {expandedNoteId === null && newNotePosition === null && (
                <div
                    onClick={handleBottomClick}
                    className={`h-24 cursor-pointer transition-all duration-200 flex items-center justify-center group`}
                >
                    <span className={`text-xs font-medium ${theme.textMuted} opacity-40 group-hover:opacity-70 transition-opacity`}>
                        Tap to create note
                    </span>
                </div>
            )}
        </div>
    );
};
