// Load Grove module
var groveSensor = require('jsupm_grove');

// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(0);

// Measure temperature and report on it
module.exports = function(emitter){

  emitter.emit('register', 'excessivetemperature');
  emitter.emit('register', 'lowtemperature');

  // Read the temperature ten times, printing both the Celsius and
  // equivalent Fahrenheit temperature, waiting one second between readings

  setInterval(function(){

    var f = temp.value() * 9.0/5.0 + 32.0
      , value;

    // Broadcast a value on excessive temperature
    if (f > 90){
      var value =  Math.min((temp - 90) * 2, 100);
      emitter.emit('excessivetemperature', value);
    }

    // Broadcast a value on super-duper low temperature
    if (f < 20){
      var value = Math.min((temp - 40) * -2, 100)
      emitter.emit('lowtemperature', value);
    }
  }, 1000);
}
