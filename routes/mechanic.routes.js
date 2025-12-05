const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getAllMechanics,
    getMechanicById,
    registerMechanic,
    updateMechanic,
    getMechanicReviews,
    updateMechanicStatus
} = require('../controllers/mechanic.controller');

// Public routes
router.get('/', getAllMechanics);
router.get('/:id', getMechanicById);
router.get('/:id/reviews', getMechanicReviews);

// Protected routes
router.post('/', protect, registerMechanic);
router.put('/:id', protect, updateMechanic);
router.put('/:id/status', updateMechanicStatus);

module.exports = router;
