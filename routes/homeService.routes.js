const express = require('express');
const router = express.Router();
const homeServiceController = require('../controllers/homeService.controller');
const { validateRequiredFields, sanitizeFields } = require('../middleware/validator');

/**
 * Home Service Routes
 * Base path: /api/home-service
 */

// Create new home service booking
router.post(
    '/',
    sanitizeFields(['name', 'email', 'address', 'serviceType', 'vehicleName', 'vehicleType', 'vehicleModel']),
    validateRequiredFields(['name', 'email', 'phone', 'address', 'serviceType', 'vehicleName', 'vehicleType', 'vehicleModel', 'vehicleYear']),
    homeServiceController.createHomeService
);

// Get all home service bookings
router.get('/', homeServiceController.getAllHomeServices);

// Get specific home service booking by ID
router.get('/:id', homeServiceController.getHomeServiceById);

// Update home service booking
router.put('/:id', homeServiceController.updateHomeService);

// Delete home service booking
router.delete('/:id', homeServiceController.deleteHomeService);

module.exports = router;
