//  IMPORTS

var Gpio = require('onoff').Gpio;

var Button = function (obj) {

    //  VARIABLES

    var button = new Gpio(obj.pin, 'in', 'both'),
        ret = {
            click: 0,
            press: 0,
            duration: 0,
            history: [0],
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
        // Button just went high
        if (ret.history[0] == 1 && //  Rise
            ret.history[1] == 0)
            ret.switch = !ret.switch;
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
            // Button just went high
            if (value == 0 && ret.history[1] == 1) {  //  On Rise
                if (ret.duration > CLICK_LENGTH) {    //  Click Detected
                    ++ret.press;
                    ret.click = 0;
                } else {                                //  Press Detected
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
            // Button just went high
            if (value == 1 && //  rise
                ret.history[1] == 0) {
                //  Start clock if it has not been started
                start = new Date().getTime();
                ret.duration = 0;

                // Button has maintained high or just dropped
            } else if ((value == 0) || //  drop
                (value == 1 && // maintained rise
                    ret.history[1] == 1)) {
                //  Start clock if it has not been started
                ret.duration = (new Date().getTime()) - start;
            }
        };

        history(value); //  The history of high low readings
        duration(value); //  The duration of the last high state
        type(value); //  The type of action

        return ret;
    };

    //  WATCHER

    button.watch(function (err, value) {
        if (err) throw err;
        // Gather button metrics based on button type
        obj.toggle ? toggle(value) : moment(value);
        console.log(metrics(ret.switch));
        // Callback
        ret.switch ? obj.on(ret) : obj.off(ret);
    });

    return button;
};

module.exports = Button;