/**
 * Simple Mechanic Auth Test - Email & Password Only
 */

const axios = require('axios');

console.log('\n🔧 Testing Mechanic Signup (Email & Password Only)...\n');

const signupData = {
    email: `test${Date.now()}@mechanic.com`,
    password: 'password123'
};

console.log('Signup Data:', JSON.stringify(signupData, null, 2));

axios.post('http://localhost:5000/api/auth/mechanic/signup', signupData)
    .then(response => {
        console.log('\n✅ SIGNUP SUCCESS!\n');
        console.log('Response:', JSON.stringify(response.data, null, 2));

        // Now test login
        console.log('\n🔐 Testing Mechanic Login...\n');
        return axios.post('http://localhost:5000/api/auth/mechanic/login', {
            email: signupData.email,
            password: signupData.password
        });
    })
    .then(response => {
        console.log('\n✅ LOGIN SUCCESS!\n');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        console.log('\n🎉 Both signup and login work with just email & password!\n');
    })
    .catch(error => {
        console.log('\n❌ ERROR!\n');
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
