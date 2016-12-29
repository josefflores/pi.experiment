import pin from 'pi-gpio';

pin.open(16, 'output', (err)=>{
    pin.write(16, 1, ()=>{
        pin.close(16);
    });
});

// reading the data on the pin i.e pin : 16
// pin.open(16, 'output', (err)=>{
//    pin.read(16, (err, value)=>{
//         pin.close(16);
//    });
// });

