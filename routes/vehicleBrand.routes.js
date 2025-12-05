const express = require('express');
const router = express.Router();

//vehicle brand
const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
    getBrandNames
} = require('../controllers/vehicleBrand.controller');

//vehicle-models
const {
    createModel,
    getAllModels,
    getModelsByBrand,
    getModelById,
    updateModel,
    deleteModel
} = require('../controllers/vehicleModel.controller');

//service-intervals
const {
    createInterval,
    getAllIntervals,
    getIntervalsByModel,
    getIntervalById,
    updateInterval,
    deleteInterval
} = require('../controllers/serviceInterval.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');


// router.use(protect);


//vehicle-brands
router.post('/vehicle-brands', createBrand);
router.get('/vehicle-brands/names', getBrandNames);
router.get('/vehicle-brands', getAllBrands);
router.get('/vehicle-brands/:id', getBrandById);
router.put('/vehicle-brands/:id', updateBrand);
router.delete('/vehicle-brands/:id', deleteBrand);


//vehicle-models
router.post('/vehicle-models', upload.single('image'), createModel);
router.get('/vehicle-models', getAllModels);
router.get('/vehicle-models/brand/:brandId', getModelsByBrand);
router.get('/vehicle-models/:id', getModelById);
router.put('/vehicle-models/:id',upload.single('image'), updateModel);

router.delete('/vehicle-models/:id', deleteModel);


//service-intervals
router.post('/service-intervals', createInterval);
router.get('/service-intervals', getAllIntervals);
router.get('/service-intervals/model/:modelId', getIntervalsByModel);
router.get('/service-intervals/:id', getIntervalById);
router.put('/service-intervals/:id', updateInterval);
router.delete('/service-intervals/:id', deleteInterval);


module.exports = router;