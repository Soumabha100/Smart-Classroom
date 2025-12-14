import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

// Define a shape for the User object
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  // Add any other essential user properties here
}

// Define the shape of the login response
interface LoginResponse {
    token: string;
    user: User; 
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Session Loading (App Start) ---
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserJson = await AsyncStorage.getItem("user");

        if (storedToken) {
          setToken(storedToken);

          if (storedUserJson) {
            setUser(JSON.parse(storedUserJson));
          } else {
            // If only token exists, fetch profile to ensure data is fresh
            await fetchUserProfile();
          }
        }
      } catch (e) {
        console.error("Failed to load session", e);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

  // Helper to fetch profile if missing from login response
  const fetchUserProfile = async () => {
    try {
       const profileRes = await api.get<User>("/users/profile");
       setUser(profileRes.data);
       await AsyncStorage.setItem("user", JSON.stringify(profileRes.data));
       return profileRes.data;
    } catch (e) {
       console.error("Error fetching profile", e);
       return null;
    }
  };

  // --- Login Function (FIXED & ROBUST) ---
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // 1. API Call
      const res = await api.post<LoginResponse>("/auth/login", { email, password });
      
      console.log("Login API Response:", res.data); // Debugging log

      let { token: newToken, user: userData } = res.data; 

      if (!newToken) {
        throw new Error("Server response missing access token.");
      }

      // 2. Save Token FIRST (Required for subsequent requests)
      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);

      // 3. ROBUST CHECK: If server didn't send user object, fetch it manually
      if (!userData) {
        console.log("⚠️ User object missing in login response. Fetching from /profile...");
        const fetchedUser = await fetchUserProfile();
        if (!fetchedUser) {
           throw new Error("Login succeeded, but failed to load User Profile.");
        }
        userData = fetchedUser;
      }

      // 4. Save User Data (Only if we definitely have it)
      if (userData) {
        setUser(userData);
        // SAFETY CHECK: Ensure we don't pass undefined to AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      }

    } catch (error) {
        console.error("Login Flow Error:", error);
        // Clean up if anything failed
        await AsyncStorage.multiRemove(["token", "user"]);
        setToken(null);
        setUser(null);
        throw error; // Propagate error to Login Screen
    }
  };

  // --- Logout Function ---
  const logout = async () => {
    setToken(null);
    setUser(null);
    try {
        await AsyncStorage.multiRemove(["token", "user"]); 
    } catch (e) {
        console.log("Error clearing storage on logout", e);
    }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};