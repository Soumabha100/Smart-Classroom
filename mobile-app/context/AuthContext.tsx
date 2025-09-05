import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

// Define a shape for the User object
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Update the context type to include the user
interface AuthContextType {
  token: string | null;
  user: User | null; // <-- ADD USER STATE
  isLoading: boolean;
login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // <-- ADD USER STATE
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          // If a token is found, fetch the user profile
          const res = await api.get("/users/profile");
          setUser(res.data);
        }
      } catch (e) {
        console.error("Failed to load session", e);
        // If profile fetch fails (e.g., bad token), clear everything
        await AsyncStorage.multiRemove(["token", "role", "user"]);
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

interface LoginResponse {
    token: string;
}

const login = async (email: string, password: string): Promise<void> => {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });
    const { token: newToken } = res.data;
    setToken(newToken);
    await AsyncStorage.setItem("token", newToken);

    // After setting the token, fetch the user profile
    const profileRes = await api.get<User>("/users/profile");
    setUser(profileRes.data);
};

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(["token", "role"]);
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
