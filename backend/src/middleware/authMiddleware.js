// src/middleware/authMiddleware.js (Updated - Real JWT)
const authService = require('../services/authService');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        type: 'UNAUTHORIZED',
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = await authService.verifyToken(token);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.type === 'TOKEN_EXPIRED') {
      return res.status(401).json({
        type: 'TOKEN_EXPIRED',
        message: 'Token expired'
      });
    }

    return res.status(401).json({
      type: 'UNAUTHORIZED',
      message: error.message || 'Invalid token'
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = await authService.verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        type: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        type: 'FORBIDDEN',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireRole
};