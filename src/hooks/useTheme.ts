import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('stash-theme');
        return saved === 'dark';
    });

    useEffect(() => {
        localStorage.setItem('stash-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return { isDark, setIsDark };
};
