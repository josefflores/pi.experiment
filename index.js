//  IMPORTS
var Gpio = require('onoff').Gpio;

var RGB = require('./js/RGB');

//  VARIABLES

var led = new RGB(27,17,4);
var button = new Gpio(24, 'in', 'both');
var i = 0;

// FUNCTIONS

button.watch(function (err, value) {
    if (err) {
        throw err;
    }
    led.state(4)
    console.log(i++, '.', value);//led.writeSync(value);
});

// Kill power on exit
process.on('SIGINT', function() { //#F
    pins = new Pins();
    pins.resetAll();
    process.exit();
});