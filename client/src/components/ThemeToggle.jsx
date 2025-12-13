import React from 'react';
import { useTheme } from '../context/ThemeContext';
// ✅ IMPORT useAuth to access the database updater
import { useAuth } from '../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  // ✅ GET the updateTheme function
  const { updateTheme } = useAuth(); 

  const handleThemeChange = (newTheme) => {
    // 1. Update UI instantly (Local State)
    setTheme(newTheme);
    
    // 2. Update Database (Persistent State)
    // We check if updateTheme exists because user might not be logged in
    if (updateTheme) {
      updateTheme(newTheme);
    }
  };

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    handleThemeChange(newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleThemeChange('light')}
        aria-pressed={theme === 'light'}
        className={`px-3 py-1 rounded-md text-sm ${theme === 'light' ? 'bg-slate-200/80 dark:bg-slate-700/60' : 'bg-transparent'}`}
        title="Light mode"
      >
        <Sun size={16} className="inline-block mr-1" /> Light
      </button>

      <button
        onClick={() => handleThemeChange('dark')}
        aria-pressed={theme === 'dark'}
        className={`px-3 py-1 rounded-md text-sm ${theme === 'dark' ? 'bg-slate-700/60 text-white' : 'bg-transparent'}`}
        title="Dark mode"
      >
        <Moon size={16} className="inline-block mr-1" /> Dark
      </button>

      <button
        onClick={toggle}
        className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
        title="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
};

export default ThemeToggle;