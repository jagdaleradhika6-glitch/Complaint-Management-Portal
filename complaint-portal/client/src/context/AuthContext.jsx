import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cmp_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cmp_token'));
  const [theme, setTheme] = useState(() => localStorage.getItem('cmp_theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('cmp_theme', theme);
  }, [theme]);

  const login = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem('cmp_user', JSON.stringify(payload.user));
    localStorage.setItem('cmp_token', payload.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cmp_user');
    localStorage.removeItem('cmp_token');
  };

  const value = useMemo(
    () => ({ user, token, login, logout, theme, setTheme }),
    [user, token, theme]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
