const fs = require('fs');

module.exports = {
    get: function(){
        return JSON.parse(fs.readFileSync('./main/sources/investing.com.wix.json'));
    }
}