//  IMPORTS

var Gpio = require('onoff').Gpio;

var _private = new WeakMap();

class Button {
    constructor(obj = {
        clickLength: 150,
        historyLength: 10,
        off: () => {},
        on: () => {},
        pin: null,
        toggle: false
    }) {
        obj.ret = {
            click: 0,
            press: 0,
            duration: 0,
            history: [false],
            switch: false,
        };
        obj.button = new Gpio(obj.pin, 'in', 'both');
        obj.start = 0;

        obj.button.watch(function (err, value) {

            if (err) throw err;

            let _priv = _private.get(this);

            value = Boolean(value);

            // Gather button metrics based on button type
            _priv.toggle ? this.toggle(value) : this.moment(value);
            console.log(this.metrics(_priv.ret.switch));

            // Callback
            _priv.ret.switch ? this.on(_priv.ret) : this.off(_priv.ret);
        });

        _private.set(this, obj);
    }

    get button() {
        return _private.get(this).button;
    }

    get on() {
        return _private.get(this).on
    }

    get off() {
        return _private.get(this).off
    }

    /**
     *  Button type - Momentary
     *  Button is active only while pressed.
     *
     *  @function moment
     *  @param value: <int>: High / Low signal
     */
    moment(value) {
        let _priv = _private.get(this);
        _priv.ret.switch = value;
    }

    /**
     *  Button type - Toggle
     *  Button toggles between states on press.
     *
     *  @function toggle
     *  @param value: <int>: High / Low signal
     */
    toggle(value) {
        let _priv = _private.get(this);
        if (state('RISE', value)) {
            _priv.ret.switch = !_priv.ret.switch;
        } else {
            _priv.ret.switch = !_priv.ret.switch;
        }
    }

    /**
     *  Calculate the button metrics.
     *
     *  @function   metrics
     *  @param      value: <int>: The High / Low state
     *  @return     <obj>: The button ret object
     */
    metrics(value) {
        let _priv = _private.get(this);

        /**
         *  Records the last obj.historyLength button readings
         *
         *  @function   history
         *  @param      value: <int>: The High / Low state
         */
        function history(value) {
            _priv.ret.history.unshift(value);
            _priv.ret.history = _priv.ret.history.slice(0, _priv.historyLength); // keep only 10 readings
        };

        /**
         *  Determine what kind of action it was and how many of the same action have
         *  occurred in a row.
         *
         *  @function type
         *  @param value: <int>: High / Low signal
         */
        function type(value) {
            if (state('DROP', value)) { //  On Rise
                if (_priv.ret.duration > _priv.clickLength) { //  Click Detected
                    ++_priv.ret.press;
                    _priv.ret.click = 0;
                } else { //  Press Detected
                    ++_priv.ret.click;
                    _priv.ret.press = 0;
                }
            }
        };

        /**
         *  How long the action was active for.
         *
         *  @function duration
         *  @param value: <int>: High / Low signal
         */
        function duration(value) {
            if (state('RISE', value)) {
                //  Start clock if it has not been started
                _priv.start = new Date().getTime();
                _priv.ret.duration = 0;
            } else if (state('DROP', value) || state('WAS_HIGH', value)) {
                //  Start clock if it has not been started
                _priv.ret.duration = (new Date().getTime()) - _priv.start;
            }
        };

        history(value); //  The history of high low readings
        duration(value); //  The duration of the last high state
        type(value); //  The type of action

        return _priv.ret;
    }

    /**
     *  Determines if the button is in the given state.
     *
     *  @function state
     *  @param str: <string>: The state label
     *  @return <bool>: The button is in the state given by str
     */
    state(str, value) {
        let _priv = _private.get(this);

        switch (str) {
            case 'OFF':
                return !value;
            case 'ON':
                return value;
            case 'WAS_HIGH':
                return _priv.ret.history[1];
            case 'WAS_LOW':
                return !_priv.ret.history[1];
            case 'RISE':
                return (value && !_priv.ret.history[1]);
            case 'DROP':
                return (!value && _priv.ret.history[1]);
            default:
                throw 'INVALID_STATE';
        }
    }
};

module.exports = Button;