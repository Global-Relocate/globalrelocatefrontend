import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { setAuthToken } from "../services/api";
import { AuthContext } from "./AuthContextExport";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAuthToken(JSON.parse(storedUser).token);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login
  const login = async (token, userInfo) => {
    if (!token || !userInfo) {
      // console.error("Invalid login data:", { token, userInfo });
      return;
    }

    // Store user info with token
    const userWithToken = { ...userInfo, token };

    // Save user data to localStorage
    localStorage.setItem("user", JSON.stringify(userWithToken));

    // Set the auth token in axios defaults
    setAuthToken(token);

    // Update state
    setIsAuthenticated(true);
    setUser(userWithToken);
  };

  const logout = async () => {
    localStorage.removeItem("user");
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
