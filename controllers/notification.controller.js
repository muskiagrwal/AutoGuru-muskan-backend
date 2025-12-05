const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/response');
const socketUtil = require('../utils/socket');

// Get all notifications for logged-in user
exports.getUserNotifications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = { userId: req.user.id };

        // Filter by read status if provided
        if (req.query.unreadOnly === 'true') {
            filter.isRead = false;
        }

        const total = await Notification.countDocuments(filter);

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const unreadCount = await Notification.countDocuments({
            userId: req.user.id,
            isRead: false
        });

        return successResponse(res, {
            notifications,
            unreadCount,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }, 'Notifications retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!notification) {
            return errorResponse(res, 'Notification not found', 404);
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

        return successResponse(res, notification, 'Notification marked as read');
    } catch (error) {
        next(error);
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
    try {
        const result = await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        return successResponse(res, {
            modifiedCount: result.modifiedCount
        }, 'All notifications marked as read');
    } catch (error) {
        next(error);
    }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!notification) {
            return errorResponse(res, 'Notification not found', 404);
        }

        return successResponse(res, null, 'Notification deleted successfully');
    } catch (error) {
        next(error);
    }
};

// Create notification (internal use by other controllers)
exports.createNotification = async (userId, type, title, message, relatedId = null, relatedModel = null, priority = 'medium') => {
    try {
        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            relatedId,
            relatedModel,
            priority
        });

        // Emit real-time notification
        try {
            const io = socketUtil.getIO();
            io.to(userId.toString()).emit('notification', notification);
        } catch (socketError) {
            console.error('Socket emission error:', socketError.message);
            // Don't fail the request if socket fails
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};
