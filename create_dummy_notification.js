require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');
const { connectDatabase } = require('./config/database');

const createDummyData = async () => {
    try {
        // 1. Connect to DB
        await connectDatabase();

        // 2. Find a user to attach notification to
        let user = await User.findOne();

        if (!user) {
            console.log('No users found. Creating a temporary test user...');
            user = await User.create({
                firstName: 'Test',
                lastName: 'User',
                email: `test${Date.now()}@example.com`,
                password: 'password123'
            });
        }

        console.log(`Using user: ${user._id}`);

        // 3. Create a dummy notification
        const notification = await Notification.create({
            userId: user._id,
            type: 'system',
            title: 'Test Notification',
            message: 'This is a test notification to verify MongoDB integration.',
            priority: 'high'
        });

        console.log('SUCCESS: Notification created successfully!');
        console.log('Notification ID:', notification._id);
        console.log('\nNOW GO CHECK MONGODB COMPASS!');
        console.log('You should see a new "notifications" collection.');

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

createDummyData();
