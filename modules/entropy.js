// Example module that registers itself and broadcasts random DANGER DATA every 5 seconds

module.exports = function(emitter){

  emitter.emit('register', 'entropy');

  setInterval(function(){

    var entropy = Math.random() * 100;

    // If we randomly get a value above 90... DANGER
    if (entropy > 90){
      var value =  Math.min((entropy - 90) * 10, 100);
      emitter.emit('entropy', value);
    }

  }, 1 * 5000);
}
