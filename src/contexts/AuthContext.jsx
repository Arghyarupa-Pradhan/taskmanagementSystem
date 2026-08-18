import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import * as authApi from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load stored user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);

    const { token, user } = response.data;

    // Save token
    localStorage.setItem("token", token);

    // Save user
    localStorage.setItem("user", JSON.stringify(user));

    // Update React state
    setUser(user);

    return user;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}