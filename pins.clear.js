//Resets all GPIO pins to zero incase anything was stuck

// IMPORTS
var onoff = require('onoff');

var Gpio = onoff.Gpio,
    interval;


var pins = [4, 5, 6, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

pins.forEach(function (i) {
    var pin = new Gpio(i, 'out');
    pin.write(0, function () {
        console.log("PIN: ", i, " = 0")
    });
});

return 0;