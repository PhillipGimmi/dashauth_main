'use client';

import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import EclipseToggle from './ThemeToggle';

const ThemeToggleWrapper = () => {
  const { setTheme } = useTheme();

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setTheme(theme);
  };

  // Set initial theme to dark mode since sun is visible at start
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return <EclipseToggle onThemeChange={handleThemeChange} />;
};

export default ThemeToggleWrapper;
