const http = require('http');
const https = require('https');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});
/*
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});*/

https.get('https://tvc4.forexpros.com/06ccf5b9bc0a776b6b8cad099d6899a1/1580040219/1/1/8/history?symbol=42595&resolution=D&from=1548936242&to=1580040302', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        let obj = JSON.parse(data);

        let total = obj.o.reduce((a, c) => {
            a.tot = a.tot + c;
            a.count++;
            return a;
        }, {tot:0, count: 0});
        console.log(total)


    });

})