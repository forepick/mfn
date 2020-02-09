const core = require('./core');


module.exports = function(values, length) {

    if(values.c < length){
        return null;
    }


    let c = values.c;

    let avg = core.rolling(function(sublist){
        return sublist.reduce(function (accumulator, currentValue){
            return accumulator + currentValue;
        }, 0) / sublist.length;
    }, c, length)

    return {
        c_a: avg,
        t: values.t.slice(length - 1, values.length)
    };
}