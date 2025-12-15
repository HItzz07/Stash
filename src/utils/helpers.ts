import type { Note } from '../types';

// UUID generator with fallback
export const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const detectCategory = (text: string): Note['category'] => {
    const lower = text.toLowerCase();
    if (lower.startsWith('todo:') || lower.startsWith('- [ ]')) return 'todo';
    if (lower.startsWith('idea:')) return 'idea';
    if (lower.startsWith('listen:')) return 'listen';
    if (lower.startsWith('read:')) return 'read';
    return 'note';
};

export const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

// Generate consistent color for a keyword using HSL
const stringToHue = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
};

const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

export const generateColorForKeyword = (keyword: string, isDark: boolean): string => {
    const hue = stringToHue(keyword);
    const saturation = isDark ? 65 : 70;
    const lightness = isDark ? 65 : 45;
    return hslToHex(hue, saturation, lightness);
};

export const getKeywordColor = (keyword: string, isDark: boolean) => {
    // Default keywords with predefined colors
    if (keyword === 'todo') return isDark ? 'text-[#E89B6A]' : 'text-[#C27A45]';
    if (keyword === 'idea') return isDark ? 'text-[#7FA87F]' : 'text-[#5A7D5A]';
    if (keyword === 'listen') return isDark ? 'text-[#B39A85]' : 'text-[#8C7A6B]';
    if (keyword === 'read') return isDark ? 'text-[#8E8EBD]' : 'text-[#6B6B99]';

    // Generate consistent color for custom keywords
    const color = generateColorForKeyword(keyword, isDark);
    return `text-[${color}]`;
};
