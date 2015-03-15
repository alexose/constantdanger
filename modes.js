// Modes!
// Ideally, each observation has a 'relevance score' between 0 and 100.
module.exports = {

    general : {
        entropy:              15,
        air_quality:          30,
        excessivetemperature: 20, // Temp > 100
        lowtemperature:       20,  // Temp < 20
        gasleak:              80,
        angrysportsfans:      20,
        air_quality:          10,
        crime:                35,

        // Via yourmapper2 API
        bridge_safety:        30,
        meth_labs:            50,
        toxic_emissions:      30,
        toxic_chemicals:      35
    },

    bodily_harm : {
        excessivetemperature: 20, // Temp > 100
        lowtemperature:       20,  // Temp < 20
        gasleak:              80,
        angrysportsfans:      20,
        air_quality:          10,
        crime:                35,

        // Via yourmapper2 API
        bridge_safety:        30,
        meth_labs:            50,
        toxic_emissions:      30,
        toxic_chemicals:      35
    },

    emotional_harm : {
        angrysportsfans:      10,
        stockmarketdown:      20,
        hackathon:            40,
        air_quality:          20,
        nowifi:               90
    },

    financial_harm : {
        stockmarketdown:      20
    },

    cyber_harm: {
        low_bluetooth:        10,
        excessive_bluetooth:  75,
        nowifi:               90,
        insecure_wifi:        55
    },

    social_harm: {
        angrysportsfans:      20,
        meth_labs:            50,
        stockmarketdown:      20,
        crime:                35,
        nowifi:               90
    },

    entropy_harm: {
        entropy:              40
    }
}
