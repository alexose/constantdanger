var mraa = require('mraa');

module.exports = function(emitter, pin) {
        var Alcohol = {
                scan: function() {
                        var sensor = new mraa.Aio(pin || 2);
                        return this.alcohol_reading(sensor);
                },

                // Based on:
                // https://github.com/Seeed-Studio/Grove_Alcohol_Sensor/blob/masster/DetectAlcoholVapor.ino
                alcohol_reading: function(sensor) {
                        var reading = sensor.read();
                        var compensator = 1023;
                        var value = compensator - reading;

                        if (value < 200) {
                                return 0;
                        }
                        else {
                                this.to_percentage(value);
                        }
                },

                to_percentage: function(value) {
                        var factor_of_nonexistence = 200;
                        var high_alcohol_concentration = 750 - factor_of_nonexistence;
                        return (value - factor_of_nonexistence) * 100 / high_alcohol_concentration;
                }
        };

        emitter.emit('register', 'alcohol');

        setInterval(function() {
                emitter.emit('alcohol', Alcohol.scan());
        }, 5000);
};
