import type { Theme } from '../types';

export const getTheme = (isDark: boolean): Theme => ({
    bg: isDark ? 'bg-[#1a1816]' : 'bg-[#fbf9f6]',
    bgSecondary: isDark ? 'bg-[#252220]' : 'bg-[#f3eee8]',
    text: isDark ? 'text-[#e8e2d9]' : 'text-[#2d2a26]',
    textMuted: isDark ? 'text-[#8c8883]' : 'text-[#8c8883]',
    border: isDark ? 'border-[#3a3632]' : 'border-[#e8e2d9]',
    divider: isDark ? 'bg-[#3a3632]' : 'bg-[#e8e2d9]',
    accent: isDark ? 'bg-[#e8e2d9]' : 'bg-[#2d2a26]',
    accentText: isDark ? 'text-[#1a1816]' : 'text-[#fbf9f6]',
    gradientFrom: isDark ? 'from-[#1a1816]' : 'from-[#fbf9f6]',
    overlay: isDark ? 'bg-[#000000]/40' : 'bg-[#2d2a26]/20',
});
