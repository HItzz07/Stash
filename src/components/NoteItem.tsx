import { useRef, useEffect } from 'react';
import { Check, Trash2 } from 'lucide-react';
import type { Note, Theme } from '../types';
import { formatTime, getKeywordColor, generateColorForKeyword } from '../utils/helpers';

interface NoteItemProps {
    note: Note;
    isExpanded: boolean;
    onExpand: () => void;
    onUpdate: (content: string) => void;
    onDelete: () => void;
    onSave: () => void;
    theme: Theme;
    isDark: boolean;
    showFullText: boolean;
}

export const NoteItem = ({
    note,
    isExpanded,
    onExpand,
    onUpdate,
    onDelete,
    onSave,
    theme,
    isDark,
    showFullText,
}: NoteItemProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isExpanded && textareaRef.current) {
            const el = textareaRef.current;
            el.focus();
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
            el.setSelectionRange(el.value.length, el.value.length);
        }
    }, [isExpanded]);

    const handleTextChange = (newContent: string) => {
        onUpdate(newContent);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const getKeywordStyle = (keyword: string) => {
        const defaultKeywords = ['todo', 'idea', 'listen', 'read'];
        if (defaultKeywords.includes(keyword)) {
            return {}; // Use Tailwind class
        }
        return { color: generateColorForKeyword(keyword, isDark) };
    };

    const getKeywordClass = (keyword: string) => {
        const defaultKeywords = ['todo', 'idea', 'listen', 'read'];
        if (defaultKeywords.includes(keyword)) {
            return getKeywordColor(keyword, isDark);
        }
        return ''; // Use inline style instead
    };

    const renderFullText = () => {
        const lines = note.content.split('\n');

        return (
            <div className="whitespace-pre-wrap">
                {lines.map((line, idx) => {
                    const parts = line.split(/^([\w]+:)/i);

                    if (parts.length > 1 && parts[1]) {
                        const tag = parts[1].toLowerCase().replace(':', '');
                        const colorClass = getKeywordClass(tag);
                        const colorStyle = getKeywordStyle(tag);

                        return (
                            <div key={idx} className="text-[16px] leading-[1.75rem]">
                                <span
                                    className={`${colorClass} font-bold`}
                                    style={colorStyle}
                                >
                                    {parts[1]}
                                </span>
                                <span className={theme.text}>{parts[2]}</span>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className={`${theme.text} text-[16px] leading-[1.75rem]`}>
                            {line || '\u00A0'}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderPreview = () => {
        const lines = note.content.split('\n');
        const firstLine = lines[0];
        const hasMore = lines.length > 1 || firstLine.length > 50;

        const parts = firstLine.split(/^([\w]+:)/i);
        let contentNode;

        if (parts.length > 1 && parts[1]) {
            const tag = parts[1].toLowerCase().replace(':', '');
            const colorClass = getKeywordClass(tag);
            const colorStyle = getKeywordStyle(tag);

            contentNode = (
                <div className={`truncate pr-4 text-[16px]`}>
                    <span
                        className={`${colorClass} font-bold mr-1`}
                        style={colorStyle}
                    >
                        {parts[1]}
                    </span>
                    <span className={theme.text}>{parts[2]}</span>
                </div>
            );
        } else {
            contentNode = <div className={`truncate pr-4 ${theme.text} text-[16px]`}>{firstLine}</div>;
        }

        return (
            <div className="relative">
                {contentNode}
                {hasMore && (
                    <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l ${theme.gradientFrom} to-transparent pointer-events-none`} />
                )}
            </div>
        );
    };

    const shouldShowEditMode = isExpanded;
    const shouldShowFullText = showFullText && !isExpanded;

    return (
        <div
            className={`group relative transition-all duration-300 ease-in-out mb-8 ${shouldShowEditMode ? '' : 'cursor-pointer'}`}
            onClick={() => !shouldShowEditMode && onExpand()}
        >
            {shouldShowEditMode ? (
                <div className="flex gap-3 w-full items-start">
                    <div className="flex-1 min-w-0">
                        <textarea
                            ref={textareaRef}
                            value={note.content}
                            onChange={(e) => handleTextChange(e.target.value)}
                            onBlur={() => onSave()}
                            className={`w-full bg-transparent text-[16px] leading-[1.75rem] ${theme.text} 
                         outline-none resize-none overflow-hidden font-normal p-0 m-0 block`}
                            spellCheck={false}
                        />
                    </div>

                    <div className="flex gap-2 flex-none">
                        <button
                            onMouseDown={(e) => { e.preventDefault(); onSave(); }}
                            className={`p-2 ${isDark ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-emerald-600 hover:bg-emerald-50'} rounded-full transition-colors`}
                            title="Save"
                        >
                            <Check className="w-4 h-4" />
                        </button>

                        <button
                            onMouseDown={(e) => { e.preventDefault(); onDelete(); }}
                            className={`p-2 ${isDark ? 'text-red-400 hover:bg-red-500/20' : 'text-red-400 hover:bg-red-50'} rounded-full transition-colors`}
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : shouldShowFullText ? (
                <div>{renderFullText()}</div>
            ) : (
                <div>{renderPreview()}</div>
            )}

            <div className="mt-2 relative">
                <div className="flex items-center justify-between">
                    <span className={`text-[10px] ${theme.textMuted} font-medium tracking-wide`}>
                        {note.updatedAt ? `Edited ${formatTime(note.updatedAt)}` : formatTime(note.createdAt)}
                    </span>
                </div>
                <div className={`mt-3 h-[1px] ${theme.divider} w-full`} />
            </div>
        </div>
    );
};
