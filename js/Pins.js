// Resets all GPIO pins to zero incase anything was stuck

// IMPORTS
var onoff = require('onoff');

var Gpio = onoff.Gpio,
    interval;

// Available pins
var pins = [4, 5, 6, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

/**
 *  Flip a bit on or off based on bit mask.
 *
 *  @function flip
 *  @param input: <int>: The value to check against
 *  @param mask: <int>: The binary on mask
 *  @return <int>: 1: bit is on
 *  @return <int>: 0: bit is off
 */
var flip = function(input, mask){
    return ((input & mask) > 0 ? 1 : 0);
};

/**
 *  Resets a pin back to off, this is a problem because during early
 *  experimentation some of the pins were leaking.
 *
 *  @function reset
 *  @param pin: <int>: A pin to reset
 *  @return <bool>: true: The pin was reset
 *  @return <bool>: false: The pin was not reset
 */
var reset = function(pin){
    if (!(pins.indexOf(pin) + 1))
        return false;

    var p = new Gpio(pin, 'out');
    p.write(0, function () {
        p.writeSync(0);
        p.unexport();
    });

    return true;
}

var resetAll = function() {
    pins.forEach(reset);
};

//  EXPORTS

module.exports = {
    flip: flip,
    reset: reset,
    resetAll: resetAll
};
