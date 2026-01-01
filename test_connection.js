const http = require('http');

setTimeout(() => {
    const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/categories',
        method: 'GET'
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Status Code:', res.statusCode);
            console.log('Response Body:', data);
            process.exit(0); // Success
        });
    });

    req.on('error', (e) => {
        console.error('Request Error:', e);
        process.exit(1);
    });

    req.end();
}, 2000); // 2 saniye bekle server başlasın
