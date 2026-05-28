'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-emerald-100/50 hover:bg-emerald-200 dark:bg-[#1a2332] dark:hover:bg-[#1f2937] border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center group"
      aria-label="Toggle dark mode"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 absolute inset-0 transition-transform duration-300 transform rotate-0 scale-100 group-hover:text-emerald-300" />
        ) : (
          <Moon className="w-5 h-5 absolute inset-0 transition-transform duration-300 transform rotate-0 scale-100 group-hover:text-emerald-700" />
        )}
      </div>
    </button>
  );
}
