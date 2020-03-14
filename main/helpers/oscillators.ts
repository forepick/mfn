export function pointwise(operation: Function, ...serieses: Array<Array<number>>) {
    let result = [];
    for (let i = 0, len = serieses[0].length; i < len; i++) {
        let iseries = (i: number) => serieses.map(x => x[i]);
        result[i] = operation(...iseries(i));
    }
    return result;
}

export function rolling(operation: Function, series: Array<number>, window: number, center: boolean = false) {
    let result = [];
    for (let i = 0, len = series.length; i < len; i++) {
        let j = i + 1 - window;
        result.push(operation(series.slice((j > 0) ? j : 0, i + 1)));
    }
    return result;
}

export function sma(series: Array<number>, window: number) {
    return rolling((s: Array<number>) => mean(s), series, window);
}
export function sd(series: Array<number>) {
    let E = mean(series);
    let E2 = mean(pointwise((x: number) => x * x, series));
    return Math.sqrt(E2 - E * E);
}
export function mean(series: Array<number>) {
    let sum = 0;
    for (let i = 0; i < series.length; i++) {
        sum += series[i];
    }
    return sum / series.length;
}
export function stdev(series: Array<number>, window: number) {
    return rolling((s: Array<number>) => sd(s), series, window);
}

export function ema(series: Array<number>, window: number, start ?: number) {
    let weight = 2 / (window + 1);
    let ema = [ start ? start : mean(series.slice(0, window)) ];
    for (let i = 1, len = series.length; i < len; i++) {
        ema.push(series[i] * weight + (1 - weight) * ema[i - 1]);
    }
    return ema;
}


export function stoch($values, window: number, signal: number, smooth: number) {
    let $low = $values.l;
    let $high = $values.h;
    let $close = $values.c;


    let lowest = rolling((s: Array<number>) => Math.min(...s), $low, window);
    let highest = rolling((s: Array<number>) => Math.max(...s), $high, window);
    let K = pointwise((h: number, l: number, c: number) => 100 * (c - l) / (h - l), highest, lowest, $close);
    if (smooth > 1) { K = sma(K, smooth) }
    return { line: K, signal: sma(K, signal) };
}

export function rsi($close: Array<number>, window: number) {
    let gains = [0], loss = [1e-14];
    for (let i = 1, len = $close.length; i < len; i++) {
        let diff = $close[i] - $close[i - 1];
        gains.push(diff >= 0 ? diff : 0);
        loss.push(diff < 0 ? -diff : 0);
    }
    return pointwise((a: number, b: number) => 100 - 100 / (1 + a / b), ema(gains, 2 * window - 1), ema(loss, 2 * window - 1));
}

export function macd($close: Array<number>, winshort: number, winlong: number, winsig: number) {
    const line = pointwise((a: number, b: number) => a - b, ema($close, winshort), ema($close, winlong));
    const signal = ema(line, winsig);
    const hist = pointwise((a: number, b: number) => a - b, line, signal);
    return { line: line, signal: signal, hist: hist };
}

export function bb($close: Array<number>, window: number, mult: number) {
    let ma = sma($close, window);
    let dev = stdev($close, window);
    let upper = pointwise((a: number, b: number) => a + b * mult, ma, dev);
    let lower = pointwise((a: number, b: number) => a - b * mult, ma, dev);
    return { lower : lower, middle : ma, upper : upper };
}

/* price transformations */

export function typicalPrice($high: Array<number>, $low: Array<number>, $close: Array<number>) {
    return pointwise((a: number, b: number, c: number) => (a + b + c) / 3, $high, $low, $close);
}

export function trueRange($high: Array<number>, $low: Array<number>, $close: Array<number>) {
    let tr = [$high[0] - $low[0]];
    for (let i = 1, len = $low.length; i < len; i++) {
        tr.push(Math.max($high[i] - $low[i], Math.abs($high[i] - $close[i - 1]), Math.abs($low[i] - $close[i - 1])));
    }
    return tr;
}

/* Wilder's functions */

export function atr($high: Array<number>, $low: Array<number>, $close: Array<number>, window: number) {
    let tr = trueRange($high, $low, $close);
    return ema(tr, 2 * window - 1);
}

export function wilderSmooth(series: Array<number>, window: number) {

    let result = Array.apply(null, Array(window)).map(Number.prototype.valueOf, NaN);
    result.push(series.slice(1, window + 1).reduce((sum, item) => { return sum += item}, 0));
    for(let i = window + 1; i < series.length; i++) {
        result.push((1 - 1 / window) * result[i - 1] + series[i]);
    }
    return result;
}

export function adx($values, window: number) {

    // TODO implemen t with 6 and 8 as arguments

    let $low = $values.l;
    let $high = $values.h;
    let $close = $values.c;

    let dmp = [0], dmm = [0];
    for(let i = 1, len = $low.length; i < len; i++) {
        let hd = $high[i] - $high[i - 1];
        let ld = $low[i - 1] - $low[i];
        dmp.push((hd > ld) ? Math.max(hd, 0) : 0);
        dmm.push((ld > hd) ? Math.max(ld, 0) : 0);
    }
    let str = wilderSmooth(trueRange($high, $low, $close), window);
    dmp = wilderSmooth(dmp, window);
    dmm = wilderSmooth(dmm, window);
    let dip = pointwise((a: number, b: number) => 100 * a / b, dmp, str);
    let dim = pointwise((a: number, b: number) => 100 * a / b, dmm, str);
    let dx = pointwise((a: number, b: number) => 100 * Math.abs(a - b) / (a + b), dip, dim);
    return {dip: dip, dim: dim, adx: Array.apply(null, Array(window)).map(Number.prototype.valueOf ,NaN).concat(ema(dx.slice(window), 2 * window - 1))};
}

export function dmi($values, window: number) {
    return adx($values, window);
}
