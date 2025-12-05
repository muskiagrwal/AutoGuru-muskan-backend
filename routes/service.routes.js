const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 

//SERVICE controller path
const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} = require('../controllers/service.controller');

//SUB-SERVICE controller path
const {
    createSubService,
    getAllSubServices,
    getSubServicesByServiceId,
    getSubServiceById,
    updateSubService,
    deleteSubService
} = require('../controllers/subService.controller');

//SERVICE 
router.post('/', upload.single('image'), createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', upload.single('image'), updateService);
router.delete('/:id', deleteService);

// SUB-SERVICE
router.post('/sub-services', upload.single('image'), createSubService);
router.get('/sub-services', getAllSubServices);
router.get('/sub-services/service/:serviceId', getSubServicesByServiceId); // Get by Parent ID
router.get('/sub-services/:id', getSubServiceById);
router.put('/sub-services/:id', upload.single('image'), updateSubService);
router.delete('/sub-services/:id', deleteSubService);

module.exports = router;