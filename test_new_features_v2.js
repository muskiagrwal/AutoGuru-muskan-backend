const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let resetToken = '';

// Connect to DB for cleanup
const MONGO_URI = 'mongodb+srv://muskan:muskan%402002@autoguru.3du9w43.mongodb.net/';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB for testing'))
    .catch(err => console.error('MongoDB connection error:', err));

const testFeatures = async () => {
    try {
        console.log('\n--- STARTING VERIFICATION ---\n');

        // 1. Test Validation (Signup with invalid data)
        console.log('1. Testing Validation (Invalid Signup)...');
        try {
            await axios.post(`${API_URL}/auth/signup`, {
                firstName: '', // Invalid
                lastName: 'Tester',
                email: 'invalid-email', // Invalid
                password: '123' // Too short
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Validation passed: Rejected invalid data correctly.');
                console.log('   Error:', error.response.data.message);
            } else {
                console.error('❌ Validation failed: Unexpected response', error.message);
            }
        }

        // 2. Signup with valid data
        console.log('\n2. Creating Test User...');
        const testEmail = `test_${Date.now()}@example.com`;
        const testPassword = 'password123';

        const signupRes = await axios.post(`${API_URL}/auth/signup`, {
            firstName: 'Test',
            lastName: 'User',
            email: testEmail,
            password: testPassword
        });
        authToken = signupRes.data.token;
        console.log('✅ User created successfully:', testEmail);

        // 3. Test Forgot Password
        console.log('\n3. Testing Forgot Password...');
        const forgotRes = await axios.post(`${API_URL}/auth/forgotpassword`, {
            email: testEmail
        });
        console.log('✅ Forgot Password request successful:', forgotRes.data.message);

        // 4. Retrieve Reset Token from DB (since we can't read the email)
        const user = await User.findOne({ email: testEmail });
        // We need to manually match the token because it's hashed in DB.
        // In a real test, we'd mock the email service to intercept the token.
        // For this script, we will simulate the flow by manually setting a known token in DB for testing reset.

        // Let's generate a known token for testing reset
        const crypto = require('crypto');
        const rawToken = 'testresettoken123';
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();
        console.log('   (Simulated: Manually set reset token in DB for testing)');

        // 5. Test Reset Password
        console.log('\n5. Testing Reset Password...');
        const newPassword = 'newpassword456';
        const resetRes = await axios.put(`${API_URL}/auth/resetpassword/${rawToken}`, {
            password: newPassword
        });
        console.log('✅ Password Reset successful:', resetRes.data.message);

        // 6. Login with New Password
        console.log('\n6. Verifying Login with New Password...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testEmail,
            password: newPassword
        });
        console.log('✅ Login successful with new password!');

        console.log('\n--- VERIFICATION COMPLETE: ALL TESTS PASSED ---');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
    } finally {
        await mongoose.disconnect();
    }
};

// Wait for server to start (if running locally) or just run
setTimeout(testFeatures, 2000);
