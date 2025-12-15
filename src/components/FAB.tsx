import { Plus } from 'lucide-react';
import type { Theme } from '../types';

interface FABProps {
    onClick: () => void;
    theme: Theme;
}

export const FAB = ({ onClick, theme }: FABProps) => {
    return (
        <button
            onClick={onClick}
            className={`absolute bottom-8 right-6 w-14 h-14 ${theme.accent} ${theme.accentText} rounded-full 
                 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 
                 flex items-center justify-center z-30`}
        >
            <Plus className="w-7 h-7" />
        </button>
    );
};
