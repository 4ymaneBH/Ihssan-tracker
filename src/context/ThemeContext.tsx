// Theme context for dynamic theme switching
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { theme, AppTheme } from '../theme';
import { useUserPreferencesStore } from '../store';

interface ThemeContextType {
    theme: AppTheme;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const userTheme = useUserPreferencesStore((state) => state.theme);

    const value = useMemo(() => {
        let isDark: boolean;

        if (userTheme === 'system') {
            isDark = systemColorScheme === 'dark';
        } else {
            isDark = userTheme === 'dark';
        }

        return {
            theme: isDark ? theme.dark : theme.light,
            isDark,
        };
    }, [userTheme, systemColorScheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
