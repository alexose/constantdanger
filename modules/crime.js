var spotcrime = require('spotcrime');

module.exports = function(emitter) {
	var radius = 0.01; // In miles
	var threshold = 500;

	function get_crimes(location, callback) {
		spotcrime.getCrimes(location, radius, function(err, crimes) {
			callback(crimes, err);
		});
	}

	emitter.emit('register', 'crime');

	emitter.on('gps', function(data) {
		var location = {
			lat: data.latitude,
			lon: data.longitude
		};

		get_crimes(location, function(crimes, err) {
			if (!err) {
				var percentage = crimes.length * 100 / threshold;
				emitter.emit('crime', percentage);
			}
		});
	});
};
