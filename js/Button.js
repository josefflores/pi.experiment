//  IMPORTS

var Gpio = require('onoff').Gpio;

var Button = function(pin, toggle_state, on, off){

    //  VARIABLES

    var button = new Gpio(pin, 'in', 'both'),
        state = {
        history: [0],
        switch: false,
    };


    //  FUNCTIONS

    var moment = function(value){
        state.switch = value && 1;
        console.log(value);
    };

    var toggle = function(value){
        state.history.push(value)
        state.history.remove(-1);

        if (state.history[0] == 1 &&
            state.history[1] == 0)
                state.switch = !state.switch;
    };

    var click = function(){
        if (state.history[0] == 1 &&
            state.history[1] == 0)
                return true;
        return false;
    };

    //  WATCHER

    button.watch(function (err, value) {
        if (err) throw err;
        toggle_state ? toggle(value) : moment(value);
        state.switch ? on() : off();
    });

    return button;
}

module.exports = Button;