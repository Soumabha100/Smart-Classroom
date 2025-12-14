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

// Loading Component
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
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- LOGGING TO CONFIRM LOAD ---
  useEffect(() => {
    console.log("📢 AuthContext Loaded. User:", user ? user.name : "Guest");
  }, [user]);

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

  const fetchUserProfile = async () => {
    const res = await getUserProfile();
    setUser(res.data);
  };

  // --- Initialize Auth on App Load ---
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        try {
          // Verify token validity with backend
          const res = await getUserProfile();
          console.log("✅ AuthContext: Initial Profile Loaded", res.data);
          setUser(res.data);
        } catch (error) {
          console.error("Session expired or invalid:", error);
          logout(); // Clears local storage if token is invalid
        }
      }
      setLoading(false); // ✅ Only stop loading after checks are done
    };

    initAuth();
  }, [logout]);

  const login = async (email, password) => {
    // ... (Login logic remains the same as your original) ...
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ THE FIXED UPDATE THEME FUNCTION
  const updateTheme = async (newTheme) => {
    console.log(`🔄 AuthContext: updateTheme called with '${newTheme}'`); // [DEBUG LOG 3]

    if (user) {
      const oldUser = user;
      const newUser = {
        ...user,
        profile: { ...(user.profile || {}), theme: newTheme },
      };

      // Optimistic Update
      setUser(newUser);

      try {
        console.log("📡 AuthContext: Sending PUT request to /users/profile..."); // [DEBUG LOG 4]

        // ✨ THE CRITICAL LINE: api.put
        const response = await api.put("/users/profile", { theme: newTheme });

        console.log(
          "✅ AuthContext: Database Updated Successfully!",
          response.data
        ); // [DEBUG LOG 5]

        // Update with actual server data to be sure
        setUser(response.data.user);
      } catch (error) {
        console.error("❌ AuthContext Error: Failed to update DB", error); // [DEBUG ERROR]
        setUser(oldUser); // Revert
      }
    } else {
      console.warn("⚠️ AuthContext: No user logged in, cannot save theme.");
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
