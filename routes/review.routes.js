const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createReview,
    getReviewsByMechanic,
    getUserReviews,
    mechanicResponse
} = require('../controllers/review.controller');

// Public routes
router.get('/mechanic/:mechanicId', getReviewsByMechanic);

// Protected routes
router.post('/', protect, createReview);
router.get('/user', protect, getUserReviews);
router.post('/:id/respond', protect, mechanicResponse);

module.exports = router;
