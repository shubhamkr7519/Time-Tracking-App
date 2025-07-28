// src/services/authService.js (Fixed export)
import api from './api';

class AuthService {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  }

  async verifyEmail(userId, token) {
    const response = await api.get(`/auth/verify-email/${userId}/${token}`);
    return response.data;
  }

  async requestPasswordReset(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token, password) {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  }

async setupAccount(userId, password, name) {
  const response = await api.post(`/auth/setup-account/${userId}`, { 
    password, 
    name 
  });
  return response.data;
}


  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
}

// Export instance explicitly
const authService = new AuthService();
export default authService;
