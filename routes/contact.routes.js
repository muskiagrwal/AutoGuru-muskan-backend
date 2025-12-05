const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { validate, sanitizeFields } = require('../middleware/validator');
const { contactSchema } = require('../middleware/validationSchemas');

// Public routes
router.post('/', contactSchema, validate, contactController.submitContact);

// Admin routes (protected) - To be implemented
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
