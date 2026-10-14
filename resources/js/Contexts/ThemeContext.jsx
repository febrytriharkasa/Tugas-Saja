import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'light';
        return localStorage.getItem('theme') || 'system';
    });

    useEffect(() => {
        const root = document.documentElement;
        const applyTheme = (mode) => {
            if (mode === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(isDark ? 'dark' : 'light');

            const listener = (e) => applyTheme(e.matches ? 'dark' : 'light');
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        } else {
            applyTheme(theme);
        }
    }, [theme]);

    const setThemeMode = (mode) => {
        setTheme(mode);
        localStorage.setItem('theme', mode);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
