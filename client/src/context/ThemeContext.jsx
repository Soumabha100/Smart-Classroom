import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create the context
const ThemeContext = createContext();

// 2. Create the custom hook for components to easily use the context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// 3. Create the Provider component that will wrap your app
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    // Default to 'light' if no theme is saved
    return savedTheme || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const oldTheme = theme === "dark" ? "light" : "dark";
    root.classList.remove(oldTheme);
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
