// IMPORTS
var onoff = require('onoff'); //#A
var led = {r:null,g:null,b:null};

var Gpio = onoff.Gpio,
    interval;

led.r = new Gpio(4, 'out');
led.g = new Gpio(4, 'out');
led.b = new Gpio(4, 'out');

interval = setInterval(function () { //#C
  var value = (led.r.readSync() + 1) % 2; //#D
  led.r.write(value, null);
  led.g.write(value, null);
  led.b.write(value, null);
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