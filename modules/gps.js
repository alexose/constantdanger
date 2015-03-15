var mraa = require("mraa");
var nmeaParser = require("nmea-0183");
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var emitter;

module.exports = function(emitter_in) {
  emitter = emitter_in;
  emitter_in.emit('register', 'gps');
}

serialPort = new SerialPort('/dev/ttyMFD1', {
  baudrate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  parser: serialport.parsers.readline("\n")
});

serialPort.on('data', saveLatestData);

function saveLatestData(data) {
  if (/^\$GPGGA/.test(data)) {
    try {
      var gps_line = nmeaParser.parse(data.trim());

      if (gps_line.fix) {
        // AGGGHHHHHH!!1
        // We were getting memory corruption issues. maybe this will halp
        gps_line = JSON.parse(JSON.stringify(gps_line));
        console.log("GPS location: " + gps_line.latitude + ", " + gps_line.longitude);
        emitter.emit('gps', gps_line);
      }
    } catch (Error) {
      console.log("got corrupted data from GPS: " + gps_line);
    }
  }
}
