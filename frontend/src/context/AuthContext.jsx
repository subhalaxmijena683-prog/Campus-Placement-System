import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("campus_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("campus_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("campus_token", data.token);
    localStorage.setItem("campus_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("campus_token", data.token);
    localStorage.setItem("campus_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("campus_token");
    localStorage.removeItem("campus_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, register, logout, isAuthenticated: Boolean(token) }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
