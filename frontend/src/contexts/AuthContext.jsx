import { jsxDEV } from "react/jsx-dev-runtime";
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const refreshUserData = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/users/me");
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);
  const login = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const { token, user: user2 } = response.data;
      localStorage.setItem("token", token);
      setUser(user2);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error", error);
      return false;
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };
  const hasAccess = (requiredRoles) => {
    const ROLE_HIERARCHY = {
      "ADM": ["ADM", "Supervisor", "SDR", "Closer"],
      "Supervisor": ["ADM", "Supervisor", "SDR", "Closer"],
      "SDR": ["ADM", "Supervisor", "SDR", "Closer"],
      "Closer": ["ADM", "Supervisor", "SDR", "Closer"]
    };
    if (!user || !user.role) {
      return false;
    }
    if (requiredRoles.includes("ADM") && requiredRoles.length === 1 && user.role !== "ADM") {
      return false;
    }
    return true;
  };
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasAccess,
    refreshUserData
  };
  return /* @__PURE__ */ jsxDEV(AuthContext.Provider, { value: contextValue, children }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 103,
    columnNumber: 5
  });
};
export {
  AuthContext,
  AuthProvider
};
