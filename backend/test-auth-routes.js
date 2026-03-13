const http = require('http');

async function callApi(method, path, token, data = null) {
    return new Promise((resolve, reject) => {
        const bodyStr = data ? JSON.stringify(data) : '';
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        if (bodyStr) {
            options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
        }

        const req = http.request(options, (res) => {
            let resBody = '';
            res.on('data', (c) => resBody += c);
            res.on('end', () => resolve({ status: res.statusCode, body: resBody }));
        });
        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

async function main() {
    try {
        // 1. Get token
        const loginRes = await callApi('POST', '/api/auth/login', '', {
            email: 'admin@cafedecolombia.com',
            password: 'C0m1t3*'
        });
        
        if (loginRes.status !== 200) {
            console.error('Login failed:', loginRes.body);
            return;
        }
        
        const { token } = JSON.parse(loginRes.body);
        console.log('Login success. Token obtained.');

        // 2. Call /api/actas
        const actasRes = await callApi('GET', '/api/actas', token);
        console.log('GET /api/actas STATUS:', actasRes.status);
        console.log('GET /api/actas BODY:', actasRes.body.substring(0, 200));

    } catch (e) {
        console.error('Error:', e);
    }
}

main();
