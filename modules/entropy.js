// Example module that registers itself and broadcasts random DANGER DATA every 5 seconds

module.exports = function(emitter){

  emitter.emit('register', 'entropy');

  var arr = [];

  setInterval(function(){

    var entropy = Math.random() * 100;

    // Take a rolling average of the last 20 values...
    if (arr.length > 20){
        arr.shift()
    }

    arr.push(entropy);

    var total = arr.reduce(function(a, b){
        return a + b;
    });

    var avg = total / arr.length;

    emitter.emit('entropy', avg / 10);

  }, 1 * 50);
}
