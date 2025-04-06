// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    user: context.user,
    loading: context.loading,
    isAuthenticated: context.isAuthenticated,
    error: context.error,
    login: context.login,
    logout: context.logout,
    register: context.register
  };
};