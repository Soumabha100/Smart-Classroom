import React, { createContext, useContext, useEffect, useState, useLayoutEffect, useRef } from "react";
// ✅ IMPORT useAuth to listen for login/user changes
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // ✅ GET the user object
  const { user } = useAuth();

  const [themeSource, setThemeSource] = useState(() => {
    const savedSource = localStorage.getItem("themeSource");
    return savedSource || "system";
  });

  const [theme, setTheme] = useState(() => {
    const savedSource = localStorage.getItem("themeSource");
    const savedTheme = localStorage.getItem("theme");

    // If we have a manual override, strictly use it
    if (savedSource === "manual" && savedTheme) {
      return savedTheme;
    }
    // Otherwise fallback to system
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  // ✅ SYNC EFFECT: When user loads/updates, sync theme from DB
  useEffect(() => {
    // Check if user exists and has a theme preference
    if (user?.profile?.theme) {
      const dbTheme = user.profile.theme;
      
      // Only update if the DB value is different from current
      // This prevents infinite loops if they match
      if (dbTheme !== theme) {
        console.log("Syncing theme from DB:", dbTheme);
        setTheme(dbTheme);
        setThemeSource("manual");
        localStorage.setItem("themeSource", "manual");
        localStorage.setItem("theme", dbTheme);
      }
    }
  }, [user]); // dependency on 'user' ensures this runs on login/refresh

  // System Theme Listener
  useEffect(() => {
    if (themeSource !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeSource]);

  // Apply to DOM
  useLayoutEffect(() => {
    const root = document.documentElement;
    
    // 1. Update DOM classes
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    // 2. Persist to LocalStorage
    localStorage.setItem("theme", theme);
    localStorage.setItem("themeSource", themeSource);

    // 3. Handle Transitions (Prevent flashing)
    root.classList.add("theme-transition");
    const timer = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [theme, themeSource]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeSource("manual");
    setTheme(newTheme);
  };

  const setSystemTheme = () => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setThemeSource("system");
    setTheme(isDark ? "dark" : "light");
  };

  const setManualTheme = (newTheme) => {
    setThemeSource("manual");
    setTheme(newTheme);
  };

  const value = {
    theme,
    themeSource,
    toggleTheme,
    setSystemTheme,
    setTheme: setManualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);