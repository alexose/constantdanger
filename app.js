var EventEmitter = require('events').EventEmitter
  , fs = require('fs')
  , modes = require('./modes.js');

var verbose = true;

main();

function ioSetup(){
    var guagePort = 3;
    var modeSelectorPort = 4;
    var dangerZonePort = 3;
    
    var ioDevices = {};
    
    var mraa = require("mraa");
    
    var guageObject = new mraa.Pwm(guagePort, -1, false);
    guageObject.enable(true);
    guageObject.period_us(2000);
    
    ioDevices.setGuage = function(percent){
        // Calibration value
        var max = 0.0089;
        var value = (percent > 100) ? 100 : (percent * max);

        guageObject.write(value);
    }


    var modeSwitch = new mraa.Aio(modeSelectorPort);

    ioDevices.getMode = function(){
        var switchValue = modeSwitch.read();
        // mode, upper limit
        var modeList = [
            {name: 'off', resistance: 1000},
            {name: 'general', resistance: 900},
            {name: 'bodily_harm', resistance: 800},
            {name: 'emotional_harm', resistance: 700},
            {name: 'financial_harm', resistance: 600},
            {name: 'cyber', resistance: 500},
            {name: 'social', resistance: 400},
            {name: 'entropy', resistance: 300},
            {name: 'test', resistance: 200},
        ];

        var mode = 0;

        modeList.forEach(function(x){
            if(switchValue < x.resistance){
                mode = x.name;
            }
        });

        return mode;
    }

    return ioDevices;
}

function main(){

    var index = {}
      , mode = 'general';

    // Make an EventEmitter
    var emitter = new EventEmitter();
    
    var ioDevices = ioSetup();

    // usage: ioDevices.setGuage() or ioDevices.getMode();
    
    emitter.on('register', function(name){
        emitter.on(name, function(value){
            index[name] = value;
            updateReadout(index, mode);
        });
    });

    emitter.on('mode', function(name){
        if (modes[name]){
            mode = name;
        } else {
            console.log('Oh no!  There is no mode called ' + name + '.');
        }
    });

    // Load all modules
    var path = require('path').join(__dirname, 'modules')

    require('fs').readdirSync(path).forEach(function(file) {
       if (! /\.js$/.test(file)){
         return;
       }

       try {
         var func = require('./modules/' + file);
         func(emitter);
         console.log('Registered module ' + file);
       } catch(e){
          console.log('Could not load module ' + file + ': ' + e.toString());
       }
    });
}

// Update the reading on the Geiger meter
function updateReadout(index, mode){

    var formula = modes[mode]
      , total = 0
      , info = '';

    // Based on the keys we specify, multiple value by weight and add them together
    for (var prop in formula){
        var multiplier = formula[prop] / 100
          , value = parseFloat(index[prop], 10) || 0;

        total += value * multiplier;
        info += prop + ': ' + value + ' * ' + multiplier + ', ';
    }

    if (verbose){
        console.log('Danger level: ' + total + ' (' + info + ')');
    } else {
        console.log('Danger level: ' + total);
    }
}

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}
