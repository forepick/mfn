const assert = require('assert');
const core = require('../main/oscillators/core')

describe('Testing Core', function() {
    describe('Rolling Function', function() {
        it('should roll given function', function() {

            let list = [3,4,5,6,7,8];
            let res = core.rolling(
                sublist =>
                        sublist.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / sublist.length,
                list, 3)
            console.log(res)

        });
    });

    describe('Pointwise Function', function() {
        it('should pointwise given function', function() {

            let list1 = [3,4,5,6,7,8];
            let list2 = [5,6,7,8,9,10];
            let res = core.pointwise((a, b) => a + b, list1, list2);

            console.log(res)

        });
    });
});