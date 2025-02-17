import React, { createContext, useState, useEffect } from "react";
import { setAuthToken } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    // Check for existing auth on mount
    const userInfo = localStorage.getItem("user");

    if (userInfo) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const login = (token, userInfo) => {
    if (!token || !userInfo) {
      console.error("Invalid login data:", { token, userInfo });
      return;
    }

    localStorage.setItem("user", JSON.stringify({ ...userInfo, token }));

    // Update state
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const logout = () => {
    // Clear auth token from axios defaults
    setAuthToken(null);
    localStorage.removeItem("user");

    // Update state
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
