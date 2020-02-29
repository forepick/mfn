export function horizontal(values: Array<number>) {

}

export function trendline($values) {
    let $close = $values.c;
    let $open = $values.o;

    // TODO 1. get a list of minimum (maybe find minimums using SMA to get rid of noise)
    // TODO 2. starting from the latest minimum, find where this line meets as many minimums as possible (no crossing)
    // TODO 3. calculate all possible lines, give score for everyone of them, return the highest score line
    // TODO 4. it's also possible to end the line BELOW the latest minimum, but the distance from it will lower it's score
}

