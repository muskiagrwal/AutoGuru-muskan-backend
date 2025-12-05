const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/checkRole');
const { validate, sanitizeFields } = require('../middleware/validator');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middleware/validationSchemas');

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// Public Routes
router.post('/signup', registerSchema, validate, authController.signup);
router.post('/login', loginSchema, validate, authController.login);

// OTP Routes (Public - need email to send OTP)
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);

// Protected Routes
router.post('/logout', authenticateToken, authController.logout);
router.post('/verify', authenticateToken, authController.verify);
router.get('/profile', authenticateToken, authController.getProfile);

// Profile Management (Protected)
router.post('/update-profile', authenticateToken, authController.updateProfile);
router.post('/update-email', authenticateToken, authController.updateEmail);
router.post('/update-password', authenticateToken, authController.updatePassword);
router.post('/change-password', authenticateToken, authController.changePassword);

// Debug route (admin only - consider removing in production)
router.get('/users', authenticateToken, requireAdmin, authController.getAllUsers);

// Password Reset (Public)
router.post('/forgotpassword', forgotPasswordSchema, validate, authController.forgotPassword);
router.post('/forgot-password', forgotPasswordSchema, validate, authController.forgotPassword); // Alias
router.put('/resetpassword/:resetToken', resetPasswordSchema, validate, authController.resetPassword);
router.put('/reset-password/:resetToken', resetPasswordSchema, validate, authController.resetPassword); // Alias

module.exports = router;
