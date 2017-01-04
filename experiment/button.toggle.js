/**
 * Button experiment - toggle on push lights up and turns off red led
 */

//  IMPORTS

var Gpio = require('onoff').Gpio;

var RGB = require('../js/RGB');
var Pins = require('../js/Pins');
var Button = require('../js/Button');

//  VARIABLES

var led = new RGB({
    rPin: 27,
    gPin: 17,
    bPin: 4
});

var button = new Button({
    pin: 24,
    toggle: true,
    on: function(stats){
        led.state(4)
    },
    off: function(stats){
        led.state(0)
}});

// Kill power on exit
process.on('SIGINT', function() { //#F
    pins = new Pins();
    pins.resetAll();
    process.exit();
});