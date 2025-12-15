import { useState, useEffect } from 'react';
import type { SettingsConfig } from '../types';

export const useSettings = () => {
    const [settings, setSettings] = useState<SettingsConfig>(() => {
        const saved = localStorage.getItem('stash-settings');
        return saved ? JSON.parse(saved) : {
            syncLocation: 'local',
            coloredKeywords: ['todo', 'idea', 'listen', 'read'],
            showFullText: false,
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

    const exportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stash-settings-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const importSettings = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target?.result as string);
                setSettings(imported);
            } catch (error) {
                alert('Invalid settings file');
            }
        };
        reader.readAsText(file);
    };

    return { settings, setSettings, addKeyword, removeKeyword, exportSettings, importSettings };
};
