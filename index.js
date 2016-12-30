// IMPORTS
var onoff = require('onoff');
var RGB = require('./RGB');
var Pins = require('./Pins');

var Gpio = onoff.Gpio,
    interval;


var led = RGB(27,17,4);

// Blink light
interval = setInterval(led.randomize, 2000);

// Kill power on exit
process.on('SIGINT', function() { //#F
    clearInterval(interval);
    Pins.resetAll();
    process.exit();
});
