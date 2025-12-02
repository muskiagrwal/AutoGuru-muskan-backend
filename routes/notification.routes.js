const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require('../controllers/notification.controller');

// All notification routes require authentication
router.use(protect);

router.get('/', getUserNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
