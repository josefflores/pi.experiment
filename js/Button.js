//  IMPORTS

var Gpio = require('onoff').Gpio;

var Button = function (pin, toggle_state, on, off) {

    //  VARIABLES

    var button = new Gpio(pin, 'in', 'both'),
        length = 10,
        start = 0,
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

    var moment = function (value) {
        stats.switch = value;
    };

    var toggle = function (value) {
        if (stats.history[0] &&
            stats.history[1] == 0)
            stats.switch = !stats.switch;
    };

    var metrics = function (value) {

        stats.history.unshift(value);

        duration(value);
        type(value);

        stats.history = stats.history.slice(0, length); // keep only 10 readings

        return stats;
    };

    var type = function(value){
        if (value == 0 && duration <= 150){
            ++stats.consecutive.click;
            stats.consecutive.press = 0;
        } else if (value == 0) {
            stats.consecutive.click = 0;
            ++stats.consecutive.press;
        }
    }

    var duration = function(value){
        //  Start clock if it has not been started
        if (value && stats.history[1] == 0) {
            start = new Date().getTime();
            stats.duration = 0;
        } else if (value && stats.history[1]) {
            stats.duration = (new Date().getTime()) - start;
        }
    }
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