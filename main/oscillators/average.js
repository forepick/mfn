module.exports = function(values, length) {
    if(values.c < length){
        return null;
    }
    let c = values.c;
    let sums = [];
    let sum = 0;
    for (let i = 0; i < c.length; i++){
        sum += c[i];
        sums[i] = sum;
        if(i >= length) {
            sums[i] -= sums[i - length];
        }
    }

    return {
        c_a: sums.slice(length - 1, sums.length).map(s => s / length),
        t: values.t.slice(length - 1, sums.length)
    };
}