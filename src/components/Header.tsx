import { Search, Settings, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Theme } from '../types';

interface HeaderProps {
    isSearchMode: boolean;
    setIsSearchMode: (value: boolean) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    isDark: boolean;
    setIsDark: (value: boolean) => void;
    notesCount: number;
    theme: Theme;
}

export const Header = ({
    isSearchMode,
    setIsSearchMode,
    searchQuery,
    setSearchQuery,
    isDark,
    setIsDark,
    notesCount,
    theme,
}: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isSettingsPage = location.pathname === '/settings';

    return (
        <div className={`flex-none pt-14 pb-4 px-6 flex flex-col items-center z-20 ${theme.bg}/95 backdrop-blur-sm ${theme.border} border-b`}>
            {!isSearchMode ? (
                <>
                    <h1 className={`font-serif text-4xl ${theme.text} tracking-tight mb-1`}>
                        {isSettingsPage ? 'Settings' : 'Stash'}
                    </h1>
                    {!isSettingsPage && (
                        <p className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider opacity-80`}>
                            {notesCount} notes captured
                        </p>
                    )}
                    <>
                        {isSettingsPage ? (
                            <button
                                onClick={() => navigate('/')}
                                className={`absolute left-6 top-16 ${theme.textMuted} hover:${theme.text} transition-colors`}
                                title="Back"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className={`absolute left-6 top-16 ${theme.textMuted} hover:${theme.text} transition-colors`}
                                    title="Settings"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setIsSearchMode(true)}
                                    className={`absolute right-6 top-16 ${theme.textMuted} hover:${theme.text} transition-colors`}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`absolute ${isSettingsPage ? 'right-6' : 'left-14'} top-16 ${theme.textMuted} hover:${theme.text} transition-colors`}
                            title="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </>
                </>
            ) : (
                <div className="w-full flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className={`w-4 h-4 absolute left-3 top-3 ${theme.textMuted}`} />
                        <input
                            autoFocus
                            placeholder="Search..."
                            className={`w-full ${theme.bgSecondary} rounded-xl py-2.5 pl-9 pr-4 ${theme.text} text-sm outline-none`}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { setIsSearchMode(false); setSearchQuery(''); }}
                        className={`${theme.text} text-sm font-medium`}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};
