import React, { createContext, useState, useContext, useEffect } from "react";
import * as api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api
        .validateToken(token)
        .then((isValid) => {
          if (isValid) {
            api
              .getUserProfile()
              .then((response) => {
                setUser(response.data); // Assuming the API returns user data
                setIsLoading(false);
              })
              .catch((err) => {
                console.error("Error fetching user profile:", err);
                setIsLoading(false);
              });
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Attempting login with credentials:", credentials);
      const response = await api.login(credentials);
      console.log("Login response:", response);

      if (response.data && response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        if (response.data.refresh) {
          localStorage.setItem("refresh_token", response.data.refresh);
        }
        setUser(response.data.user || { username: "User", id: 1 });
        console.log("Login successful, user set to:", response.data.user);
      } else {
        throw new Error("Login response did not contain access token");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message);
      throw error; // Throw the error so it can be handled by the caller
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
