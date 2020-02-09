const http = require('http');
const https = require('https');
const stochastic = require('./oscillators/stochastic');
const source = require('./sources/investing.com');
const average = require('./oscillators/average');

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

async function process(){
    let raw = await source.get();
    //console.log(average(raw, 50));
    console.log(stochastic(raw, 50, 7, 4));

}

process();
