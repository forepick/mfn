const core = require('./core');

module.exports = function(values, length, signal, smooth) {

    if(values.c < length){ return null; }
    if(values.l < length){ return null; }
    if(values.h < length){ return null; }

    let c = values.c;
    let l = values.l;
    let h = values.h;

    let avg = sublist =>
        sublist.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / sublist.length;

    let lowest = core.rolling(s => Math.min(...s), l, length);
    let highest = core.rolling(s => Math.min(...s), h, length);
    let K = core.pointwise((hv, lv, cv) => 100 * (cv - lv) / (hv - lv), highest, lowest, c);

    if (smooth > 1) { K = core.rolling(avg, K, smooth) }

    return { line: K, signal: core.rolling(avg, K, signal)};
}