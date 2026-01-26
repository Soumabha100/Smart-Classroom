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

// --- UI Component: Full Page Loader ---
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
      try {
        // Attempt to refresh the token (browser sends HttpOnly cookie automatically)
        const { data } = await api.post("/auth/refresh");
        
        // If successful, save Access Token to memory
        setAccessToken(data.accessToken);
        setClientToken(data.accessToken); // Update the API interceptor

        // Now fetch the user's full profile using the new Access Token
        const profileRes = await api.get("/users/profile", {
           headers: { Authorization: `Bearer ${data.accessToken}` }
        });
        
        setUser(profileRes.data);
        console.log("✅ Auth: Session restored for", profileRes.data.name);

      } catch (err) {
        // If refresh fails (401), user is simply not logged in. 
        console.log("ℹ️ Auth: No active session found.");
        setUser(null);
        setAccessToken(null);
        setClientToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // --- 2. LOGIN FUNCTION ---
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      
      const { accessToken: newAccessToken, user: userData } = res.data;
      
      // Update State
      setAccessToken(newAccessToken);
      setUser(userData);
      
      // Update API Service Interceptor
      setClientToken(newAccessToken);

      // Navigate based on Role
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
      throw err; // Allow component to handle error UI
    } finally {
      setLoading(false);
    }
  };

  // --- 3. LOGOUT FUNCTION ---
  const logout = useCallback(async () => {
    try {
      // Tell server to clear the HttpOnly cookie
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      // Clear Client State
      setAccessToken(null);
      setUser(null);
      setClientToken(null); 
      navigate("/login");
    }
  }, [navigate]);

  // --- 4. UPDATE USER (Local Helper) ---
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // --- 5. UPDATE THEME (Optimistic UI) ---
  const updateTheme = async (newTheme) => {
    if (!user) return;

    const oldUser = { ...user };
    const newUser = {
      ...user,
      profile: { ...(user.profile || {}), theme: newTheme },
    };

    // Optimistic Update (Update UI immediately)
    setUser(newUser);

    try {
      const response = await api.put("/users/profile", { theme: newTheme });
      // Confirm with server data
      setUser(response.data.user);
    } catch (error) {
      console.error("❌ Failed to update theme", error);
      setUser(oldUser); // Revert if server fails
    }
  };

  const value = {
    user,
    accessToken, // Expose token if needed, but 'api' handles it mostly
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