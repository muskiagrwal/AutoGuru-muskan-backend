const fs = require('fs');

async function testEndpoints() {
    const baseUrl = 'http://localhost:5000';
    let logOutput = '';

    function log(message) {
        console.log(message);
        logOutput += message + '\n';
    }

    log('Testing AutoGuru Backend Endpoints...\n');

    try {
        // 1. Health Check
        log('1. Checking Health Endpoint...');
        const healthRes = await fetch(`${baseUrl}/`);
        const healthData = await healthRes.json();

        if (healthData.success) {
            log('Server is running!');
            log(`   Version: ${healthData.version}`);
            log('   New Endpoints detected:');
            log(`   - Mechanics: ${healthData.endpoints.mechanics}`);
            log(`   - Quotes: ${healthData.endpoints.quotes}`);
            log(`   - Reviews: ${healthData.endpoints.reviews}`);
            log(`   - Vehicles: ${healthData.endpoints.vehicles}`);
        } else {
            log('Server health check failed');
        }

        log('\n-----------------------------------\n');

        // 2. Check Mechanics Endpoint (Public)
        log('2. Checking Mechanics List (Public)...');
        const mechRes = await fetch(`${baseUrl}/api/mechanics`);
        const mechData = await mechRes.json();

        if (mechData.success) {
            log('Mechanics endpoint is accessible');
            log(`   Count: ${mechData.data ? mechData.data.length : 0}`);
        } else {
            log('Failed to fetch mechanics: ' + mechData.message);
        }

    } catch (error) {
        log('Error connecting to server: ' + error.message);
        log('   Make sure the server is running on port 5000');
    }

    fs.writeFileSync('verification_log.txt', logOutput, 'utf8');
}

testEndpoints();
