import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  token: string | null;
  user: UserPayload | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwt_token');
        if (storedToken) {
          const decoded = jwtDecode<UserPayload>(storedToken);
          setUser(decoded);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Error al leer token", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkToken();
  }, []);

  const login = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('jwt_token', newToken);
      const decoded = jwtDecode<UserPayload>(newToken);
      setUser(decoded);
      setToken(newToken);
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Error al guardar token", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error("Error al borrar token", e);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
