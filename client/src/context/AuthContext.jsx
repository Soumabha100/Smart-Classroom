import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api, { setClientToken } from "../api/apiService.js";
import { socket } from "../api/socket";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// --- Loader Component ---
const FullPageLoader = () => (
  <div className="flex items-center justify-center h-screen w-full bg-slate-900 text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
      <span className="text-lg font-medium text-slate-300">
        Authenticating...
      </span>
    </div>
  </div>
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- HELPER: Connect Socket ---
  // [CRITICAL FIX] Ensures we only connect when we have a valid token.
  // It also prevents duplicate connections by disconnecting first if needed.
  const connectSocket = (token) => {
    if (!token) return;

    if (socket.connected) {
      socket.disconnect(); // Clean slate before reconnecting
    }

    socket.auth = { token }; // Attach the fresh token
    socket.connect();

    // Debugging listener for connection errors
    socket.on("connect_error", (err) => {
      console.error("❌ Socket Auth Fail:", err.message);
    });
  };

  // --- 1. INITIALIZATION: Check Session on Load ---
  useEffect(() => {
    const checkLoggedIn = async () => {
      // Optimization: Check for 'logged_in' flag cookie first.
      // If missing, we know the user is a guest, so we skip the API call.
      const hasAuthCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("logged_in="));

      if (!hasAuthCookie) {
        setLoading(false);
        return;
      }

      try {
        // Step A: Call the Proxy to refresh the session.
        // Browser sends the HttpOnly cookie automatically.
        const { data } = await api.post("/auth/refresh");

        // Step B: Set Token for future API calls immediately
        setClientToken(data.accessToken);

        // Step C: Get Profile Data
        const profileRes = await api.get("/users/profile");
        setUser(profileRes.data);

        // Step D: NOW connect the socket (We have the token!)
        connectSocket(data.accessToken);
      } catch (err) {
        console.log("Session expired or invalid, cleaning up...");
        setUser(null);
        setClientToken(null);
        // Clear flag cookie if server rejected us
        document.cookie =
          "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
      const { accessToken, user: userData } = res.data;

      // 1. Update User State
      setUser(userData);

      // 2. Set Token in API Service
      setClientToken(accessToken);

      // 3. Connect Socket immediately
      connectSocket(accessToken);

      // 4. Role-based Redirect
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

  // --- 3. LOGOUT FUNCTION ---
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout"); // Clears cookie on Server
    } catch (err) {
      console.error("Logout warning", err);
    } finally {
      // Cleanup Client State
      if (socket.connected) socket.disconnect();

      setUser(null);
      setClientToken(null);

      // Clear flag cookie manually
      document.cookie =
        "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      navigate("/login");
    }
  }, [navigate]);

  // --- 4. Profile & Theme Updates (Preserved) ---
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
