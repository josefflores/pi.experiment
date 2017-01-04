/**
 *  Cycles through the RGB colors states (includes off)
 */

// IMPORTS

var onoff = require('onoff');

var RGB = require('../js/RGB');
var Pins = require('../js/Pins');

var Gpio = onoff.Gpio;

//  VARIABLES

var led = new RGB({
    rPin: 27,
    gPin: 17,
    bPin: 4
});

// Blink light
var interval = setInterval(led.cycle, 2000);

// Kill power on exit
process.on('SIGINT', function() { //#F
    pins = new Pins();

    clearInterval(interval);
    pins.resetAll();
    process.exit();
});