'use client';

import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-zinc-800 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-zinc-700"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
