/**
 * Test Script for New API Enhancements
 * Run this after starting the server to verify all new features work
 */

const BASE_URL = 'http://localhost:5000';

// Test 1: Enhanced Mechanic Search with Pagination
async function testMechanicSearch() {
    console.log('\nTesting Enhanced Mechanic Search...');

    try {
        const response = await fetch(`${BASE_URL}/api/mechanics?page=1&limit=5&sortBy=rating`);
        const data = await response.json();

        if (data.success && data.data.pagination) {
            console.log('Mechanic search with pagination works!');
            console.log(`   Found ${data.data.pagination.total} mechanics`);
            console.log(`   Page ${data.data.pagination.page} of ${data.data.pagination.pages}`);
        } else {
            console.log('Mechanic search failed');
        }
    } catch (error) {
        console.log('Error:', error.message);
    }
}

// Test 2: Health Check with New Endpoints
async function testHealthCheck() {
    console.log('\nTesting Health Check...');

    try {
        const response = await fetch(`${BASE_URL}/`);
        const data = await response.json();

        if (data.success && data.endpoints.notifications) {
            console.log('Health check works!');
            console.log('   Available endpoints:', Object.keys(data.endpoints).join(', '));
        } else {
            console.log('Health check failed');
        }
    } catch (error) {
        console.log('Error:', error.message);
    }
}

// Test 3: Verify New Routes Exist
async function testRouteExistence() {
    console.log('\nTesting New Routes...');

    const routes = [
        { path: '/api/notifications', method: 'GET', requiresAuth: true },
        { path: '/api/quotes/compare', method: 'GET', requiresAuth: true },
        { path: '/api/mechanics', method: 'GET', requiresAuth: false }
    ];

    for (const route of routes) {
        try {
            const response = await fetch(`${BASE_URL}${route.path}`);

            if (route.requiresAuth && response.status === 401) {
                console.log(`${route.path} - Protected route works (401 Unauthorized)`);
            } else if (!route.requiresAuth && response.status === 200) {
                console.log(`${route.path} - Public route works (200 OK)`);
            } else {
                console.log(`${route.path} - Status: ${response.status}`);
            }
        } catch (error) {
            console.log(`${route.path} - Error: ${error.message}`);
        }
    }
}

// Run all tests
async function runTests() {
    console.log('Starting API Enhancement Tests...');
    console.log('====================================');

    await testHealthCheck();
    await testMechanicSearch();
    await testRouteExistence();

    console.log('\n====================================');
    console.log('Tests completed!');
    console.log('\nNote: For full testing, you need to:');
    console.log('1. Create a user account (POST /api/auth/signup)');
    console.log('2. Login to get a token (POST /api/auth/login)');
    console.log('3. Test protected endpoints with the token');
}

// Execute tests
runTests().catch(console.error);
