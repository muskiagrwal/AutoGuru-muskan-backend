const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');
const { validate, sanitizeFields } = require('../middleware/validator');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middleware/validationSchemas');

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// Public Routes
router.post('/signup', registerSchema, validate, authController.signup);
router.post('/login', loginSchema, validate, authController.login);

// Protected Routes
router.post('/verify', authenticateToken, authController.verify);
router.get('/profile', authenticateToken, authController.getProfile);

// Debug route (remove in production)
router.get('/users', authenticateToken, authController.getAllUsers); // Debug only

// Password Reset
router.post('/forgotpassword', forgotPasswordSchema, validate, authController.forgotPassword);
router.put('/resetpassword/:resetToken', resetPasswordSchema, validate, authController.resetPassword);

module.exports = router;
