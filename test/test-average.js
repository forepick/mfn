const assert = require('assert');
const average = require('../main/helpers/average')

describe('Moving Average', function() {
    describe('#indexOf()', function() {
        it('should return 3 correct values', function() {

            let data = {
                c: [1,2,3,4,5],
                t: [123, 124, 125, 126, 127]
            }
            let avg = average(data, 4);

            assert.deepEqual(avg.c_a, [ 2.5, 3.5 ]);
            assert.deepEqual(avg.t, [ 126, 127 ]);
        });
    });
});