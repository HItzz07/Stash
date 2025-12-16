export interface Note {
    id: string;
    content: string;
    category: 'note' | 'todo' | 'idea' | 'listen' | 'read';
    createdAt: number;
    updatedAt?: number;
}

export interface SettingsConfig {
    syncLocation: 'local' | 'cloud';
    coloredKeywords: string[];
    showFullText: boolean;
    sortBy: 'created' | 'updated';
    sortOrder: 'asc' | 'desc'; // Add this
}

export interface Theme {
    bg: string;
    bgSecondary: string;
    text: string;
    textMuted: string;
    border: string;
    divider: string;
    accent: string;
    accentText: string;
    gradientFrom: string;
    overlay: string;
}
