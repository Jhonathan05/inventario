const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'admin@cafedecolombia.com',
            password: 'password_here' // I don't know the password, but this should still reach the compare logic
        });
        console.log('Response:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();
