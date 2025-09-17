// src/components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
// optional icons if you have lucide-react installed
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        className={`px-3 py-1 rounded-md text-sm ${theme === 'light' ? 'bg-slate-200/80 dark:bg-slate-700/60' : 'bg-transparent'}`}
        title="Light mode"
      >
        <Sun size={16} className="inline-block mr-1" /> Light
      </button>

      <button
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        className={`px-3 py-1 rounded-md text-sm ${theme === 'dark' ? 'bg-slate-700/60 text-white' : 'bg-transparent'}`}
        title="Dark mode"
      >
        <Moon size={16} className="inline-block mr-1" /> Dark
      </button>

      {/* optional: an icon-only toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
        title="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
};

export default ThemeToggle;
