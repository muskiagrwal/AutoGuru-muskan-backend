const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { validateRequiredFields, sanitizeFields } = require('../middleware/validator');

/**
 * Contact Routes
 * Base path: /api/contact
 */

// Submit contact form
router.post(
    '/',
    sanitizeFields(['name', 'email', 'make', 'service', 'message']),
    validateRequiredFields(['name', 'email', 'phone']),
    contactController.submitContact
);

// Get all contact submissions
router.get('/', contactController.getAllContacts);

// Get specific contact submission by ID
router.get('/:id', contactController.getContactById);

// Update contact submission status
router.put('/:id', contactController.updateContact);

// Delete contact submission
router.delete('/:id', contactController.deleteContact);

module.exports = router;
