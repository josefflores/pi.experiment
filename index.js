var gpio = require('rpi-gpio');

var on = (pin)=>{
    gpio.setup(pin, gpio.DIR_OUT, ()=>{
        gpio.write(pin, true, (err)=>{
            if (err) throw err;
        });
    });
};

var off = (pin)=>{
    gpio.setup(pin, gpio.DIR_OUT, ()=>{
        gpio.write(pin, false, (err)=>{
            if (err) throw err;
        });
    });
};

on(16);

setTimeout(()=>{
    off(16);
}, 1000);

