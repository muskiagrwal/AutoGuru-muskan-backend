// Native fetch is available in Node.js 18+

async function testEndpoints() {
    const baseUrl = 'http://localhost:5000';

    console.log('🧪 Testing AutoGuru Backend Endpoints...\n');

    try {
        // 1. Health Check
        console.log('1. Checking Health Endpoint...');
        const healthRes = await fetch(`${baseUrl}/`);
        const healthData = await healthRes.json();

        if (healthData.success) {
            console.log('✅ Server is running!');
            console.log(`   Version: ${healthData.version}`);
            console.log('   New Endpoints detected:');
            console.log(`   - Mechanics: ${healthData.endpoints.mechanics}`);
            console.log(`   - Quotes: ${healthData.endpoints.quotes}`);
            console.log(`   - Reviews: ${healthData.endpoints.reviews}`);
            console.log(`   - Vehicles: ${healthData.endpoints.vehicles}`);
        } else {
            console.error('❌ Server health check failed');
        }

        console.log('\n-----------------------------------\n');

        // 2. Check Mechanics Endpoint (Public)
        console.log('2. Checking Mechanics List (Public)...');
        const mechRes = await fetch(`${baseUrl}/api/mechanics`);
        const mechData = await mechRes.json();

        if (mechData.success) {
            console.log('✅ Mechanics endpoint is accessible');
            console.log(`   Count: ${mechData.data ? mechData.data.length : 0}`);
        } else {
            console.error('❌ Failed to fetch mechanics:', mechData.message);
        }

    } catch (error) {
        console.error('❌ Error connecting to server:', error.message);
        console.log('   Make sure the server is running on port 5000');
    }
}

// Run the test
testEndpoints();
