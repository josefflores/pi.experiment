// IMPORTS
var onoff = require('onoff');
var Pins = require('./Pins');
var Util = require('./Util');

var Gpio = onoff.Gpio;

// 000 OFF // 001 BLUE // 010 GREEN // 011 CYAN
    // 100 RED // 101 PINK // 110 YELLOW // 111 WHITE
var RGB = function (pin_r, pin_g, pin_b){
    var cyclePosition = 0;

    var FLAG = {
        R: 4,
        G: 2,
        B: 1
    };

    var pins = {
        r: new Gpio(pin_r, 'out'),
        g: new Gpio(pin_g, 'out'),
        b: new Gpio(pin_b, 'out')
    };

    function random() {
        var mask = Util.getRandomInt(0, 7);
        state(mask);
    };

    function state(mask){
        pins.r.write(Pins.flip(mask, FLAG.R),
            function(){});
        pins.g.write(Pins.flip(mask, FLAG.G),
            function(){});
        pins.b.write(Pins.flip(mask, FLAG.B),
            function(){});
    };

    function cycle() {
        cyclePosition = (cyclePosition + 1) % 7;
        state(cyclePosition);
    };

    return {
        state: state,
        randomize: random,
        cycle: cycle
    };
};

// EXPORTS

module.exports = RGB;
