// src/utils/validation.js
export const emailRegex = /^\S+@\S+$/i;

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const validateEmail = (email) => {
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8 && passwordRegex.test(password);
};

export const getPasswordStrength = (password) => {
  if (password.length < 6) return 'weak';
  if (password.length < 8) return 'medium';
  if (passwordRegex.test(password)) return 'strong';
  return 'medium';
};
