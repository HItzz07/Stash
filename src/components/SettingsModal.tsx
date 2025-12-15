import { useRef, useState } from 'react';
import { X, Download, Upload } from 'lucide-react';
import type { Theme, SettingsConfig } from '../types';
import { getKeywordColor } from '../utils/helpers';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: SettingsConfig;
    setSettings: (settings: SettingsConfig | ((prev: SettingsConfig) => SettingsConfig)) => void;
    addKeyword: (keyword: string) => void;
    removeKeyword: (keyword: string) => void;
    onExport: () => void;
    onImport: (file: File) => void;
    theme: Theme;
    isDark: boolean;
}

export const SettingsModal = ({
    isOpen,
    onClose,
    settings,
    setSettings,
    addKeyword,
    removeKeyword,
    onExport,
    onImport,
    theme,
    isDark,
}: SettingsModalProps) => {
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            <div
                className={`absolute inset-0 ${theme.overlay} backdrop-blur-sm transition-opacity`}
                onClick={onClose}
            />
            <div className={`${theme.bg} w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative z-50 ${theme.border} border max-h-[80vh] overflow-y-auto`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`font-serif text-2xl ${theme.text}`}>Settings</h3>
                    <button onClick={onClose} className={`${theme.textMuted} hover:${theme.text}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sync Location */}
                <div className="mb-6">
                    <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Storage & Sync</h4>
                    <div className={`${theme.bgSecondary} rounded-xl p-3`}>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className={`text-sm ${theme.text}`}>Local Storage</span>
                            <input
                                type="radio"
                                checked={settings.syncLocation === 'local'}
                                onChange={() => setSettings(prev => ({ ...prev, syncLocation: 'local' }))}
                                className="w-4 h-4"
                            />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer mt-2">
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
                    <div className="flex gap-2">
                        <button
                            onClick={onExport}
                            className={`flex-1 ${theme.bgSecondary} hover:${theme.accent} hover:${theme.accentText} px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2`}
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex-1 ${theme.bgSecondary} hover:${theme.accent} hover:${theme.accentText} px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2`}
                        >
                            <Upload className="w-4 h-4" />
                            Import
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
                    <div className={`${theme.bgSecondary} rounded-xl p-3 mb-2`}>
                        {settings.coloredKeywords.map(keyword => (
                            <div key={keyword} className="flex items-center justify-between mb-2">
                                <span className={`text-sm ${getKeywordColor(keyword, isDark)} font-medium`}>
                                    {keyword}:
                                </span>
                                <button
                                    onClick={() => removeKeyword(keyword)}
                                    className={`${theme.textMuted} hover:text-red-400 transition-colors`}
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
                            className={`flex-1 ${theme.bgSecondary} rounded-xl py-2 px-3 ${theme.text} text-sm outline-none`}
                        />
                        <button
                            onClick={handleAddKeyword}
                            className={`${theme.accent} ${theme.accentText} px-4 py-2 rounded-xl font-medium text-sm`}
                        >
                            Add
                        </button>
                    </div>
                </div>
                {/* Show Full Text */}
                <div className="mb-2">
                    <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Note Display</h4>
                    <label className={`flex items-center justify-between cursor-pointer ${theme.bgSecondary} rounded-xl p-3`}>
                        <span className={`text-sm ${theme.text}`}>Always show full text</span>
                        <input
                            type="checkbox"
                            checked={settings.showFullText}
                            onChange={e => setSettings(prev => ({ ...prev, showFullText: e.target.checked }))}
                            className="w-4 h-4"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};
