import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api, { getUserProfile } from "../api/apiService.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// This function will apply the theme class to the document
const applyTheme = (theme) => {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const fetchAndSetUser = useCallback(async () => {
    try {
      const res = await getUserProfile();
      setUser(res.data);
      applyTheme(res.data.profile.theme || "light");
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchAndSetUser();
    } else {
      setLoading(false);
      // Ensure theme is cleared if no user
      applyTheme("light");
    }
  }, [token, fetchAndSetUser]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    // After setting token, the useEffect will trigger fetchAndSetUser
  };

  const updateTheme = async (newTheme) => {
    if (user) {
      // 1. Optimistically update UI
      const oldUser = user;
      const newUser = {
        ...user,
        profile: { ...user.profile, theme: newTheme },
      };
      setUser(newUser);
      applyTheme(newTheme);

      // 2. Persist to backend
      try {
        await api.post("/users/profile", { theme: newTheme });
      } catch (error) {
        console.error("Failed to update theme:", error);
        // Revert on error
        setUser(oldUser);
        applyTheme(oldUser.profile.theme);
      }
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateTheme,
    theme: user?.profile?.theme || "light",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
