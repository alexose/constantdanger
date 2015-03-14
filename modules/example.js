// Example module that registers itself and broadcasts random DANGER DATA every 5 seconds

module.exports = function(emitter){

  emitter.emit('register', 'dangerdata');

  setInterval(function(){

    // This will emit an event called DANGER DATA with a random value between 0-100.
    // The display logic will happen in app.js.
    emitter.emit('dangerdata', Math.random() * 100);

  }, 1 * 5000);

}
