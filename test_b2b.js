// Test B2B Registration Endpoint
const testData = {
    businessName: 'Test Auto Care',
    abn: '12345678901',
    contactName: 'John Smith',
    email: 'john@testauto.com',
    phone: '0400000000',
    address: '123 Test St, Sydney NSW 2000',
    serviceTypes: ['Mechanical Repairs', 'Car Servicing'],
    documents: {
        registration: {
            name: 'cert.pdf',
            base64: 'data:application/pdf;base64,test'
        },
        insurance: {
            name: 'insurance.pdf',
            base64: 'data:application/pdf;base64,test'
        }
    }
};

fetch('http://localhost:5000/api/b2b/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(testData)
})
    .then(response => response.json())
    .then(data => {
        console.log('\nB2B Registration Test:');
        console.log(JSON.stringify(data, null, 2));

        // Test GET all proposals
        console.log('\nTesting GET all B2B proposals (without auth):');
        return fetch('http://localhost:5000/api/b2b');
    })
    .then(response => response.json())
    .then(data => {
        console.log(JSON.stringify(data, null, 2));

        // Test health check
        console.log('\nTesting Health Check:');
        return fetch('http://localhost:5000/');
    })
    .then(response => response.json())
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
        console.log('\nAll B2B backend tests completed!');
        process.exit(0);
    })
    .catch(error => {
        console.error('ERROR:', error.message);
        process.exit(1);
    });
