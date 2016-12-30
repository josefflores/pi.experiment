/**
 * Non electronic helper functions
 */

//  CLASS

/**
 * The utilities class for the raspberry pi experiments
 *
 * @class Util
 */
var Util = function(){

    //  FUNCTIONS

    /**
     *  Returns a random integer between min and max
     *
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     *
     *  @function getRandomInt
     *  @param min: <number>: lower include bound
     *  @param max: <number>: upper excluded bound
     *  @returns <number>: The random number within the range
     */
    var getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    return {
        getRandomInt: getRandomInt
    };
};

// EXPORTS

module.exports = Util;