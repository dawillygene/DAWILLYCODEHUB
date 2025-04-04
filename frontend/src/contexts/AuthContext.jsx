// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { register, login, logout, getCurrentUser } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          // Validate token and get fresh user data
          const { data } = await getCurrentUser();
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (err) {
        // Clear invalid session
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await register(userData);
      
      // Save user and token data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await login(credentials);
      
      // Save user and token data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Call logout API if user is logged in
      if (user) {
        await logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};