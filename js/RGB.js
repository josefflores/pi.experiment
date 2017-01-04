/**
 *  Handles rgb led states
 */

// IMPORTS

var onoff = require('onoff');

var Pins = require('./Pins');
var Util = require('./Util');

var Gpio = onoff.Gpio;



//  CLASS

let _private = new WeakMap();

/**
 * The RGB led class for the raspberry pi experiments
 *
 * @class RGB
 * @param <object>.rPin: <int>: The red input pin
 * @param <object>.gPin: <int>: The green input pin
 * @param <object>.bPin: <int>: The blue input pin
 */
class RGB {

    constructor(obj = {
        rPin: 4,
        gPin: 4,
        bPin: 4
    }) {
        obj.cyclePosition = 0;
        obj.mask = {
            r: 4,
            g: 2,
            b: 1
        };
        obj.p = {
            r: new Gpio(obj.rPin, 'out'),
            g: new Gpio(obj.gPin, 'out'),
            b: new Gpio(obj.bPin, 'out')
        };

        _private.set(this, obj);
    }

    /**
     *  Delays the execution of a function while returning the object for chaining.
     *
     *  @method delay
     *  @param  time: <int>: The delay length in milliseconds
     *  @param  cb: <func>: The function to called
     *  @return <RGB>: This object for chaining
     */
    delay(time, cb) {
        setTimeout(cb, time);
        return this;
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
     *  @param  val: <int>: The state value
     *  @param  val: <int>: The delay time
     *  @return <RGB>: This object for chaining
     */
    state(val, time) {
        let pin = new Pins();
        let _priv = _private.get(this);

        if (time) {
            let futureState = () => {
                this.state(val)
            };
            return delay(time, futureState);
        }

        //  Colorize led
        ['r', 'g', 'b'].forEach((input) => {
            _priv.p[input].write(pin.flip(val, _priv.mask[input]),
                () => {})
        });

        return this;
    }

    /**
     * Cycles through the RGB states every time it is called.
     *
     * @method cycle
     * @return <RGB>: This object for chaining
     */
    cycle() {
        let _priv = _private.get(this);

        _priv.cyclePosition = ((_priv.cyclePosition = 1) % 8);
        _private.set(this, _priv);

        return state(_priv.cyclePosition);
    }

    /**
     *  Randomly chooses an RGB state
     *
     *  @method randomize
     *  @return <RGB>: This object for chaining
     */
    randomize() {
        return this.state((new Util).getRandomInt(0, 7));
    }
}

// EXPORTS

module.exports = RGB;