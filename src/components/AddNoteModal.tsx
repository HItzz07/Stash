import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Theme, SettingsConfig } from '../types';
import { getKeywordColor } from '../utils/helpers';

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
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleAdd = () => {
        if (!input.trim()) return;
        onAdd(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
        }
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
                <textarea
                    ref={inputRef}
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Capture a thought..."
                    className={`w-full bg-transparent text-lg ${theme.text} placeholder:${theme.textMuted}/50 
                      outline-none resize-none leading-relaxed h-32 mb-4`}
                />
                <div className={`flex justify-between items-center ${theme.border} border-t pt-4`}>
                    <div className="text-xs font-medium pl-1">
                        {settings.coloredKeywords.map(keyword => {
                            if (input.toLowerCase().startsWith(`${keyword}:`)) {
                                return <span key={keyword} className={getKeywordColor(keyword, isDark)}>{keyword.charAt(0).toUpperCase() + keyword.slice(1)}</span>;
                            }
                            return null;
                        })}
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
                    Press Enter to add • Shift+Enter for new line
                </p>
            </div>
        </div>
    );
};
