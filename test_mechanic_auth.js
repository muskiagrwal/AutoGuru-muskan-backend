/**
 * Test Mechanic Authentication Endpoints
 * This script tests the mechanic signup and login functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const mechanicData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.mechanic@test.com',
    password: 'password123',
    businessName: 'John\'s Auto Repair',
    phone: '+61412345678',
    address: {
        street: '123 Main St',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        country: 'Australia'
    },
    servicesOffered: ['Logbook Service', 'Brake Repairs', 'Diagnostics'],
    abn: '12345678901',
    description: 'Professional auto repair service with 10+ years experience',
    priceRange: 'standard'
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testMechanicSignup() {
    log('\n=== Testing Mechanic Signup ===', 'blue');

    try {
        const response = await axios.post(`${BASE_URL}/mechanic/signup`, mechanicData);

        if (response.data.success) {
            log('PASS: Mechanic signup successful!', 'green');
            log(`User ID: ${response.data.user.id}`, 'green');
            log(`Mechanic ID: ${response.data.mechanic.id}`, 'green');
            log(`Business Name: ${response.data.mechanic.businessName}`, 'green');
            log(`Status: ${response.data.mechanic.status}`, 'green');
            log(`Token: ${response.data.token.substring(0, 20)}...`, 'green');
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            log(`FAIL: Signup failed: ${error.response.data.message}`, 'red');
            if (error.response.data.errors) {
                error.response.data.errors.forEach(err => {
                    log(`  - ${err.msg}`, 'yellow');
                });
            }
        } else {
            log(`FAIL: Error: ${error.message}`, 'red');
        }
        return null;
    }
}

async function testMechanicLogin() {
    log('\n=== Testing Mechanic Login ===', 'blue');

    try {
        const response = await axios.post(`${BASE_URL}/mechanic/login`, {
            email: mechanicData.email,
            password: mechanicData.password
        });

        if (response.data.success) {
            log('PASS: Mechanic login successful!', 'green');
            log(`User ID: ${response.data.user.id}`, 'green');
            log(`Email: ${response.data.user.email}`, 'green');
            log(`Role: ${response.data.user.role}`, 'green');
            log(`Business Name: ${response.data.mechanic.businessName}`, 'green');
            log(`Status: ${response.data.mechanic.status}`, 'green');
            log(`Verified: ${response.data.mechanic.isVerified}`, 'green');
            log(`Token: ${response.data.token.substring(0, 20)}...`, 'green');
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            log(`FAIL: Login failed: ${error.response.data.message}`, 'red');
        } else {
            log(`FAIL: Error: ${error.message}`, 'red');
        }
        return null;
    }
}

async function testInvalidLogin() {
    log('\n=== Testing Invalid Login ===', 'blue');

    try {
        await axios.post(`${BASE_URL}/mechanic/login`, {
            email: mechanicData.email,
            password: 'wrongpassword'
        });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            log('PASS: Invalid login correctly rejected', 'green');
        } else {
            log(`FAIL: Unexpected error: ${error.message}`, 'red');
        }
    }
}

async function testDuplicateSignup() {
    log('\n=== Testing Duplicate Signup ===', 'blue');

    try {
        await axios.post(`${BASE_URL}/mechanic/signup`, mechanicData);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            log('PASS: Duplicate signup correctly rejected', 'green');
            log(`Message: ${error.response.data.message}`, 'yellow');
        } else {
            log(`FAIL: Unexpected error: ${error.message}`, 'red');
        }
    }
}

async function runTests() {
    log('\n========================================', 'blue');
    log('  Mechanic Authentication Test Suite  ', 'blue');
    log('========================================', 'blue');

    // Test 1: Mechanic Signup
    const signupResult = await testMechanicSignup();

    if (signupResult) {
        // Test 2: Mechanic Login
        await testMechanicLogin();

        // Test 3: Invalid Login
        await testInvalidLogin();

        // Test 4: Duplicate Signup
        await testDuplicateSignup();
    }

    log('\n========================================', 'blue');
    log('         Tests Completed!             ', 'blue');
    log('========================================', 'blue');
    log('\nNote: You may need to manually delete the test user from MongoDB', 'yellow');
    log('to run these tests again.\n', 'yellow');
}

// Run the tests
runTests().catch(error => {
    log(`\nFATAL ERROR: ${error.message}`, 'red');
    process.exit(1);
});
