import api from './api';


export const register = (userData) => 
  api.post('/register', userData).then(response => {
    const { token, user, expiresIn } = response.data;
    const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem('token_expiry', expiryDate);
    return response;
  });

export const login = (credentials) => 
  api.post('/login', credentials).then(response => {
    const { token, user, expiresIn } = response.data;
    const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem('token_expiry', expiryDate);
    return response;
  });


export const logout = () => api.post('/logout');
export const getCurrentUser = () => api.get('/me');