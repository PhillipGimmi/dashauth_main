'use client';

import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';
import { create } from 'zustand';

// Create a store to handle card states
interface CardStore {
  collapseAll: () => void;
  onCollapseAll: (callback: () => void) => void;
  listeners: (() => void)[];
}

export const useCardStore = create<CardStore>((set, get) => ({
  listeners: [],
  collapseAll: () => {
    get().listeners.forEach((callback) => callback());
  },
  onCollapseAll: (callback) => {
    set((state) => ({ listeners: [...state.listeners, callback] }));
  },
}));

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const collapseAll = useCardStore((state) => state.collapseAll);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleThemeToggle = () => {
    collapseAll(); // Collapse all cards before theme change
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleThemeToggle}
      className="fixed left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-zinc-800 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-zinc-700"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
