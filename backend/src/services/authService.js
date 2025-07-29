// backend/src/services/authService.js
const User = require('../models/User');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose'); // ADD THIS MISSING IMPORT
const emailService = require('./emailService');

class AuthService {
  // Generate JWT token
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      employeeId: user.employeeId
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  // Generate refresh token
  generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
  }

  // Register new user (admin creates employees)
  async registerUser(userData, creatorRole) {
    const { email, password, role, organizationId, employeeId } = userData;

    // Only admins can create other users
    if (creatorRole !== 'admin') {
      const error = new Error('Unauthorized to create users');
      error.type = 'UNAUTHORIZED';
      error.status = 403;
      throw error;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists');
      error.type = 'CONFLICT';
      error.status = 409;
      throw error;
    }

    // If role is employee, verify employee exists
    if (role === 'employee' && employeeId) {
      const employee = await Employee.findOne({ id: employeeId });
      if (!employee) {
        const error = new Error('Employee not found');
        error.type = 'NOT_FOUND';
        error.status = 404;
        throw error;
      }
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = {
      id: this.generateUserId(),
      email,
      password,
      role,
      organizationId,
      employeeId,
      emailVerificationToken,
      emailVerified: false,
      active: true,
      createdAt: Date.now()
    };

    const savedUser = await User.create(newUser);

    // Send verification email
    await emailService.sendEmployeeInvitation(email, emailVerificationToken, savedUser.id);

    // Return user without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;

    return userResponse;
  }

  // Login user
  async loginUser(email, password) {
    try {
      // Find user by email
      console.log('Attempting login for:', email);
      console.log('Current database:', mongoose.connection.db.databaseName);
      
      const user = await User.findOne({ email }).select('+password');
      console.log('User found:', user ? 'YES' : 'NO');
      
      if (!user) {
        const error = new Error('Invalid credentials');
        error.type = 'UNAUTHORIZED';
        error.status = 401;
        throw error;
      }

      // Check if account is active
      if (!user.active) {
        const error = new Error('Account is deactivated');
        error.type = 'FORBIDDEN';
        error.status = 403;
        throw error;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        const error = new Error('Invalid credentials');
        error.type = 'UNAUTHORIZED';
        error.status = 401;
        throw error;
      }

      // Update last login
      user.lastLogin = Date.now();
      await user.save();

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken();

      // Return user and tokens (without password)
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.emailVerificationToken;

      return {
        user: userResponse,
        token,
        refreshToken
      };
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  }

  // Verify email method
  async verifyEmail(token, userId) {
    console.log('=== EMAIL VERIFICATION DEBUG ===');
    console.log('Looking for userId:', userId);
    console.log('Looking for token:', token);
    
    // First, check if user exists
    const userByIdOnly = await User.findOne({ id: userId });
    console.log('User found by ID only:', userByIdOnly ? 'YES' : 'NO');
    
    if (!userByIdOnly) {
      const error = new Error('User not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Check if user is already verified
    if (userByIdOnly.emailVerified) {
      console.log('User already verified - returning success');
      console.log('===============================');
      return { 
        message: 'Email already verified successfully',
        alreadyVerified: true
      };
    }
    
    console.log('User email:', userByIdOnly.email);
    console.log('User emailVerified:', userByIdOnly.emailVerified);
    console.log('Stored verification token:', userByIdOnly.emailVerificationToken);
    console.log('Token match:', userByIdOnly.emailVerificationToken === token);
    
    // Now try the original query for unverified users
    const user = await User.findOne({ 
      id: userId,
      emailVerificationToken: token 
    });
    
    console.log('User found with both ID and token:', user ? 'YES' : 'NO');
    console.log('===============================');

    if (!user) {
      const error = new Error('Invalid or expired verification token');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  // Request password reset
  async requestPasswordReset(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If account exists, password reset email sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = resetExpiry;
    await user.save();

    // Send password reset email
    await emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'If account exists, password reset email sent' };
  }

  // Reset password
  async resetPassword(token, newPassword) {
    const user = await User.findOne({ 
      passwordResetToken: token,
      passwordResetExpiry: { $gt: new Date() }
    });

    if (!user) {
      const error = new Error('Invalid or expired reset token');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  // Setup account password method
  async setupAccountPassword(userId, newPassword, employeeName) {
    console.log('=== ACCOUNT SETUP DEBUG ===');
    console.log('Setting up password for userId:', userId);
    console.log('Employee name:', employeeName);
    
    // Find user by ID and check if email is verified
    const user = await User.findOne({ 
      id: userId,
      emailVerified: true
    });
    
    console.log('User found for account setup:', user ? 'YES' : 'NO');
    
    if (!user) {
      const error = new Error('User not found or email not verified');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    // Set the new password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();
    
    console.log('Password set successfully for:', user.email);

    // CREATE EMPLOYEE RECORD
    const Employee = require('../models/Employee');
    
    // Check if employee record already exists
    const existingEmployee = await Employee.findOne({ 
      identifier: user.email,
      organizationId: user.organizationId
    });
    
    if (!existingEmployee) {
      const currentTime = Date.now();
      
      const newEmployee = await Employee.create({
        id: this.generateEmployeeId(),
        name: employeeName,
        teamsId: 'w7268578db3d0bc', // ⚠️ Replace with actual team ID after you create it
        sharedSettingsId: 'wc28abfc4f50ccc', // Your personal settings ID
        accountId: user.id,
        identifier: user.email,
        type: 'personal',
        organizationId: user.organizationId,
        projects: [],
        deactivated: 0,
        invited: currentTime,
        systemPermissions: [],
        createdAt: currentTime
      });
      
      console.log('Employee record created:', newEmployee.id);
      console.log('Employee name:', newEmployee.name);
    } else {
      console.log('Employee record already exists');
    }
    
    console.log('==============================');

    return { message: 'Account setup completed successfully' };
  }

  // Generate employee ID method
  generateEmployeeId() {
    const crypto = require('crypto');
    return 'w' + crypto.randomBytes(7).toString('hex').substring(0, 14);
  }

  // Verify JWT token
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user still exists and is active
      const user = await User.findOne({ 
        id: decoded.id,
        active: true 
      });

      if (!user) {
        const error = new Error('User not found or inactive');
        error.type = 'UNAUTHORIZED';
        error.status = 401;
        throw error;
      }

      return decoded;
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        const error = new Error('Token expired');
        error.type = 'TOKEN_EXPIRED';
        error.status = 401;
        throw error;
      }

      const error = new Error('Invalid token');
      error.type = 'UNAUTHORIZED';
      error.status = 401;
      throw error;
    }
  }

  // Generate user ID
  generateUserId() {
    return 'u' + crypto.randomBytes(7).toString('hex').substring(0, 14);
  }

  // Get user by ID method
  async getUserById(userId) {
    const user = await User.findOne({ id: userId }).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.type = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }

    return user.toObject();
  }
}

module.exports = new AuthService();
