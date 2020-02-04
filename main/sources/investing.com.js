const fetch = require("node-fetch");

module.exports = {
    get: async (from, to) => {
        const url = 'https://tvc4.forexpros.com/06ccf5b9bc0a776b6b8cad099d6899a1/1580040219/1/1/8/history?symbol=42595&resolution=D&from=1548936242&to=1580040302';
        try {
            const response = await fetch(url);
            const json = await response.json();
            return json;
        }
        catch(error){
            return null;
        }

    }
}