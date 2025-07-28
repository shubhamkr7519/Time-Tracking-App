// src/routes/authRoutes.js (New file)
const router = require('express').Router();
const authController = require('../controllers/authController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
router.post('/login', authController.login);
router.get('/verify-email/:userId/:token', authController.verifyEmail);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password/:token', authController.resetPassword);
// Add this route
router.post('/setup-account/:userId', authController.setupAccount);


// Protected routes (authentication required)
router.post('/register', authMiddleware, requireRole(['admin']), authController.register);
router.get('/profile', authMiddleware, authController.getProfile);

// Add these routes (require authentication)
router.get('/pending-invitations', authMiddleware, requireRole(['admin']), authController.getPendingInvitations);
router.post('/resend-invitation', authMiddleware, requireRole(['admin']), authController.resendInvitation);
router.delete('/delete-invitation/:userId', authMiddleware, requireRole(['admin']), authController.deleteInvitation);


module.exports = router;
