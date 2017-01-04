/**
 *  Handles rgb led states
 */

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
var RGB = function (obj) {

    // VARIABLES

    var cyclePosition = 0,
        mask = {
            r: 4,
            g: 2,
            b: 1
        },
        p = {
            r: new Gpio(obj.pin_r, 'out'),
            g: new Gpio(obj.pin_g, 'out'),
            b: new Gpio(obj.pin_b, 'out')
        },
        ret = {
            state: state,
            randomize: randomize,
            cycle: cycle,
            delay: delay
        };

    // FUNCTIONS

    /**
     *  Randomly chooses an RGB state
     *  @function randomize
     */
    function randomize() {
        state((new Util).getRandomInt(0, 7));
        return ret;
    };

    /**
     *  Delays the execution of a function while returning the object for chaining.
     *
     * @param time: <int>: The delay length in milliseconds
     * @param cb: <func>: The function to called
     * @return obj: <obj>: The led object
     */
    function delay(time, cb) {
        setTimeout(cb, time);
        return ret;
    }

    /**
     * Sets an led to a given state
     * N - RGB - STATE
     * 0 - 000 - OFF
     * 1 - 001 - BLUE
     * 2 - 010 GREEN
     * 3 - 011 CYAN
     * 4 - 100 RED
     * 5 - 101 PURPLE
     * 6 - 110 YELLOW
     * 7 - 111 WHITE
     *
     * @param val: <int>: The state value
     * @param val: <int>: The delay time
     */
    function state(val, time) {

        if (time) {
            return delay(time, function () {
                ret.state(val)
            });
        }

        pin = new Pins();

        //  Colorize led
        ['r', 'g', 'b'].forEach(function(input){
            p[input].write(pin.flip(val, mask[input]),
                function () {});
        });

        return ret;
    };

    /**
     * Cycles through the RGB states every time it is called.
     *
     * @function cycle
     */
    function cycle() {
        state((cyclePosition = (cyclePosition + 1) % 8));
        return ret;
    };

    return ret;
};

// EXPORTS

module.exports = RGB;