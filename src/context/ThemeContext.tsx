'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initializeTheme = () => {
      // Check local storage first
      const storedTheme = localStorage.getItem('theme') as Theme | null;

      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      } else {
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const newTheme: Theme = systemPrefersDark ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', systemPrefersDark);
      }
    };

    initializeTheme();

    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') return;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme: handleThemeChange,
    }),
    [theme]
  );

  // Return null on server-side or during initial mount
  if (!mounted) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
