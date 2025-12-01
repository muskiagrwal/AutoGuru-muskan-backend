const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');
const { validateRequiredFields, validateEmail, sanitizeFields } = require('../middleware/validator');

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// Public routes
router.post(
    '/signup',
    sanitizeFields(['firstName', 'lastName', 'email']),
    validateEmail,
    validateRequiredFields(['firstName', 'lastName', 'email', 'password']),
    authController.signup
);

router.post(
    '/login',
    sanitizeFields(['email']),
    validateEmail,
    validateRequiredFields(['email', 'password']),
    authController.login
);

// Protected routes (require authentication)
router.post('/verify', authenticateToken, authController.verify);
router.get('/profile', authenticateToken, authController.getProfile);

// Debug route (remove in production)
router.get('/users', authController.getAllUsers);

module.exports = router;
