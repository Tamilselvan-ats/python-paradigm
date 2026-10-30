'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

/**
 * ThemeProvider manages the dark/light mode class on the html element.
 * Must be used within a client component.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode, updateStreak } = useAppStore();

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  // Update streak on load
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return <>{children}</>;
}
