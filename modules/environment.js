var https = require('https')
  , qs = require('querystring')
  , fs = require('fs');

// Read in GPS data and respond with data from YourMapper2
module.exports = function(emitter){

    var json = fs.readFileSync('./yourmapper.cache.json', 'UTF-8')
      , data = JSON.parse(json);

    var fields = {
      bridge_safety:   'Bridge Safety',
      meth_labs:       'Meth Labs',
      toxic_emissions: 'Toxic Pollution Emissions',
      toxic_chemicals: 'Toxic Release Chemicals'
    };

    // Register all fields
    for (var key in fields){
      emitter.emit('register', key);
    }

    // Broadcast on gps update!
    emitter.on('gps', function(latlon){

        // TODO: actually update via API
        // hey, this is hackathon project...
        data.items.forEach(function(field){
            for (var prop in fields){
                if (field.Name === fields[prop]){
                    var value = parseFloat(field.RatingScore, 10);
                    emitter.emit(prop, value);
                }
            }
        });
    });
};

function getData(){

    var params = qs.stringify({
        format: 'json',
        maxlat: 42.39,
        maxlon: -71.08,
        minlat: 42.37,
        minlon: -71.10,
        sort:   'location',
        num: 9000
    });

    var options = {
        host : 'yourmapper2.p.mashape.com',
        path : '/datasetlist?' + params,
        headers : {
            'X-Mashape-Key' : 'fiseUvSBAnmshkIbmY1Tm7aZ1swPp1p9FW5jsnjd497WnQwbVw',
            'Accept' : 'application/json'
        }
    }

    https.get(options, callback);

    function callback(response) {
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end',function(){
            var obj = JSON.parse(str);

            var formatted = JSON.stringify(obj, null, 2);

            console.log(formatted);
        });
    }
}
