import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
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
      const parsedUser = JSON.parse(userInfo);
      setIsAuthenticated(true);
      setUser(parsedUser);

      // Set the auth token in axios defaults if it exists
      if (parsedUser.token) {
        setAuthToken(parsedUser.token);
      }
    }
  }, []);

  const login = (token, userInfo) => {
    if (!token || !userInfo) {
      console.error("Invalid login data:", { token, userInfo });
      return;
    }

    // Store user info with token
    const userWithToken = { ...userInfo, token };
    localStorage.setItem("user", JSON.stringify(userWithToken));

    // Set the auth token in axios defaults
    setAuthToken(token);

    // Update state
    setIsAuthenticated(true);
    setUser(userWithToken);
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
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
