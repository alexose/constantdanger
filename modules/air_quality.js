var mraa = require('mraa')

module.exports = function(emitter, pin) {
	AirQuality = {
		scan: function() {
			var sensor = new mraa.Aio(pin || 0)
			return this.to_percentage(sensor.read())
		},

		to_percentage: function(value) {
			var super_high_pollution = 700;
			return value * 100 / super_high_pollution;
		}
	};

	emitter.emit('register', 'air_quality');

	setInterval(function() {
		emitter.emit('air_quality', AirQuality.scan());
	}, 5000);
};
