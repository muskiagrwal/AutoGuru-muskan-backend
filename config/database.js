const mongoose = require('mongoose');

/**
 * Database Configuration Module
 * Handles MongoDB connection and configuration
 */

const connectDatabase = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dummy:dummy@cluster0.mongodb.net/autoguru';

        await mongoose.connect(MONGODB_URI, {
            // Mongoose 6+ doesn't need these options, but keeping for compatibility
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB successfully');
        console.log(`Database: ${mongoose.connection.name}`);

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
    console.error('MongoDB error:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = { connectDatabase };
