import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api, { setClientToken } from "../api/apiService.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// --- Loader Component ---
const FullPageLoader = () => (
  <div className="flex items-center justify-center h-screen w-full bg-slate-900 text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
      <span className="text-lg font-medium text-slate-300">
        Loading IntelliClass...
      </span>
    </div>
  </div>
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- 1. INITIALIZATION: Check Session on Load ---
  useEffect(() => {
    const checkLoggedIn = async () => {
      // Optimization: Check for 'logged_in' flag cookie first to avoid unnecessary API calls
      // This makes the initial load much faster if the user is already logged out.
      const hasAuthCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("logged_in="));

      if (!hasAuthCookie) {
        setLoading(false);
        return; // User definitely not logged in
      }

      try {
        // 1. Hit the Proxy Endpoint. Browser sends HttpOnly Cookie automatically.
        const { data } = await api.post("/auth/refresh");

        // 2. Success! We have the Access Token.
        setClientToken(data.accessToken);

        // 3. Get User Profile
        const profileRes = await api.get("/users/profile");
        setUser(profileRes.data);
      } catch (err) {
        // Silent cleanup on failure
        setUser(null);
        setClientToken(null);
        // Force clear the flag cookie if server rejected the refresh token
        document.cookie =
          "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // --- 2. Login Action ---
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, user: userData } = res.data;

      // Update State
      setUser(userData);
      setClientToken(accessToken);

      // Handle Role-Based Navigation
      const role = userData.role;
      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "parent":
          navigate("/parent-dashboard");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Logout Action ---
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout"); // Clears cookie on Server (via Proxy)
    } catch (err) {
      console.error("Logout warning", err);
    } finally {
      // Cleanup Client State immediately
      setUser(null);
      setClientToken(null);

      // FORCE CLEAR the flag cookie manually to prevent "flicker" on next load
      document.cookie =
        "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      navigate("/login");
    }
  }, [navigate]);

  // --- 4. Profile & Theme Updates ---
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  const updateTheme = async (newTheme) => {
    if (!user) return;

    // Optimistic UI Update (Updates screen instantly, then saves to DB)
    const oldUser = { ...user };
    const newUser = {
      ...user,
      profile: { ...(user.profile || {}), theme: newTheme },
    };
    setUser(newUser);

    try {
      const response = await api.put("/users/profile", { theme: newTheme });
      setUser(response.data.user);
    } catch (error) {
      console.error("❌ Failed to update theme", error);
      // Revert on failure to prevent UI desync
      setUser(oldUser);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    updateTheme,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <FullPageLoader /> : children}
    </AuthContext.Provider>
  );
};
