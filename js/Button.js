//  IMPORTS

var Gpio = require('onoff').Gpio;

var Button = function (pin, toggle_state, on, off) {

    //  VARIABLES

    var button = new Gpio(pin, 'in', 'both'),
        length = 10,
        start = 0,
        state = {
            history: [0],
            click: {
                was: false,
                count: 0
            },
            press: {
                was: false,
                duration: 0
            },
            switch: false,
        };


    //  FUNCTIONS

    var moment = function (value) {
        state.switch = value && 1;
        console.log(value);
    };

    var toggle = function (value) {
        if (state.history[0] == 1 &&
            state.history[1] == 0)
            state.switch = !state.switch;
    };

    var click = function () {
        if (state.history[0] == 0 &&
            state.history[1] == 1 &&
            state.history[2] == 0 ) {
                state.click.was = true;
                state.click.count = click_count();

        } else {
            state.click.was = false;
            state.click.count = 0;
        }
    };

    var press = function () {
        //  Start clock if it has not been started
        if (state.history[0] == 1 && start == 0) {
            start = Date.getTime();
        }

        // A button press has ended
        if (state.history[0] == 0 &&
            state.history[1] == 1 &&
            state.history[2] == 1 &&
            state.history[3] == 1){
                state.press.was = true;
                state.press.duration = Date.getTime() - start;
                start = 0;
        } else {
            state.press.was = false;
            state.press.duration = 0;
        }
    };

    var click_count = function (history) {
        if (history.length == 2 &&
            history[0] == 1 &&
            history[1] == 0)
            return 1 + click_count(history.slice(2))
        return 0;
    };

    //  WATCHER

    button.watch(function (err, value) {
        if (err) throw err;
        state.history.unshift(value);
        toggle_state ? toggle(value) : moment(value);
        click();        // Determine if a click and count consecutive clicks
        press();        // Determine if a press and measure duration
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
}

module.exports = Button;