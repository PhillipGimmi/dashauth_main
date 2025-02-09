'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  chartsVisible: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  const [chartsVisible, setChartsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const initializeTheme = () => {
      // Check local storage first
      const storedTheme = localStorage.getItem('theme') as Theme | null;

      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      } else {
        // Default to dark theme instead of checking system preference
        setTheme('dark');
        document.documentElement.classList.add('dark'); // Ensure dark class is added
      }
    };

    initializeTheme();

    // Remove system preference check since we want to default to dark
    // Keep the media query listener in case you want to add it back later
  }, []);

  useEffect(() => {
    // Apply theme on mount and theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') return;
    // First hide charts
    setChartsVisible(false);
    // Then change theme
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    // Finally show charts again
    setTimeout(() => setChartsVisible(true), 50);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme: handleThemeChange,
      chartsVisible,
    }),
    [theme, chartsVisible]
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

// Create a custom hook that combines next-themes with our chartsVisible state
export function useThemeWithCharts() {
  const nextTheme = useNextTheme();
  const [chartsVisible, setChartsVisible] = useState(true);

  const setTheme = (theme: string) => {
    setChartsVisible(false);
    nextTheme.setTheme(theme);
    setTimeout(() => setChartsVisible(true), 50);
  };

  return { ...nextTheme, chartsVisible, setTheme };
}
