import { createContext, useState, useEffect, useCallback } from 'react';
import { register, login, logout, getCurrentUser } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiry');
    setUser(null);
    setError(null);
  }, []);

  const initAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const expiry = localStorage.getItem('token_expiry');
      
      // Check if token exists and isn't expired
      if (token && expiry && new Date(expiry) > new Date()) {
        const { data } = await getCurrentUser();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        clearAuth();
      }
    } catch (err) {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);


  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await register(userData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await login(credentials);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
    }
  };

   const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user && 
      localStorage.getItem('token') && 
      new Date(localStorage.getItem('token_expiry')) > new Date(),
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};