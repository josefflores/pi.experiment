// Resets all GPIO pins to zero incase anything was stuck

// IMPORTS
var onoff = require('onoff');
var Gpio = onoff.Gpio,
    interval;

var pins = [4, 5, 6, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

var flip = function(input, mask){
    return ((input & mask) > 0 ? 1 : 0);
};

var reset = function(pin){
    if (!(pins.indexOf(pin) + 1))
        return false;

    var p = new Gpio(pin, 'out');
    //p.write(0, function () {});
    //p.writeSync(0);
    //p.unexport();

    return true;
}

var resetAll = function() {
    pins.forEach(reset);
};

module.exports = {
    flip: flip,
    reset: reset,
    resetAll: resetAll
};
