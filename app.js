var EventEmitter = require('events').EventEmitter
  , fs = require('fs');

main();

function main(){

    // Make an eventEmitter
    var emitter = new EventEmitter();

    emitter.on('register', function(name){
        emitter.on(name, function(value){
            console.log(name + ' broadcasted value ' + value + '!');
        });
    });

    // Load all modules
    var path = require('path').join(__dirname, 'modules')

    require('fs').readdirSync(path).forEach(function(file) {
       var func = require('./modules/' + file);

       func(emitter);

       console.log('Registered module ' + file);

    });
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

