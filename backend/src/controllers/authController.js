// src/controllers/authController.js
const authService = require('../services/authService');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');


class AuthController {
  // Register new user (admin only)
  async register(req, res, next) {
    try {
      const { email, password, role, employeeId } = req.body;
      const { organizationId, role: creatorRole } = req.user;

      if (!email || !password || !role) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Email, password, and role are required'
        });
      }

      const user = await authService.registerUser({
        email,
        password,
        role,
        organizationId,
        employeeId
      }, creatorRole);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Email and password are required'
        });
      }

      const result = await authService.loginUser(email, password);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Verify email
  async verifyEmail(req, res, next) {
    try {
      const { token, userId } = req.params;

      const result = await authService.verifyEmail(token, userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Request password reset
  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Email is required'
        });
      }

      const result = await authService.requestPasswordReset(email);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Reset password
  async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          type: 'VALIDATION_ERROR',
          message: 'Password is required'
        });
      }

      const result = await authService.resetPassword(token, password);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

// Update setupAccount method to handle name parameter
async setupAccount(req, res, next) {
  try {
    const { userId } = req.params;
    const { password, name } = req.body; // Add name parameter

    if (!password) {
      return res.status(400).json({
        type: 'VALIDATION_ERROR',
        message: 'Password is required'
      });
    }

    if (!name) {
      return res.status(400).json({
        type: 'VALIDATION_ERROR',
        message: 'Name is required'
      });
    }

    const result = await authService.setupAccountPassword(userId, password, name);
    res.json(result);
  } catch (error) {
    next(error);
  }
}


// Add this method to get pending invitations
async getPendingInvitations(req, res, next) {
  try {
    const { organizationId } = req.user;
    
    // Find users who are not email verified (pending invitations)
    const pendingUsers = await User.find({
      organizationId: organizationId,
      emailVerified: false,
      role: 'employee',
      active: true
    }).select('id email createdAt emailVerificationToken');
    
    const pendingInvitations = pendingUsers.map(user => ({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      status: 'pending'
    }));
    
    res.json(pendingInvitations);
  } catch (error) {
    next(error);
  }
}

// Add resend invitation method
async resendInvitation(req, res, next) {
  try {
    const { userId, email } = req.body;
    
    // Find the user
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({
        type: 'NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    await user.save();
    
    // Send new invitation email
    await emailService.sendEmployeeInvitation(email, emailVerificationToken, userId);
    
    res.json({ message: 'Invitation resent successfully' });
  } catch (error) {
    next(error);
  }
}

// Add delete invitation method
async deleteInvitation(req, res, next) {
  try {
    const { userId } = req.params;
    
    // Find and delete the user
    const user = await User.findOneAndDelete({ id: userId, emailVerified: false });
    if (!user) {
      return res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Pending invitation not found'
      });
    }
    
    res.json({ message: 'Invitation deleted successfully' });
  } catch (error) {
    next(error);
  }
}



  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const { id } = req.user;
      
      // Get user details (could enhance with employee details if needed)
      const user = await authService.getUserById(id);
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
