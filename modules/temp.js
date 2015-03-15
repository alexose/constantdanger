// Load Grove module
var groveSensor = require('jsupm_grove');

// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(0);
console.log(temp.name());

// Measure temperature and report on it
module.exports = function(emitter){

  emitter.emit('register', 'excessivetemperature');

  // Read the temperature ten times, printing both the Celsius and
  // equivalent Fahrenheit temperature, waiting one second between readings
  var i = 0;

  var waiting = setInterval(function(){

    var celsius = temp.value();
    var fahrenheit = celsius * 9.0/5.0 + 32.0;
    console.log(celsius + " degrees Celsius, or " + Math.round(fahrenheit) + " degrees Fahrenheit");

    // emitter.emit('excessivetemperature', Math.random() * 100);



    i++;
    // if (i == 10) clearInterval(waiting);
  }, 1000);

}
