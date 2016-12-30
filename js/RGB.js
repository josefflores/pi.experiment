// IMPORTS

var onoff = require('onoff');

var Pins = require('./Pins');
var Util = require('./Util');

var Gpio = onoff.Gpio;

//  CLASS

/**
 * The RGB led class for the raspberry pi experiments
 *
 * @class RGB
 * @param pin_r: <int>: The red input pin
 * @param pin_g: <int>: The green input pin
 * @param pin_b: <int>: The blue input pin
 */
var RGB = function (pin_r, pin_g, pin_b){

    // VARIABLES

    var cyclePosition = 0,
        mask = {
            R: 4,
            G: 2,
            B: 1
        },
        p = {
            r: new Gpio(pin_r, 'out'),
            g: new Gpio(pin_g, 'out'),
            b: new Gpio(pin_b, 'out')
        };

    // FUNCTIONS

    /**
     *  Randomly chooses an RGB state
     *  @function random
     */
    function random() {
        state(Util.getRandomInt(0, 7));
    };

    /**
     * Sets an led to a given state
     * N - RGB - STATE
     * 0 - 000 - OFF
     * 1 - 001 - BLUE
     * 2 - 010 GREEN
     * 3 - 011 CYAN
     * 4 - 100 RED
     * 5 - 101 PINK
     * 6 - 110 YELLOW
     * 7 - 111 WHITE
     *
     * @param val: <int>: The state value
     */
    function state(val){
        console.log(Pins);

        //  RED
        p.r.write(Pins.flip(val, mask.R),
            function(){});
        //  GREEN
        p.g.write(Pins.flip(val, mask.G),
            function(){});
        // BLUE
        p.b.write(Pins.flip(val, mask.B),
            function(){});
    };

    /**
     * Cycles through the RGB states every time it is called.
     *
     * @function cycle
     */
    function cycle() {
        cyclePosition = (cyclePosition + 1) % 8;
        state(cyclePosition);
    };

    return {
        state: state,
        randomize: random,
        cycle: cycle
    };
};

// EXPORTS

module.exports = RGB;
