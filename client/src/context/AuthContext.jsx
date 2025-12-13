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

// ❌ DELETED: applyTheme helper function entirely.
// const applyTheme = (theme) => { ... }

// ... FullPageLoader component stays the same ...
const FullPageLoader = () => (
  <div className="flex items-center justify-center h-screen w-full bg-slate-900 text-white">
    <div className="flex flex-col items-center gap-4">
      <svg
        className="animate-spin h-8 w-8 text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="text-lg font-medium text-slate-300">
        Authenticating...
      </span>
    </div>
  </div>
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  }, [navigate]);

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await getUserProfile();
      setUser(res.data);
      // ❌ DELETED: applyTheme(res.data.profile.theme || "light");
    } catch (error) {
      console.error("Failed to fetch user profile, logging out.", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const fetchUserProfile = async () => {
    const res = await getUserProfile();
    setUser(res.data);
    // ❌ DELETED: applyTheme(res.data.profile.theme || "light");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    let loginResponse = null;
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      loginResponse = res;
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);

      await fetchUserProfile();

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
      if (loginResponse) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        delete api.defaults.headers.common["Authorization"];
      }
      if (err.response) throw err;
      else throw new Error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (newTheme) => {
    if (user) {
      // 1. Optimistic UI Update (Instant feedback)
      const oldUser = user;
      const newUser = {
        ...user,
        profile: { ...(user.profile || {}), theme: newTheme }, // Handle missing profile safely
      };
      setUser(newUser);

      try {
        // 2. Send to Backend
        // The backend now looks for { theme: "dark" } in the body
        const response = await api.put("/users/profile", { theme: newTheme });

        // 3. Sync state with actual backend response to be sure
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to update theme in DB:", error);
        // Revert on failure
        setUser(oldUser);
      }
    }
  };

  const value = {
    user,
    token,
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
