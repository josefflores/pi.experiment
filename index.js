// IMPORTS
var onoff = require('onoff'); //#A
var Gpio = onoff.Gpio,
    interval;

var led = {r:null,g:null,b:null};

function flip(val, target){
    if(val == target)
        return 1
    return 0;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

led.r = new Gpio(22, 'out');
led.g = new Gpio(17, 'out');
led.b = new Gpio(27, 'out');

interval = setInterval(function () { //#C
  var value = getRandomInt(0,3); //#D
  led.r.write(flip(value, 0), null);
  led.g.write(flip(value, 1), null);
  led.b.write(flip(value, 2), null);
}, 2000);

process.on('SIGINT', function () { //#F
  clearInterval(interval);
    led.r.writeSync(0); //#G
    led.g.writeSync(0); //#G
    led.b.writeSync(0); //#G

    led.r.unexport();
    led.g.unexport();
    led.b.unexport();

    process.exit();
});

// #A Import the onoff library
// #B Initialize pin 4 to be an output pin
// #C This interval will be called every 2 seconds
// #D Synchronously read the value of pin 4 and transform 1 to 0 or 0 to 1
// #E Asynchronously write the new value to pin 4
// #F Listen to the event triggered on CTRL+C
// #G Cleanly close the GPIO pin before exiting