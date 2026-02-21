const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/catalogos',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer test-token' // This will likely fail with 403 but at least should show up in logs
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
