var spotcrime = require('spotcrime');

module.exports = function(emitter) {
	var location = { lat: 42.3814026, lon: -71.1035969 };
	var radius = 0.01; // In miles
	var threshold = 50;

	function get_crimes(callback) {
		spotcrime.getCrimes(location, radius, function(err, crimes) {
			callback(crimes);
		});
	}
	
	emitter.emit('register', 'crime');

	setInterval(function() {
		get_crimes(function(crimes) {
			var percentage = crimes.length * 100 / threshold;
			emitter.emit('crime', percentage);
		});
	}, 5000);
};
