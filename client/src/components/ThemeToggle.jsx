import React from 'react';
import { useTheme } from '../context/ThemeContext';
// ✅ IMPORT useAuth
import { useAuth } from '../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  // ✅ GET updateTheme
  const { updateTheme } = useAuth(); 

  const handleThemeChange = (newTheme) => {
    // [LOG] 1. Verify the function actually ran
    console.log(`🔘 ThemeToggle: CLICKED ${newTheme}`); 

    // [LOG] 2. Check if updateTheme exists
    if (updateTheme) {
      console.log(`🚀 ThemeToggle: Calling updateTheme('${newTheme}')`);
      updateTheme(newTheme);
    } else {
      console.error("❌ ThemeToggle: updateTheme is MISSING/UNDEFINED");
    }
    
    // 3. Update local state
    setTheme(newTheme);
  };

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    handleThemeChange(newTheme);
  };

  return (
    // 🟥 RED BORDER: If you don't see this, you are editing the wrong file!
    <div className="flex items-center gap-2 p-2 border-4 border-red-500 rounded-lg bg-yellow-100 dark:bg-yellow-900">
      <span className="text-xs text-red-500 font-bold">DEBUG MODE</span>
      
      <button
        onClick={() => handleThemeChange('light')}
        className={`px-3 py-1 rounded-md text-sm ${theme === 'light' ? 'bg-blue-200' : 'bg-transparent'}`}
      >
        Light
      </button>

      <button
        onClick={() => handleThemeChange('dark')}
        className={`px-3 py-1 rounded-md text-sm ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-transparent'}`}
      >
        Dark
      </button>
    </div>
  );
};

export default ThemeToggle;