import { useState, useEffect } from 'react';
import type { SettingsConfig } from '../types';

export const useSettings = () => {
    const [settings, setSettings] = useState<SettingsConfig>(() => {
        const saved = localStorage.getItem('stash-settings');
        return saved ? JSON.parse(saved) : {
            syncLocation: 'local',
            coloredKeywords: ['todo', 'idea', 'listen', 'read'],
            showFullText: false,  // Changed from defaultExpandMode
        };
    });

    useEffect(() => {
        localStorage.setItem('stash-settings', JSON.stringify(settings));
    }, [settings]);

    const addKeyword = (keyword: string) => {
        if (!keyword.trim() || settings.coloredKeywords.includes(keyword.toLowerCase())) return;
        setSettings(prev => ({
            ...prev,
            coloredKeywords: [...prev.coloredKeywords, keyword.toLowerCase()]
        }));
    };

    const removeKeyword = (keyword: string) => {
        setSettings(prev => ({
            ...prev,
            coloredKeywords: prev.coloredKeywords.filter(k => k !== keyword)
        }));
    };

    return { settings, setSettings, addKeyword, removeKeyword };
};
