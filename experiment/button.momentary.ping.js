/**
 * Button experiment - hold on push lights up red led
 */

//  IMPORTS

var Gpio = require('onoff').Gpio;

var RGB = require('../js/RGB');
var Pins = require('../js/Pins');
var Button = require('../js/Button');
var ping = require('ping');

//  VARIABLES

var led = new RGB(27,17,4);
var button = new Button(24, false,
    function(stats){
        led.state(0);
    }, function(stats){
        ping.sys.probe('192.168.1.149', function(isAlive){
            (isAlive ? led.state(2) : led.state(4)).state(0, 1000);
            ping.sys.probe('192.168.1.156', function(isAlive){
                (isAlive ? led.state(1) : led.state(4)).state(0, 1000);
            });
        });
    });

// Kill power on exit
process.on('SIGINT', function() { //#F
    pins = new Pins();
    pins.resetAll();
    process.exit();
});