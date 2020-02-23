const fetch = require("node-fetch");

module.exports = {
    get: async (from, to) => {
        const url = 'https://tvc4.forexpros.com/3fd5a8954c3ebd5a1ae4d89095e7d6e0/1581404449/1/1/8/history?symbol=42595&resolution=D&from=1550300617&to=1581404677';
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