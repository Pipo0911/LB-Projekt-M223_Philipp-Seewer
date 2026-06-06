/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { api } from "../services/api.js";

/** React Context für den Authentifizierungs-Status der gesamten App. */
const AuthContext = createContext();

/** Hook für den Zugriff auf den Auth-Context. */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth muss innerhalb eines AuthProvider verwendet werden");
  }
  return context;
};

/** Liest den gespeicherten Benutzer einmalig synchron aus dem localStorage. */
function loadStoredUser() {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);

  /** Meldet den Benutzer an und speichert das JWT-Token. */
  const login = async (username, password) => {
    try {
      const userData = await api.signin({ username, password });
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      throw new Error(err?.message || "Login fehlgeschlagen");
    }
  };

  /** Registriert einen neuen Benutzer. */
  const register = async (name, email, password) => {
    try {
      await api.signup({ name, email, password });
    } catch (err) {
      throw new Error(err?.message || "Registrierung fehlgeschlagen");
    }
  };

  /** Meldet den Benutzer ab und entfernt den gespeicherten Zustand. */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /** Liefert das aktuelle JWT-Token (oder null). */
  const getToken = () => user?.token ?? null;

  const value = { user, login, register, logout, getToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
