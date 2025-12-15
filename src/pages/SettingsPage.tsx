import { useRef, useState } from 'react';
import { Download, Upload, X } from 'lucide-react';
import type { Theme, SettingsConfig } from '../types';
import { getKeywordColor, generateColorForKeyword } from '../utils/helpers';

interface SettingsPageProps {
    settings: SettingsConfig;
    setSettings: (settings: SettingsConfig | ((prev: SettingsConfig) => SettingsConfig)) => void;
    addKeyword: (keyword: string) => void;
    removeKeyword: (keyword: string) => void;
    onExport: () => void;
    onImport: (file: File) => void;
    onExportSettings: () => void;
    onImportSettings: (file: File) => void;
    theme: Theme;
    isDark: boolean;
}

export const SettingsPage = ({
    settings,
    setSettings,
    addKeyword,
    removeKeyword,
    onExport,
    onImport,
    onExportSettings,
    onImportSettings,
    theme,
    isDark,
}: SettingsPageProps) => {
    const [newKeyword, setNewKeyword] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const settingsFileInputRef = useRef<HTMLInputElement>(null);

    const handleAddKeyword = () => {
        addKeyword(newKeyword);
        setNewKeyword('');
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) onImport(file);
    };

    const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) onImportSettings(file);
    };

    const getColorStyle = (keyword: string) => {
        const defaultKeywords = ['todo', 'idea', 'listen', 'read'];
        if (defaultKeywords.includes(keyword)) {
            return {};
        }
        return { backgroundColor: generateColorForKeyword(keyword, isDark) + '20', color: generateColorForKeyword(keyword, isDark) };
    };

    const getColorClass = (keyword: string) => {
        const defaultKeywords = ['todo', 'idea', 'listen', 'read'];
        if (!defaultKeywords.includes(keyword)) return '';

        if (keyword === 'todo') return isDark ? 'bg-[#E89B6A]/20 text-[#E89B6A]' : 'bg-[#C27A45]/20 text-[#C27A45]';
        if (keyword === 'idea') return isDark ? 'bg-[#7FA87F]/20 text-[#7FA87F]' : 'bg-[#5A7D5A]/20 text-[#5A7D5A]';
        if (keyword === 'listen') return isDark ? 'bg-[#B39A85]/20 text-[#B39A85]' : 'bg-[#8C7A6B]/20 text-[#8C7A6B]';
        if (keyword === 'read') return isDark ? 'bg-[#8E8EBD]/20 text-[#8E8EBD]' : 'bg-[#6B6B99]/20 text-[#6B6B99]';
        return '';
    };

    return (
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
            {/* Sync Location */}
            <div className="mb-6">
                <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Storage & Sync</h4>
                <div className={`${theme.bgSecondary} rounded-xl p-4`}>
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className={`text-sm ${theme.text}`}>Local Storage</span>
                        <input
                            type="radio"
                            checked={settings.syncLocation === 'local'}
                            onChange={() => setSettings(prev => ({ ...prev, syncLocation: 'local' }))}
                            className="w-4 h-4"
                        />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer mt-3">
                        <span className={`text-sm ${theme.textMuted}`}>Cloud Sync (Coming Soon)</span>
                        <input
                            type="radio"
                            disabled
                            checked={settings.syncLocation === 'cloud'}
                            className="w-4 h-4"
                        />
                    </label>
                </div>
            </div>

            {/* Export/Import Notes */}
            <div className="mb-6">
                <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Notes Backup</h4>
                <div className="flex gap-3">
                    <button
                        onClick={onExport}
                        className={`flex-1 ${theme.bgSecondary} hover:${theme.accent} hover:${theme.accentText} px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2`}
                    >
                        <Download className="w-4 h-4" />
                        Export Notes
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 ${theme.bgSecondary} hover:${theme.accent} hover:${theme.accentText} px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2`}
                    >
                        <Upload className="w-4 h-4" />
                        Import Notes
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Export/Import Settings */}
            <div className="mb-6">
                <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Settings Backup</h4>
                <div className="flex gap-3">
                    <button
                        onClick={onExportSettings}
                        className={`flex-1 ${theme.bgSecondary} hover:${theme.accent} hover:${theme.accentText} px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2`}
                    >
                        <Download className="w-4 h-4" />
                        Export Settings
                    </button>
                    <button
                        onClick={() => settingsFileInputRef.current?.click()}
                        className={`flex-1 ${theme.bgSecondary} hover:${theme.accent} hover:${theme.accentText} px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2`}
                    >
                        <Upload className="w-4 h-4" />
                        Import Settings
                    </button>
                    <input
                        ref={settingsFileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImportSettings}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Colored Keywords - Pill Style */}
            <div className="mb-6">
                <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Colored Keywords</h4>
                <div className={`${theme.bgSecondary} rounded-xl p-4 mb-3`}>
                    <div className="flex flex-wrap gap-2">
                        {settings.coloredKeywords.map(keyword => (
                            <span
                                key={keyword}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getColorClass(keyword)}`}
                                style={getColorStyle(keyword)}
                            >
                                {keyword}:
                                <button
                                    onClick={() => removeKeyword(keyword)}
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <input
                        value={newKeyword}
                        onChange={e => setNewKeyword(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddKeyword()}
                        placeholder="Add new keyword..."
                        className={`flex-1 ${theme.bgSecondary} rounded-xl py-3 px-4 ${theme.text} text-sm outline-none`}
                    />
                    <button
                        onClick={handleAddKeyword}
                        className={`${theme.accent} ${theme.accentText} px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity`}
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Show Full Text */}
            <div className="mb-2">
                <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Note Display</h4>
                <label className={`flex items-center justify-between cursor-pointer ${theme.bgSecondary} rounded-xl p-4`}>
                    <div>
                        <span className={`text-sm ${theme.text} block mb-1`}>Always show full text</span>
                        <span className={`text-xs ${theme.textMuted}`}>Display complete note content (click to edit)</span>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.showFullText}
                        onChange={e => setSettings(prev => ({ ...prev, showFullText: e.target.checked }))}
                        className="w-5 h-5"
                    />
                </label>
            </div>
        </div>
    );
};
