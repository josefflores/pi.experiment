//  IMPORTS

var Gpio = require('onoff').Gpio;

var Button = function(pin, toggle, on, off){

    var button = new Gpio(pin, 'in', 'both');

    var state = {
        last: 0,
        curr: 0,
        switch: false
    };

    //  FUNCTIONS

    var moment = function(value){
        state.switch = value;
    };

    var toggle = function(value){
        state.last = state.curr;
        state.curr = value;

        if (state.last == 0 &&
            state.curr == 1)
                state.switch = !state.switch;
    }

    //  WATCHER

    button.watch(function (err, value) {
        if (err) throw err;
        toggle ? toggle(value) : moment(value);
        state.switch ? on() : off();

    });

    return button;
}

module.exports = Button;