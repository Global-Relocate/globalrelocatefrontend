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
    const token = localStorage.getItem("authToken");
    const userInfo = localStorage.getItem("user");

    if (token && userInfo) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const login = (token, userInfo) => {
    if (!token || !userInfo) {
      console.error("Invalid login data:", { token, userInfo });
      return;
    }

    // Store in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userInfo));

    // Update state
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const logout = () => {
    // Clear auth token from axios defaults
    setAuthToken(null);

    // Clear localStorage
    localStorage.removeItem("authToken");
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
