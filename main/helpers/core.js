module.exports = {

    rolling: function(op, list, window){
        let result = [];
        for (let i = 0, len = list.length; i < len; i++) {
            let j = i + 1 - window;
            result.push(op(list.slice((j > 0) ? j : 0, i + 1)));
        }
        return result.slice(window - 1, list.length);
    },
    pointwise: function(op, ...lists){
        let result = [];
        for (let i = 0, len = lists[0].length; i < len; i++) {
            let i_list = j => lists.map(x => x[j]);
            result[i] = op(...i_list(i));
        }
        return result;
    },
    mean: function(list){
        return list.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / list.length;
    },
    avg: function(list, window){
        let op = sublist =>
            this.mean(sublist);
        return this.rolling(op, list, window);
    }
}

