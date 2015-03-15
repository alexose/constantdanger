var EventEmitter = require('events').EventEmitter
  , fs = require('fs')
  , modes = require('./modes.js')
  , log = require('npmlog');

var verbose = true;

main();

function main(){

    var index = {}
      , mode = 'general';

    // Make an EventEmitter
    var emitter = new EventEmitter();

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

    // TODO: Output this value to the geiger meter!

    if (verbose){
        log.verbose('Danger level: ' + total + ' (' + info + ')');
    } else {
        log.verbose('Danger level: ' + total);
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

