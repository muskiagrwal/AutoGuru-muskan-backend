const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadImage, uploadMultipleImages } = require('../controllers/upload.controller');

// Protect all upload routes
router.use(protect);

// Upload single image
router.post('/', upload.single('image'), uploadImage);

// Upload multiple images (max 5)
router.post('/multiple', upload.array('images', 5), uploadMultipleImages);

module.exports = router;
