require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

// Import configuration
const { connectDatabase } = require('./config/database');
const logger = require('./utils/logger');
const socketUtil = require('./utils/socket');

// Import routes
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const homeServiceRoutes = require('./routes/homeService.routes');
const contactRoutes = require('./routes/contact.routes');
const mechanicRoutes = require('./routes/mechanic.routes');
const quoteRoutes = require('./routes/quote.routes');
const reviewRoutes = require('./routes/review.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const notificationRoutes = require('./routes/notification.routes');
const uploadRoutes = require('./routes/upload.routes');
const brandRoutes = require('./routes/vehicleBrand.routes')

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const httpServer = http.createServer(app);
const io = socketUtil.init(httpServer);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // User joins their personal room
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Connect to MongoDB
connectDatabase();

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'AutoGuru Backend API is running',
        version: '2.3.0',
        endpoints: {
            auth: '/api/auth',
            bookings: '/api/bookings',
            homeService: '/api/home-service',
            contact: '/api/contact',
            mechanics: '/api/mechanics',
            quotes: '/api/quotes',
            reviews: '/api/reviews',
            vehicles: '/api/vehicles',
            notifications: '/api/notifications',
            uploads: '/api/uploads'
        },
        documentation: 'See README.md for full API documentation'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/home-service', homeServiceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/brands', brandRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/api/uploads', uploadRoutes);

// 404 Handler - Must be after all routes
app.use(notFoundHandler);

// Global Error Handler - Must be last
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
    logger.success(`Server running on http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`JWT authentication enabled`);
    logger.info(`MongoDB storage configured`);
    logger.info(`Socket.io enabled for real-time updates`);
    console.log(`\nAPI Documentation:`);
    console.log(`   Health Check: GET /`);
    console.log(`   Auth Endpoints: /api/auth/*`);
    console.log(`   Booking Endpoints: /api/bookings/*`);
    console.log(`   Upload Endpoints: /api/uploads/*`);
    console.log(`\nReady to connect with AutoGuru frontend!\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

module.exports = app;
