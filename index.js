var gpio = require('rpi-gpio');

var run = true;

var on = function(pin){
    gpio.setup(pin, gpio.DIR_OUT, function(){
        gpio.write(pin, true, (err)=>{
            if (err) throw err;
            console.log('PIN  ON: ' + pin);
        });
    });
};

var off = function(pin){
    gpio.setup(pin, gpio.DIR_OUT, function(){
        gpio.write(pin, false, function(err){
            if (err) throw err;
            run = false;
            console.log('PIN OFF: ' + pin);
        });
    });
};

on(16);

var end = setInterval(function(){
    off(16);
}, 1000);

console.log('LOOP');
while(run);

console.log('END');
clearInterval(end);

console.log('RET');
return true;
