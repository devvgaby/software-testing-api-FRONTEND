import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_USER = 'usuario';

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(loadStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (usuario) localStorage.setItem(STORAGE_USER, JSON.stringify(usuario));
    else localStorage.removeItem(STORAGE_USER);
  }, [usuario]);

  const login = async (email, senha) => {
    const data = await authService.login(email, senha);
    setToken(data.token);
    setUsuario(data.usuario);
    return data;
  };

  const register = async (nome, email, senha, tipo) => {
    const user = await authService.register(nome, email, senha, tipo);
    return user;
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
  };

  const value = useMemo(
    () => ({
      usuario,
      token,
      isAuthenticated: Boolean(token && usuario),
      isAdmin: usuario?.tipo === 'admin',
      login,
      register,
      logout,
    }),
    [usuario, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
