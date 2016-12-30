/**
 * Button experiment - on push lights up red led
 */

//  IMPORTS

var Gpio = require('onoff').Gpio;

var RGB = require('./js/RGB');
var Pins = require('./js/Pins');

//  VARIABLES

var led = new RGB(27,17,4);
var button = new Gpio(24, 'in', 'both');
var i = 0;

// FUNCTIONS

button.watch(function (err, value) {
    if (err) throw err;
    value ? led.state(4) : led.state(0);
});

// Kill power on exit
process.on('SIGINT', function() { //#F
    pins = new Pins();
    pins.resetAll();
    process.exit();
});