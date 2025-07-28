// src/models/User.js
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  // User identifier
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Email for login
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  // Hashed password
  password: {
    type: String,
    required: true
  },
  
  // User role
  role: {
    type: String,
    enum: ['admin', 'employee'],
    required: true
  },
  
  // Organization the user belongs to
  organizationId: {
    type: String,
    required: true
  },
  
  // Employee ID if user is an employee
  employeeId: {
    type: String,
    required: false
  },
  
  // Email verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Email verification token
  emailVerificationToken: {
    type: String,
    required: false
  },
  
  // Password reset token
  passwordResetToken: {
    type: String,
    required: false
  },
  
  // Password reset expiry
  passwordResetExpiry: {
    type: Date,
    required: false
  },
  
  // Account status
  active: {
    type: Boolean,
    default: true
  },
  
  // Creation timestamp
  createdAt: {
    type: Number,
    required: true,
    default: Date.now
  },
  
  // Last login
  lastLogin: {
    type: Number,
    required: false
  }
}, {
  timestamps: false
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = model('User', userSchema);
