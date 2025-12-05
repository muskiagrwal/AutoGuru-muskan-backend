const express = require('express');
const router = express.Router();
const b2bController = require('../controllers/b2b.controller');
const { validate } = require('../middleware/validator');
const { b2bRegistrationSchema } = require('../middleware/validationSchemas');
const { protect, authorizeRoles } = require('../middleware/auth');

/**
 * B2B Routes
 * Handles business partnership registration and management
 */

// Public routes
router.post('/register', b2bRegistrationSchema, validate, b2bController.registerB2B);

// Admin routes (protected)
router.get('/', protect, authorizeRoles('admin'), b2bController.getAllB2BProposals);
router.get('/:id', protect, authorizeRoles('admin'), b2bController.getB2BProposalById);
router.put('/:id/status', protect, authorizeRoles('admin'), b2bController.updateB2BStatus);
router.delete('/:id', protect, authorizeRoles('admin'), b2bController.deleteB2BProposal);

module.exports = router;
