//  IMPORTS

var Gpio = require('onoff').Gpio;

var Button = function (pin, toggle_state, on, off) {

    //  VARIABLES

    var start = 0,
        CLICK_LENGTH = 150,
        HISTORY_LENGTH = 10,
        button = new Gpio(pin, 'in', 'both'),
        stats = {
            consecutive: {
                click: false,
                press: false
            },
            duration: 0,
            history: [0],
            switch: false,
        };

    //  FUNCTIONS

    /**
     *  Button type - Momentary
     *  Button is active only while pressed.
     *
     *  @function moment
     *  @param value: <int>: High / Low signal
     */
    var moment = function (value) {
        stats.switch = value;
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
        if (stats.history[0] == 1 && //  Rise
            stats.history[1] == 0)
            stats.switch = !stats.switch;
    };

    /**
     *  Calculate the button metrics.
     *
     *  @function   metrics
     *  @param      value: <int>: The High / Low state
     *  @return     <obj>: The button stats object
     */
    var metrics = function (value) {
        history(value); //  The history of high low readings
        duration(value); //  The duration of the last high state
        type(value); //  The type of action
        return stats;
    };

    /**
     *  Records the last HISTORY_LENGTH button readings
     *
     *  @function   history
     *  @param      value: <int>: The High / Low state
     */
    var history = function (value) {
        stats.history.unshift(value);
        stats.history = stats.history.slice(0, HISTORY_LENGTH); // keep only 10 readings
    }

    /**
     *  Determine what kind of action it was and how many of the same action have
     *  occurred in a row.
     *
     *  @function type
     *  @param value: <int>: High / Low signal
     */
    var type = function (value) {
        // Button just went high
        if (value == 0 && //  On Rise
            stats.history[1] == 1) {
            //  Click Detected
            if (stats.duration > CLICK_LENGTH) {
                ++stats.consecutive.press;
                stats.consecutive.click = 0
                    //  Press Detected
            } else {
                ++stats.consecutive.click;
                stats.consecutive.press = 0
            }
        }
    }

    /**
     *  How long the action was active for.
     *
     *  @function duration
     *  @param value: <int>: High / Low signal
     */
    var duration = function (value) {
        // Button just went high
        if (value == 1 && //  rise
            stats.history[1] == 0) {
            //  Start clock if it has not been started
            start = new Date().getTime();
            stats.duration = 0;

            // Button has maintained high or just dropped
        } else if ((value == 0) || //  drop
            (value == 1 && // maintained rise
                stats.history[1] == 1)) {
            //  Start clock if it has not been started
            stats.duration = (new Date().getTime()) - start;
        }
    }

    //  WATCHER

    button.watch(function (err, value) {
        if (err) throw err;
        // Button type
        toggle_state ? toggle(value) : moment(value);
        // Gather button metrics
        console.log(metrics(value));
        // Callback
        stats.switch ? on(stats) : off(stats);
    });

    return {
        button: button,
        stats: function () {
            return stats;
        }
    }
};

module.exports = Button;