// src/hooks/useAuth.js (Fixed logout with redirect)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      const result = await authService.login(email, password);
      console.log('Login result:', result);
      
      setUser(result.user);
      setIsAuthenticated(true);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login page after logout
    window.location.href = '/login'; // Force redirect
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };
};
