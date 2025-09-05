import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api'; // Your Axios instance

// Define the shape of the context state
interface AuthContextType {
  token: string | null;
  role: string | null;
  isLoading: boolean;
login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app load, check for a stored token
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedRole = await AsyncStorage.getItem('role');
        if (storedToken) {
          setToken(storedToken);
          setRole(storedRole);
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

interface LoginResponse {
    token: string;
    role: string;
}

const login = async (email: string, password: string): Promise<void> => {
    try {
        const res = await api.post<LoginResponse>('/auth/login', { email, password });
        const { token: newToken, role: newRole } = res.data;
        setToken(newToken);
        setRole(newRole);
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('role', newRole);
    } catch (error) {
        console.error('Login failed', error);
        // Optionally re-throw or handle the error as needed
        throw error;
    }
};

  const logout = async () => {
    setToken(null);
    setRole(null);
    await AsyncStorage.multiRemove(['token', 'role']);
  };

  return (
    <AuthContext.Provider value={{ token, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};