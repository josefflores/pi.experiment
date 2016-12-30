/**
 * Randomly choses an RGB color state including off. *
 */

// IMPORTS

var onoff = require('onoff');

var RGB = require('../js/RGB');
var Pins = require('../js/Pins');

var Gpio = onoff.Gpio;

//  VARIABLES

var led = new RGB(27,17,4);

// Blink light
var interval = setInterval(led.randomize, 2000);

// Kill power on exit
process.on('SIGINT', function() { //#F
    pins = new Pins();

    clearInterval(interval);
    pins.resetAll();
    process.exit();
});