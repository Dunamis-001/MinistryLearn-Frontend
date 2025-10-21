import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("access", res.data.access_token);
    localStorage.setItem("refresh", res.data.refresh_token);
    setRoles(res.data.roles || []);
    await loadProfile();
  }

  async function register({ email, username, password }) {
    await api.post("/auth/register", { email, username, password });
    return login(email, password);
  }

  async function loadProfile() {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
      setRoles(res.data.roles || []);
    } catch {
      setUser(null);
      setRoles([]);
    }
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    setRoles([]);
    window.location.href = "/login";
  }

  useEffect(() => { loadProfile(); }, []);

  return (
    <AuthContext.Provider value={{ user, roles, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);