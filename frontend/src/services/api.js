// src/services/api.js - Centralized API configuration
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp for cache busting
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          
          // Don't redirect if already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', data.message);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', error.config.url);
          break;
          
        case 422:
          // Validation error
          console.error('Validation error:', data.details);
          break;
          
        case 429:
          // Rate limited
          console.error('Rate limited:', data.message);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
          
        default:
          console.error('API error:', status, data.message);
      }
      
      // Enhance error object with response data
      error.message = data.message || error.message;
      error.type = data.type || 'API_ERROR';
      error.details = data.details;
      
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      error.message = 'Network error. Please check your connection.';
      error.type = 'NETWORK_ERROR';
      
    } else {
      // Other error
      console.error('Unknown error:', error.message);
      error.type = 'UNKNOWN_ERROR';
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common operations
api.helpers = {
  // Get with error handling
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message, type: error.type };
    }
  },
  
  // Post with error handling
  post: async (url, data, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message, type: error.type };
    }
  },
  
  // Put with error handling
  put: async (url, data, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message, type: error.type };
    }
  },
  
  // Delete with error handling
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message, type: error.type };
    }
  }
};

export default api;
