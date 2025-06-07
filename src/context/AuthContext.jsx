import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { setAuthToken } from "../services/api";
import { AuthContext } from "./AuthContextExport";
import DeepVault from "deepvault";

export const userData = new DeepVault("userData");

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize authentication state
    async function initializeAuth() {
      try {
        const exists = await userData.getEncryptedData();
        if (exists) {
          const userInfo = await userData.getDecryptedData();

          if (userInfo) {
            setIsAuthenticated(true);
            setUser(userInfo);

            if (userInfo.token) {
              setAuthToken(userInfo.token);
            }
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (e) {
        logout();
      }
    }

    initializeAuth();
  }, []);

  const login = async (token, userInfo) => {
    if (!token || !userInfo) {
      // console.error("Invalid login data:", { token, userInfo });
      return;
    }

    // Store user info with token
    const userWithToken = { ...userInfo, token };

    // Save user data to vault
    await userData.encryptAndSaveData(userWithToken);
    // localStorage.setItem("user", JSON.stringify(userWithToken));

    // Set the auth token in axios defaults
    setAuthToken(token);

    // Update state
    setIsAuthenticated(true);
    setUser(userWithToken);
  };

  //localStorage.removeItem("user");

  const logout = async () => {
    setAuthToken(null);
    await userData.deleteData();
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
