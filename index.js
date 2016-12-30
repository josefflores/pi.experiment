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

function rgbRandom() {
    function bitsOn(input, mask){
        return ((input & mask) > 0 ? 1 : 0);
    };

    var flags = getRandomInt(0, 7),
        r,g,b,
        FLAG_R = 4,
        FLAG_G = 2,
        FLAG_B = 1;

    // 000 OFF
    // 001 BLUE
    // 010 GREEN
    // 011 CYAN
    // 100 RED
    // 101 PINK
    // 110 YELLOW
    // 111 WHITE

    pins.r.write(r = bitsOn(flags, FLAG_R), function(){
        // if (r) console.log('R');
    });
    pins.g.write(g = bitsOn(flags, FLAG_G), function(){
        // if (g) console.log('G');
    });
    pins.b.write(b = bitsOn(flags, FLAG_B), function(){
        // if (b) console.log('B');
    });
};



var pins = {
    r: new Gpio(27, 'out'),
    g: new Gpio(17, 'out'),
    b: new Gpio(4, 'out'),
    b_in: new Gpio(23, 'out'),
    b_out: new Gpio(24, 'in', 'both')
};

// Feed power to button
pins.b_in.write(1, function(){
    console.log('button on');
});

pins.b_out.watch(function (err, value) {
    console.log(err, value);
    if (err) throw err;

    pins.r.write(value, function(){
        console.log('R');
    });
});

// Blink light
//interval = setInterval(rgbRandom, 2000);

// Kill power on exit
process.on('SIGINT', function() { //#F
    clearInterval(interval);

    for (var i in pins) {
        pins[i].writeSync(0); //#G
        pins[i].unexport();
    }

    process.exit();
});
