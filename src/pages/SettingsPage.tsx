import { useRef, useState } from 'react';
import { Download, Upload, X } from 'lucide-react';
import type { Theme, SettingsConfig } from '../types';
import { getKeywordColor } from '../utils/helpers';

interface SettingsPageProps {
    settings: SettingsConfig;
    setSettings: (settings: SettingsConfig | ((prev: SettingsConfig) => SettingsConfig)) => void;
    addKeyword: (keyword: string) => void;
    removeKeyword: (keyword: string) => void;
    onExport: () => void;
    onImport: (file: File) => void;
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
    theme,
    isDark,
}: SettingsPageProps) => {
    const [newKeyword, setNewKeyword] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddKeyword = () => {
        addKeyword(newKeyword);
        setNewKeyword('');
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) onImport(file);
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

            {/* Export/Import */}
            <div className="mb-6">
                <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Export & Import</h4>
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

            {/* Colored Keywords */}
            <div className="mb-6">
                <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Colored Keywords</h4>
                <div className={`${theme.bgSecondary} rounded-xl p-4 mb-3`}>
                    {settings.coloredKeywords.map(keyword => (
                        <div key={keyword} className="flex items-center justify-between mb-3 last:mb-0">
                            <span className={`text-sm ${getKeywordColor(keyword, isDark)} font-medium`}>
                                {keyword}:
                            </span>
                            <button
                                onClick={() => removeKeyword(keyword)}
                                className={`${theme.textMuted} hover:text-red-400 transition-colors p-1`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
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
                        <span className={`text-xs ${theme.textMuted}`}>Show complete note content instead of preview</span>
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
