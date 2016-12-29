var gpio = require('rpi-gpio');

var run = true;

var on = (pin)=>{
    gpio.setup(pin, gpio.DIR_OUT, ()=>{
        gpio.write(pin, true, (err)=>{
            if (err) throw err;
            console.log('PIN  ON: ' + pin);
        });
    });
};

var off = (pin)=>{
    gpio.setup(pin, gpio.DIR_OUT, ()=>{
        gpio.write(pin, false, (err)=>{
            if (err) throw err;
            console.log('PIN OFF: ' + pin);
        });
    });
};

on(16);

var end = setInterval(()=>{
    run = false;
    off(16);
}, 1000);

console.log('LOOP');
while(run);

console.log('END');
clearInterval(end);

console.log('RET');
return true;
