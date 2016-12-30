//  IMPORTS

var Gpio = require('onoff').Gpio;

var Button = function (pin, toggle_state, on, off) {

    //  VARIABLES

    var button = new Gpio(pin, 'in', 'both'),
        length = 10,
        start = 0,
        state = {
            history: [0],
            duration: 0,
            switch: false,
        };


    //  FUNCTIONS

    var moment = function (value) {
        state.switch = value;
    };

    var toggle = function (value) {
        if (state.history[0] == 1 &&
            state.history[1] == 0)
            state.switch = !state.switch;
    };

    var metrics = function () {
        state.click.was = false;
        state.press.was = false;
        state.press.duration = 0;

        //  Start clock if it has not been started
        if (state.history[0] == 1 && start == 0) {
            start = Date.now();
        }

        if (state.history[0] == 0 &&
            state.history[1] == 1) {

            state.duration = Date.now() - start;
            start = 0;
        }
    };

    var click_count = function (history) {
        console.log(history);
        if (history.length >= 2 &&
            history[0] == 0 &&
            history[1] == 1)
            return 1 + click_count(history.slice(2))
        return 1;
    };

    //  WATCHER

    button.watch(function (err, value) {
        if (err) throw err;
        state.history.unshift(value);
        toggle_state ? toggle(value) : moment(value);
        metrics();
        state.history = state.history.slice(0, length); // keep only ten readings
        state.switch ? on() : off();
        console.log(state);
    });


    return {
        button: button,
        stats: function () {
            return state;
        }
    }
};

module.exports = Button;