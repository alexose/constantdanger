// Broadcast fake GPS data every 10 seconds

module.exports = function(emitter) {
    setInterval(function(){
        emitter.emit('gps', {
            id: 'GPGGA',
            time: '150017.000',
            latitude: '42.37853833',
            longitude: '-71.10413167',
            fix: 1,
            satellites: 3,
            hdop: 4.17,
            altitude: 15.5,
            aboveGeoid: -33.7,
            dgpsUpdate: '',
            dgpsReference: ''
        });
    }, 10 * 1000);
}
