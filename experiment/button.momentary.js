/**
 * Button experiment - hold on push lights up red led
 */

//  IMPORTS

var Gpio = require('onoff').Gpio;

var RGB = require('../js/RGB');
var Pins = require('../js/Pins');
var Button = require('../js/Button');

//  VARIABLES

var led = new RGB(27,17,4);
var button = new Button(24, false,
    function(stats){
        led.state(4)
    }, function(stats){
        led.state(0)
    });

// Kill power on exit
process.on('SIGINT', function() { //#F
    pins = new Pins();
    pins.resetAll();
    process.exit();
});