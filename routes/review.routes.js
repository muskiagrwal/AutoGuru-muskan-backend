const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createReview,
    getReviewsByMechanic,
    getUserReviews,
    mechanicResponse,
    voteHelpful
} = require('../controllers/review.controller');

// Public routes
router.get('/mechanic/:mechanicId', getReviewsByMechanic);

// Protected routes
router.post('/', protect, createReview);
router.get('/user', protect, getUserReviews);
router.post('/:id/respond', protect, mechanicResponse);
router.post('/:id/helpful', voteHelpful); // Can be voted by anyone

module.exports = router;
