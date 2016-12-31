//  IMPORTS

var Gpio = require('onoff').Gpio;

var Button = function (pin, toggle_state, on, off) {

    //  VARIABLES

    var button = new Gpio(pin, 'in', 'both'),
        length = 10,
        start = 0,
        stats = {
            history: [0],
            duration: 0,
            switch: false,
        };

    //  FUNCTIONS

    var moment = function (value) {
        stats.switch = value;
    };

    var toggle = function (value) {
        if (stats.history[0] == 1 &&
            stats.history[1] == 0)
            stats.switch = !stats.switch;
    };

    var metrics = function (value) {

        stats.history.unshift(value);

        //  Start clock if it has not been started
        if (stats.history[0] == 1 && stats.history[1] == 0)
            start = new Date().getTime();
        else stats.duration = (new Date().getTime()) - start;

        stats.history = stats.history.slice(0, length); // keep only 10 readings

        return stats;
    };

    //  WATCHER

    button.watch(function (err, value) {
        if (err) throw err;


        toggle_state ? toggle(value) : moment(value);

        // Gather button metrics
        console.log(metrics(value));

        stats.switch ? on() : off();
    });


    return {
        button: button,
        stats: function () {
            return stats;
        }
    }
};

module.exports = Button;