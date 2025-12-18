import { useRef, useEffect, useState } from 'react';
import { X, CornerDownLeft } from 'lucide-react';
import type { Theme, SettingsConfig } from '../types';
import { getKeywordColor, generateColorForKeyword } from '../utils/helpers';

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (content: string) => void;
    theme: Theme;
    settings: SettingsConfig;
    isDark: boolean;
}

export const AddNoteModal = ({ isOpen, onClose, onAdd, theme, settings, isDark }: AddNoteModalProps) => {
    const [input, setInput] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Detect if mobile device
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
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        // Find matching keyword for suggestion
        if (input.length > 0 && !input.includes(':')) {
            const matches = settings.coloredKeywords.filter(kw =>
                kw.toLowerCase().startsWith(input.toLowerCase()) && kw.toLowerCase() !== input.toLowerCase()
            );
            if (matches.length > 0) {
                setSuggestion(matches[0].slice(input.length) + ': ');
            } else {
                setSuggestion('');
            }
        } else {
            setSuggestion('');
        }
    }, [input, settings.coloredKeywords]);

    const handleAdd = () => {
        if (!input.trim()) return;
        onAdd(input);
        setInput('');
        setSuggestion('');
    };

    const acceptSuggestion = () => {
        if (suggestion) {
            setInput(input + suggestion);
            setSuggestion('');
            inputRef.current?.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab' && suggestion) {
            e.preventDefault()
            acceptSuggestion()
            return
        }

        if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
            e.preventDefault()

            const textarea = e.currentTarget
            const value = input
            const cursorPos = textarea.selectionStart

            const beforeCursor = value.slice(0, cursorPos)
            const afterCursor = value.slice(cursorPos)

            const lines = beforeCursor.split('\n')
            const currentLine = lines[lines.length - 1]

            // 🔥 BULLET CONTINUATION LOGIC
            if (currentLine.startsWith('- ')) {
                // If bullet is empty, exit bullet mode
                if (currentLine.trim() === '-') {
                    setInput(beforeCursor + '\n' + afterCursor)
                    requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd = cursorPos + 1
                    })
                    return
                }

                const newText = beforeCursor + '\n- ' + afterCursor
                const newCursorPos = cursorPos + 3

                setInput(newText)

                requestAnimationFrame(() => {
                    textarea.selectionStart = textarea.selectionEnd = newCursorPos
                })

                return
            }

            // Default: submit note
            handleAdd()
        }

        if (e.key === 'Escape') {
            setSuggestion('')
        }
    }

    const getKeywordDisplay = () => {
        for (const keyword of settings.coloredKeywords) {
            if (input.toLowerCase().startsWith(`${keyword}:`)) {
                const defaultKeywords = ['todo', 'idea', 'listen', 'read'];
                const isDefault = defaultKeywords.includes(keyword);
                const displayText = keyword.charAt(0).toUpperCase() + keyword.slice(1);

                if (isDefault) {
                    return (
                        <span className={getKeywordColor(keyword, isDark)}>
                            {displayText}
                        </span>
                    );
                } else {
                    return (
                        <span style={{ color: generateColorForKeyword(keyword, isDark) }}>
                            {displayText}
                        </span>
                    );
                }
            }
        }
        return null;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <div
                className={`absolute inset-0 ${theme.overlay} backdrop-blur-sm transition-opacity`}
                onClick={onClose}
            />
            <div className={`${theme.bg} w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative z-50 ${theme.border} border`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-serif text-xl ${theme.text}`}>New Note</h3>
                    <button onClick={onClose} className={`${theme.textMuted} hover:${theme.text}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Input with Ghost Text Overlay */}
                <div className="relative mb-3">
                    <div className="relative">
                        {/* Combined text layer for proper alignment */}
                        <div
                            className="absolute inset-0 text-lg leading-relaxed whitespace-pre-wrap break-words pointer-events-none"
                            style={{
                                fontFamily: 'inherit',
                                padding: '0',
                                margin: '0',
                                letterSpacing: 'inherit',
                                wordSpacing: 'inherit',
                            }}
                        >
                            <span className="invisible">{input}</span>
                            <span className={`${theme.textMuted} opacity-40`}>{suggestion}</span>
                        </div>

                        {/* Actual input */}
                        <textarea
                            ref={inputRef}
                            autoFocus
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="capture a thought..."
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            className={`w-full bg-transparent text-lg ${theme.text} placeholder:${theme.textMuted}/50 
                          outline-none resize-none leading-relaxed h-32 relative z-10`}
                            style={{
                                caretColor: isDark ? '#e8e2d9' : '#2d2a26',
                            }}
                        />
                    </div>

                    {/* Mobile: Tap to accept suggestion button */}
                    {suggestion && (
                        <button
                            onClick={acceptSuggestion}
                            className={`absolute -bottom-2 right-0 ${theme.bgSecondary} ${theme.text} px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md hover:opacity-80 transition-opacity z-20`}
                        >
                            <CornerDownLeft className="w-3 h-3" />
                            accept
                        </button>
                    )}
                </div>

                <div className={`flex justify-between items-center ${theme.border} border-t pt-4 mt-6`}>
                    <div className="flex items-center gap-2">
                        <div className="text-xs font-medium">
                            {getKeywordDisplay()}
                        </div>
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={!input.trim()}
                        className={`${theme.accent} ${theme.accentText} px-5 py-2.5 rounded-xl font-medium text-sm
                        disabled:opacity-50 hover:opacity-90 transition-opacity shadow-lg`}
                    >
                        Add & Stash
                    </button>
                </div>
                <p className={`text-xs ${theme.textMuted} mt-2 text-center`}>
                    {isMobile
                        ? (suggestion ? 'tap accept button to complete' : 'tap button to add note')
                        : (suggestion ? 'tab to complete • enter to add' : 'enter to add • shift+enter for new line')
                    }
                </p>
            </div>
        </div>
    );
};
