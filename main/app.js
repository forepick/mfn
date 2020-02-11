const http = require('http');
const https = require('https');
const oscillators = require('./oscillators/oscillators');
const source = require('./sources/local_file');
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

    //fs.writeFileSync('./investing.com.wix.json', JSON.stringify(raw, null, 2));

    let stoch = oscillators.stoch(raw, 12, 3, 3);

    let ma20 = average(raw, 20);
    let ma50 = average(raw, 50);
    let ma200 = average(raw, 200);
    let ema3 = oscillators.ema(raw.c, 3);
    let ema8 = oscillators.ema(raw.c, 8);
    let rsi14 = oscillators.rsi(raw.c, 14);
    let macd = oscillators.macd(raw.c, 12, 26, 9);
    let bb = oscillators.bb(raw.c, 20, 2);
    let adx = oscillators.adx(raw, 14);

    console.log("h=" + raw.h.reverse()[0]);
    console.log("l=" + raw.l.reverse()[0]);
    console.log("c=" + raw.c.reverse()[0]);
    console.log("o=" + raw.o.reverse()[0]);

    console.log("ma20=" + ma20.c_a.reverse()[0]);
    console.log("ma50=" + ma50.c_a.reverse()[0]);
    console.log("ma200=" + ma200.c_a.reverse()[0]);
    console.log("ema3=" + ema3.reverse()[0]);
    console.log("ema8=" + ema8.reverse()[0]);

    console.log("stoch line=" + stoch.line.reverse()[0]);
    console.log("stoch signal=" + stoch.signal.reverse()[0]);

    console.log("rsi=" + rsi14.reverse()[0]);
    console.log("macd line=" + macd.line.reverse()[0]);
    console.log("macd signal=" + macd.signal.reverse()[0]);
    console.log("macd hist=" + macd.hist.reverse()[0]);

    console.log("bb lower=" + bb.lower.reverse()[0]);
    console.log("bb middle=" + bb.middle.reverse()[0]);
    console.log("bb upper=" + bb.upper.reverse()[0]);
    console.log("adx dip=" + adx.dip.reverse()[0]);
    console.log("adx dim=" + adx.dim.reverse()[0]);
    console.log("adx adx=" + adx.adx.reverse()[0]);

}

process();
