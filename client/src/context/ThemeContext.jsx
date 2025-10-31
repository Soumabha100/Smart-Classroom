import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // First, initialize themeSource
  const [themeSource, setThemeSource] = useState(() => {
    const savedSource = localStorage.getItem("themeSource");
    return savedSource || "system";
  });

  // Then, initialize theme based on themeSource
  const [theme, setTheme] = useState(() => {
    const savedSource = localStorage.getItem("themeSource");
    const savedTheme = localStorage.getItem("theme");

    // If user has explicitly set a theme before (manual mode)
    if (savedSource === "manual" && savedTheme) {
      return savedTheme;
    }

    // If system preference or no preference set
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (themeSource === "system") {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeSource]);

  useEffect(() => {
    const root = document.documentElement;

    // Add preload class to prevent transitions on page load
    root.classList.add("preload");

    // Remove both theme classes first
    root.classList.remove("light", "dark");

    // Add the current theme class
    root.classList.add(theme);

    // Add transition class for smooth theme switching
    root.classList.add("theme-transition");

    // Store theme in localStorage
    localStorage.setItem("theme", theme);
    localStorage.setItem("themeSource", themeSource);

    // Remove preload class after a brief delay to enable transitions
    setTimeout(() => {
      root.classList.remove("preload");
    }, 100);

    // Remove transition class after animation completes
    const transitionTimeout = setTimeout(() => {
      root.classList.remove("theme-transition");
      root.classList.add("theme-transition-complete");
    }, 1000);

    return () => clearTimeout(transitionTimeout);
  }, [theme, themeSource]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeSource("manual");
    setTheme(newTheme);
    localStorage.setItem("themeSource", "manual");
    localStorage.setItem("theme", newTheme);
  };

  const setSystemTheme = () => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setThemeSource("system");
    setTheme(isDark ? "dark" : "light");
    localStorage.setItem("themeSource", "system");
    localStorage.removeItem("theme"); // Clear the manual theme preference
  };

  const value = {
    theme,
    themeSource,
    toggleTheme,
    setSystemTheme,
    setTheme: (newTheme) => {
      if (newTheme === "system") {
        setSystemTheme();
      } else {
        setThemeSource("manual");
        setTheme(newTheme);
        localStorage.setItem("themeSource", "manual");
        localStorage.setItem("theme", newTheme);
      }
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
