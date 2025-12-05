/**
 * Simple Mechanic Signup Test
 */

const axios = require('axios');

const mechanicData = {
    firstName: 'Test',
    lastName: 'Mechanic',
    email: `test${Date.now()}@mechanic.com`, // Unique email
    password: 'password123',
    businessName: 'Test Auto Repair',
    phone: '+61412345678'
};

console.log('\nTesting Mechanic Signup...\n');
console.log('Data:', JSON.stringify(mechanicData, null, 2));

axios.post('http://localhost:5000/api/auth/mechanic/signup', mechanicData)
    .then(response => {
        console.log('\nSUCCESS! Mechanic signup worked!\n');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        console.log('\nSummary:');
        console.log(`- User ID: ${response.data.user.id}`);
        console.log(`- Email: ${response.data.user.email}`);
        console.log(`- Role: ${response.data.user.role}`);
        console.log(`- Business: ${response.data.mechanic.businessName}`);
        console.log(`- Status: ${response.data.mechanic.status}`);
        console.log(`- Token: ${response.data.token.substring(0, 30)}...`);
        console.log('\nMongoDB integration is working!\n');
    })
    .catch(error => {
        console.log('\nERROR!\n');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Message:', error.response.data.message);
            if (error.response.data.errors) {
                console.log('Validation Errors:', error.response.data.errors);
            }
        } else if (error.request) {
            console.log('No response from server. Is the server running?');
            console.log('Run: npm start');
        } else {
            console.log('Error:', error.message);
        }
        process.exit(1);
    });
