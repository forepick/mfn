const http = require('http');
const https = require('https');
const oscillators = require('./helpers/oscillators');
const source = require('./sources/local_file');
const average = require('./helpers/average');

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');



Array.prototype.last = function() {
    return this[this.length -1];
}

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

    console.log("h=" + raw.h.last());
    console.log("l=" + raw.l.last());
    console.log("c=" + raw.c.last());
    console.log("o=" + raw.o.last());

    console.log("ma20=" + ma20.c_a.last());
    console.log("ma50=" + ma50.c_a.last());
    console.log("ma200=" + ma200.c_a.last());
    console.log("ema3=" + ema3.last());
    console.log("ema8=" + ema8.last());

    console.log("stoch line=" + stoch.line.last());
    console.log("stoch line=" + stoch.line.last());
    console.log("stoch line=" + stoch.line.last());
    console.log("stoch line=" + stoch.line.last());
    console.log("stoch signal=" + stoch.signal.last());

    console.log("rsi=" + rsi14.last());
    console.log("macd line=" + macd.line.last());
    console.log("macd signal=" + macd.signal.last());
    console.log("macd hist=" + macd.hist.last());

    console.log("bb lower=" + bb.lower.last());
    console.log("bb middle=" + bb.middle.last());
    console.log("bb upper=" + bb.upper.last());
    console.log("adx dip=" + adx.dip.last());
    console.log("adx dim=" + adx.dim.last());
    console.log("adx adx=" + adx.adx.last());

}
function enrich(rawData){
    // TODO trendlines: calk troughs, find all possible no-crossing slopes, sort by max throughs close to the slope
    let mins = minimas(rawData.c, rawData.o);
    oscillators.sma(mins, 5)
}

function round(value, accuracy){
    let mul = Math.pow(10, accuracy);
    return Math.floor(value * mul) / mul;
}
function runBackend(){

    const hostname = '127.0.0.1';
    const port = 3001;

    const server = http.createServer(async function(req, res) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        let rawData = await source.get();

        //enrich(rawData);

        let graphData = [];

        for (let i = 0; i < rawData.t.length; i++){
            graphData.push([rawData.t[i] * 1000, round(rawData.o[i], 2), round(rawData.h[i], 2), round(rawData.l[i], 2), round(rawData.c[i], 2)]);
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.end(JSON.stringify(graphData));
    });

    server.listen(port, hostname, () => {
        console.log(`Backend running at http://${hostname}:${port}/`);
    });
}
function runFrontend(){

    const port = 3000;
    const app = express();

    app.use(express.static(__dirname + '../../webapp/'));

    app.get('*', function (request, response) {
        response.sendFile(path.resolve(__dirname, '', 'graph.html'));
    });

    app.listen(port);
    console.log(`Frontend running at http://127.0.0.1:${port}/`);
}
runBackend();
runFrontend();

let list = [1,2,3,4,5,4,5,6,5,7,8,9,7,8,9];

// TODO solve the constant value issue (constant value for a few indices)
function throughs(values, smoothing) {
    smoothing = smoothing || 1;
    return values.map((v, k, l) => {
        if (k < smoothing) return -1;
        if (k >= l.length - smoothing) return -1;
        for(let i = 1; i <= smoothing; i++){
            if (v > l[k - i] || v > l[k + i]) return -1;
        }
        return k;
    }).filter(i => i > -1);
}


function minimas(c, o){
    return c.map((v, k) => Math.min(v, o[k]));
}
function maximas(c, o){
    return c.map((v, k) => Math.max(v, o[k]));
}
function peaks(values) {
    return values.map((v, k, l) => {
        if (k < 1) return -1;
        if (k >= l.length - 1) return -1;
        if (v >= l[k - 1] && v > l[k + 1]) return k;
        return -1;
    }).filter(i => i > -1);
}
function findSlope(values){
    let indices = throughs(values);
    let res = [];
    for (let i1 = 0; i1 < indices.length; i1++) {
x1:     for (let i2 = i1 + 1; i2 < indices.length; i2++) {
            console.log("new slope");
            let k1 = indices[i1];
            let k2 = indices[i2];
            let dx = k2 - k1;
            let dy = values[k2] - values[k1];
            let slope = dy/dx;

            let slopeScore = 0;
            for(let i = 0; i < indices.length; i++){
                if(i == i1 || i == i2){
                    continue;
                }
                let k = indices[i];
                let dxk = k - k1;
                let ddy = dxk * slope;
                let valueOnSlope = values[k1] + ddy;
                let currentValue = values[k];

                console.log(valueOnSlope, currentValue);

                if(currentValue < valueOnSlope){
                    continue x1;
                }
                let diff = Math.pow(currentValue - valueOnSlope, 2);
                slopeScore += 100 * Math.exp(diff);
            }
            res.push({k1: k1, k2: k2, score: slopeScore, slope: slope});
        }
    }

    res.sort((a,b) => a.score < b.score ? 1 : -1);
    return res;
}
/*
let slopes = findSlope(list);
console.log(slopes);*/


// iterate all slopes to find the best one
