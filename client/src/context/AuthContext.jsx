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

const FullPageLoader = () => (
  <div className="flex items-center justify-center h-screen w-full bg-slate-900 text-white">
    <div className="flex flex-col items-center gap-4">
      <span className="text-lg font-medium text-slate-300">
        Authenticating...
      </span>
    </div>
  </div>
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- 1. INITIALIZATION: Silent Refresh on Load ---
  useEffect(() => {
    const checkLoggedIn = async () => {
      const hasAuthCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("logged_in="));

      if (!hasAuthCookie) {
        setLoading(false);
        return; // Exit immediately
      }

      try {
        const { data } = await api.post("/auth/refresh");

        setAccessToken(data.accessToken);
        setClientToken(data.accessToken);

        const profileRes = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });

        setUser(profileRes.data);
      } catch (err) {
        // If the actual refresh failed (e.g., token tampered), clean up
        setUser(null);
        setAccessToken(null);
        setClientToken(null);
        // Optional: Remove the flag cookie if server rejected us
        document.cookie =
          "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      const { accessToken: newAccessToken, user: userData } = res.data;

      setAccessToken(newAccessToken);
      setUser(userData);
      setClientToken(newAccessToken);

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

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      setClientToken(null);
      // Manually clear flag client-side too just in case
      document.cookie =
        "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login");
    }
  }, [navigate]);

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  const updateTheme = async (newTheme) => {
    if (!user) return;
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
      setUser(oldUser);
    }
  };

  const value = {
    user,
    accessToken,
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
