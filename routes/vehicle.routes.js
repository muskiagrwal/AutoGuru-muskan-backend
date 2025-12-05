const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    addVehicle,
    getUserVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicle.controller');

// All vehicle routes require authentication
router.use(protect);

router.post('/', addVehicle);
router.get('/', getUserVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
