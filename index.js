// IMPORTS
var onoff = require('onoff');

var Gpio = onoff.Gpio,
    interval;

/**
 *  Opens or closes a pin
 *
 *  @function match
 *  @param key: <number>: The key to try
 *  @param lock: <array<number>> | <number>: The keys that open the circuit
 *  @return <bool>: The current state of the pin
 */
function match(val, target) {
    if ((typeof(target) == 'array'  && target.indexOf(val) + 1 ) ||
        (typeof(target) == 'number' && target == val))
        return true;
    return false;
}

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
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

var pins = {
    r: new Gpio(27, 'out'),
    g: new Gpio(17, 'out'),
    b: new Gpio(4, 'out')
};

function rgbRandom() {
    var flags = getRandomInt(0, 7);
        FLAG_R = 4,
        FLAG_G = 2,
        FLAG_B = 1;

    console.log(flags & FLAG_R,
                flags & FLAG_G,
                flags & FLAG_B);

    pins.r.write(flags & FLAG_R ? true : false, function(){});
    pins.g.write(flags & FLAG_G ? true : false, function(){});
    pins.b.write(flags & FLAG_B ? true : false, function(){});
};

interval = setInterval(rgbRandom, 2000);

process.on('SIGINT', function() { //#F
    clearInterval(interval);

    for (var i in pins) {
        pins[i].writeSync(0); //#G
        pins[i].unexport();
    }

    process.exit();
});
