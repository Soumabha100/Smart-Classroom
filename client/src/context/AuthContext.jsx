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
    // Remove the auth header from the api instance
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  }, [navigate]);

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // --- ✅ LOGIC UPDATE 1: Renamed to be more specific ---
  // This function checks auth status on page load.
  // If it fails, it logs the user out.
  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await getUserProfile();
      setUser(res.data);
      applyTheme(res.data.profile.theme || "light");
    } catch (error) {
      console.error("Failed to fetch user profile, logging out.", error);
      logout();
    } finally {
      setLoading(false); // We are done loading after the initial check
    }
  }, [logout]);

  // --- ✅ LOGIC UPDATE 2: New function for use *after* login ---
  // This function fetches the profile but *throws* an error on failure,
  // allowing the login function's catch block to handle it.
  const fetchUserProfile = async () => {
    const res = await getUserProfile(); // No try/catch, let it throw
    setUser(res.data);
    applyTheme(res.data.profile.theme || "light");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Set the token on the api instance for the initial checkAuthStatus call
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      checkAuthStatus();
    } else {
      setLoading(false); // No token, stop loading
    }
  }, [checkAuthStatus]); // We only want this running once on load

  const login = async (email, password) => {
    let loginResponse = null;
    setLoading(true);
    try {
      // 1. Attempt to log in
      const res = await api.post("/auth/login", { email, password });
      loginResponse = res; // Store the response
      const { token, role } = res.data;

      // 2. Set token everywhere *before* next API call
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);

      // 3. Fetch user profile.
      // --- ✅ LOGIC UPDATE 3: Use the new function ---
      // 3. Fetch user profile
      await fetchUserProfile();

      // 4. Navigate on success
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
      // Only clean up login state if we had a successful login but failed to fetch profile
      if (loginResponse) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        delete api.defaults.headers.common["Authorization"];
      }

      // Ensure we're throwing an error with response data
      if (err.response) {
        throw err;
      } else {
        throw new Error("Network error. Please check your connection.");
      }
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
    updateUser,
    updateTheme,
    theme: user?.profile?.theme || "light",
  };

  // Render a full-page loader during the initial auth check
  return (
    <AuthContext.Provider value={value}>
      {loading ? <FullPageLoader /> : children}
    </AuthContext.Provider>
  );
};
