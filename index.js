// IMPORTS
var onoff = require('onoff');

var Gpio = onoff.Gpio,
    interval;

function flip(val, target) {
    if (target.indexOf(val) + 1)
        return 1;
    return 0;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

var led = {
    r: new Gpio(22, 'out'),
    g: new Gpio(17, 'out'),
    b: new Gpio(27, 'out')
};

interval = setInterval(function() { //#C
    var value = getRandomInt(0, 5); //#D
    led.r.write(flip(value, [0, 3]), function () {});
    led.g.write(flip(value, [1, 3]), function () {});
    led.b.write(flip(value, [2, 3]), function () {});
}, 2000);

process.on('SIGINT', function() { //#F
    clearInterval(interval);
    led.forEach(function(val){
        val.writeSync(0); //#G
        val.unexport();
    })

    process.exit();
});

// #A Import the onoff library
// #B Initialize pin 4 to be an output pin
// #C This interval will be called every 2 seconds
// #D Synchronously read the value of pin 4 and transform 1 to 0 or 0 to 1
// #E Asynchronously write the new value to pin 4
// #F Listen to the event triggered on CTRL+C
// #G Cleanly close the GPIO pin before exiting