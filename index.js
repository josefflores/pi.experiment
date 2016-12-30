var Gpio = require('onoff').Gpio,
   // led = new Gpio(14, 'out'),
    button = new Gpio(24, 'in', 'both');

button.watch(function (err, value) {
    if (err) {
        throw err;
    }

    console.log('.');//led.writeSync(value);
});

// Kill power on exit
process.on('SIGINT', function() { //#F
    pins = new Pins();
    pins.resetAll();
    process.exit();
});