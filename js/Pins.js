/**
 *  Resets all GPIO pins to zero incase anything was stuck.
 */

// IMPORTS

var onoff = require('onoff');

var Gpio = onoff.Gpio;

//  CLASS

/**
 *  The Pin class for the raspberry pi experiments
 */
class Pins {

    constructor(obj = {}) {
            obj.pins = [4, 5, 6, 12, 13, 16, 17, 18, 19,
                20, 21, 22, 23, 24, 25, 26, 27
            ];
        }
        //  VARIABLES

    /**
     *  Flip a bit on or off based on bit mask.
     *
     *  @function flip
     *  @param input: <int>: The value to check against
     *  @param mask: <int>: The binary on mask
     *  @return <int>: 1: bit is on
     *  @return <int>: 0: bit is off
     */
    flip(input, mask) {
        return ((input & mask) > 0 ? 1 : 0);
    }

    /**
     *  Resets a pin back to off, this is a problem because during early
     *  experimentation some of the pins were leaking.
     *
     *  @function reset
     *  @param pin: <int>: A pin to reset
     *  @return <bool>: true: The pin selection was valid
     *  @return <bool>: false: The pin selection was invalid
     */
    reset(pin) {
        // Valid pin check
        if (_private.get(this).pins.indexOf(pin) == -1)
            return false;

        var p = new Gpio(pin, 'out');

        p.write(0, () => { //  Turn off current flow to stop leak
            p.writeSync(0); //  Turn LED off.
            p.unexport(); //  Unexport GPIO and free resources
        });

        return true;
    }

    /**
     *  Resets all pins back to off.
     *
     *  @function resetAll
     */
    resetAll() {
        _private.get(this).forEach(reset);
    }
};

//  EXPORTS

module.exports = Pins;