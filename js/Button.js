//  IMPORTS

var Gpio = require('onoff').Gpio;

var Button = function (obj) {

    //  VARIABLES

    var button = new Gpio(obj.pin, 'in', 'both'),
        ret = {
            click: 0,
            press: 0,
            duration: 0,
            history: [false],
            switch: false,
        },
        start = 0,
        CLICK_LENGTH = 150,
        HISTORY_LENGTH = 10;

    //  FUNCTIONS

    /**
     *  Button type - Momentary
     *  Button is active only while pressed.
     *
     *  @function moment
     *  @param value: <int>: High / Low signal
     */
    var moment = function (value) {
        ret.switch = value;
    };

    /**
     *  Button type - Toggle
     *  Button toggles between states on press.
     *
     *  @function toggle
     *  @param value: <int>: High / Low signal
     */
    var toggle = function (value) {
        if (state('RISE', value)){
            ret.switch = !ret.switch;
        } else {
            ret.switch = !ret.switch;
        }
    };

    /**
     *  Calculate the button metrics.
     *
     *  @function   metrics
     *  @param      value: <int>: The High / Low state
     *  @return     <obj>: The button ret object
     */
    var metrics = function (value) {
        /**
         *  Records the last HISTORY_LENGTH button readings
         *
         *  @function   history
         *  @param      value: <int>: The High / Low state
         */
        var history = function (value) {
            ret.history.unshift(value);
            ret.history = ret.history.slice(0, HISTORY_LENGTH); // keep only 10 readings
        };

        /**
         *  Determine what kind of action it was and how many of the same action have
         *  occurred in a row.
         *
         *  @function type
         *  @param value: <int>: High / Low signal
         */
        var type = function (value) {
            if (state('DROP', value)) { //  On Rise
                if (ret.duration > CLICK_LENGTH) { //  Click Detected
                    ++ret.press;
                    ret.click = 0;
                } else { //  Press Detected
                    ++ret.click;
                    ret.press = 0;
                }
            }
        };

        /**
         *  How long the action was active for.
         *
         *  @function duration
         *  @param value: <int>: High / Low signal
         */
        var duration = function (value) {
            if (state('RISE', value)) {
                //  Start clock if it has not been started
                start = new Date().getTime();
                ret.duration = 0;
            } else if (state('DROP', value) || state('WAS_HIGH', value)) {
                //  Start clock if it has not been started
                ret.duration = (new Date().getTime()) - start;
            }
        };

        history(value); //  The history of high low readings
        duration(value); //  The duration of the last high state
        type(value); //  The type of action

        return ret;
    };

    /**
     *  Determines if the button is in the given state.
     *
     *  @function state
     *  @param str: <string>: The state label
     *  @return <bool>: The button is in the state given by str
     */
    function state(str, value) {
        switch (str) {
            case 'OFF':
                return !value;
            case 'ON':
                return value;
            case 'WAS_HIGH':
                return ret.history[1];
            case 'WAS_LOW':
                return !ret.history[1];
            case 'RISE':
                return value && !ret.history[1];
            case 'DROP':
                return !value && ret.history[1];
            default:
                throw 'INVALID_STATE';
        }
    }

    //  WATCHER

    button.watch(function (err, value) {
        if (err) throw err;
        value = Boolean(value);
        // Gather button metrics based on button type
        console.log(obj.toggle);
        obj.toggle ? toggle(value) : moment(value);
        console.log(metrics(ret.switch));
        // Callback
        ret.switch ? obj.on(ret) : obj.off(ret);
    });

    return button;
};

module.exports = Button;