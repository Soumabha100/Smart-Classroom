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

// Define the shape of the login response based on common backend standards
interface LoginResponse {
    token: string;
    user: User; // Assuming your server returns the full user object on successful login
}

// Update the context type to include the user
interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  // NOTE: login now returns a Promise<void> as it handles state updates internally
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
        const storedUserJson = await AsyncStorage.getItem("user"); // Try to load stored user data

        if (storedToken) {
          setToken(storedToken);

          if (storedUserJson) {
            // If user data is cached, use it immediately
            setUser(JSON.parse(storedUserJson));
          } else {
            // If only token exists, fetch profile to ensure data is fresh
            const profileRes = await api.get<User>("/users/profile");
            setUser(profileRes.data);
            await AsyncStorage.setItem("user", JSON.stringify(profileRes.data));
          }
        }
      } catch (e) {
        // If profile fetch fails (e.g., bad token, network issue), clear session
        console.error("Failed to load session or fetch profile", e);
        await AsyncStorage.multiRemove(["token", "role", "user"]);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

  // --- Login Function (CRITICAL FIXES HERE) ---
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // 1. API Call: Post credentials and get back token and user data
      const res = await api.post<LoginResponse>("/auth/login", { email, password });
      
      // Destructure response data based on LoginResponse interface
      const { token: newToken, user: userData } = res.data; 

      // 2. Set State
      setToken(newToken);
      setUser(userData);

      // 3. Persist Data
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData)); // Save the user object

    } catch (error) {
        // 4. CRITICAL FIX: Throw the error so the login.tsx screen can catch it
        // and display the appropriate error message (Alert.alert).
        throw error; 
    }
  };

  // --- Logout Function ---
  const logout = async () => {
    setToken(null);
    setUser(null);
    // Clear all relevant keys from storage
    await AsyncStorage.multiRemove(["token", "user"]); 
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};