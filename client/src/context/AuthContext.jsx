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

// --- ✨ NEW LOADING COMPONENT ---
// This component will be shown during the initial auth check.
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
    navigate("/login");
  }, [navigate]);

  const fetchAndSetUser = useCallback(async () => {
    try {
      const res = await getUserProfile();
      setUser(res.data);
      applyTheme(res.data.profile.theme || "light");
    } catch (error) {
      console.error("Failed to fetch user profile, logging out.", error);
      logout();
    } finally {
      // Don't set loading to false here; the login function will handle it.
    }
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchAndSetUser().finally(() => setLoading(false)); // Set loading false after fetch
    } else {
      setLoading(false);
    }
  }, [fetchAndSetUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setToken(token);

      await fetchAndSetUser();

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
      throw err;
    } finally {
      setLoading(false); // Stop loading after login attempt is complete
    }
  };

  const updateTheme = async (newTheme) => {
    if (user) {
      const oldUser = user;
      const newUser = {
        ...user,
        profile: { ...user.profile, theme: newTheme },
      };
      setUser(newUser);
      applyTheme(newTheme);
      try {
        await api.post("/users/profile", { theme: newTheme });
      } catch (error) {
        console.error("Failed to update theme:", error);
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

  // --- ✨ RENDER LOGIC UPDATE ---
  // Render a full-page loader during the initial auth check,
  // then render the actual application.
  return (
    <AuthContext.Provider value={value}>
      {loading ? <FullPageLoader /> : children}
    </AuthContext.Provider>
  );
};
