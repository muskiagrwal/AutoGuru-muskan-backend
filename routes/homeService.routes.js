const express = require('express');
const router = express.Router();
const homeServiceController = require('../controllers/homeService.controller');
const { validate } = require('../middleware/validator');
const { homeServiceSchema } = require('../middleware/validationSchemas');

/**
 * Home Service Routes
 * Base path: /api/home-service
 */

// Public routes
router.post('/', homeServiceSchema, validate, homeServiceController.createHomeService);

// Admin routes (protected) - To be implemented
// Get all home service bookings
router.get('/', homeServiceController.getAllHomeServices);

// Get specific home service booking by ID
router.get('/:id', homeServiceController.getHomeServiceById);

// Update home service booking
router.put('/:id', homeServiceController.updateHomeService);

// Delete home service booking
router.delete('/:id', homeServiceController.deleteHomeService);

module.exports = router;
