// src/utils/constants.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user'
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  EMAIL_VERIFICATION: '/verify-email/:userId/:token',
  ACCOUNT_SETUP: '/account-setup/:userId',
  DOWNLOAD: '/download',
  ADMIN_DASHBOARD: '/admin-dashboard'
};
