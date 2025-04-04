import api from './api';

export const register = (userData) => api.post('/register', userData);
export const login = (credentials) => api.post('/login', credentials);
export const logout = () => api.post('/logout');
export const getCurrentUser = () => api.get('/me');