
// src/services/AuthService.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const LOCAL_KEY = "mcq_users";
const CURRENT_USER_KEY = "mcq_current_user";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    setIsAuthenticated(!!currentUser);
  }, []);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    if (users[username] && users[username] === password) {
      localStorage.setItem(CURRENT_USER_KEY, username);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const signup = (username, password) => {
    const users = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    if (users[username]) return { success: false, message: "User already exists" };
    if (password.length < 5) return { success: false, message: "Password must be at least 5 characters" };
    users[username] = password;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
    return login(username, password);
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}