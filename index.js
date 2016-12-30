// IMPORTS

var onoff = require('onoff');

var RGB = require('./js/RGB');
var Pins = require('./js/Pins');

var Gpio = onoff.Gpio,
    interval;

var led = new RGB(27,17,4);

// Blink light
interval = setInterval(led.cycle, 2000);

// Kill power on exit
process.on('SIGINT', function() { //#F
    clearInterval(interval);
    Pins.resetAll();
    process.exit();
});
