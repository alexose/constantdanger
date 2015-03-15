var EventEmitter = require('events').EventEmitter
  , fs = require('fs')
  , modes = require('./modes.js')
  , log = require('npmlog')
  , sparkline = require('sparkline')
  , colors = require('colors')
  , cursor = require('ansi')(process.stdout);

cursor.hide();

var verbose = false;
var ansi = false;

log.level = verbose ? 'verbose' : 'info';

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
            {name: 'off', resistance: 1024},
            {name: 'general', resistance: 990},
            {name: 'bodily_harm', resistance: 854},
            {name: 'emotional_harm', resistance: 740},
            {name: 'financial_harm', resistance: 640},
            {name: 'cyber', resistance: 500},
            {name: 'social', resistance: 415},
            {name: 'entropy', resistance: 315},
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

    var index = {};

    // Make an EventEmitter
    var emitter = new EventEmitter();

    try {
      var ioDevices = ioSetup();
    } catch(e){
      var ioDevices = {
          getMode : function(){ return 'general'; },
          setGuage : function(value){ return value; }
      };
      log.warn('Could not set up iodevices!' + e);
    }

    emitter.on('register', function(name){
        emitter.on(name, function(value){

            index[name] = value;
            updateReadout(index, ioDevices);
        });
    });

    emitter.on('mode', function(name){
        if (modes[name]){
            mode = name;
        } else {
            log.warn('Oh no!  There is no mode called ' + name + '.');
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
         log.info('Registered module ' + file);
       } catch(e){
          log.warn('Could not load module ' + file + ': ' + e.toString());
       }
    });
}

// Update the reading on the Geiger meter
function updateReadout(index, ioDevices){

    var mode = ioDevices.getMode() || 'general';

    var formula = modes[mode]
      , total = 0
      , arr = []
      , info = '';

    // Based on the keys we specify, multiple value by weight and add them together
    for (var prop in formula){
        var multiplier = formula[prop] / 100 || 0
          , value = parseFloat(index[prop], 10) || 0;

        arr.push(value);

        total += value * multiplier;

        if (verbose){
          info += prop + ': ' + (Math.round(value * 100) / 100) + ' * ' + multiplier + ', ';
        }
    }

    var num = Math.round(total * 10000) / 10000 || 0
      , str = num.toFixed(2);

    // Colorize
    if (total >= 0) str = str.green;
    if (total > 20) str = str.yellow;
    if (total > 60) str = str.red;

    setTimeout(function(){

        // TODO: scale this value nicely
        ioDevices.setGuage(Math.min(num, 100) * 5);
        if (ansi) {
          process.stdout.cursorTo(0);  // move cursor to beginning of line
          process.stdout.write('     Danger level: ' + sparkline(arr) + '  (' + str + ')                ' + info);
	}
    }, 10);

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

// Show cursor on quit
process.on('SIGINT', function () {
    cursor.show().write('\n')
    process.exit();
})

process.on('exit', function () {
    cursor.show().write('\n')
})
