// Modes!
// Ideally, each observation has a 'relevance score' between 0 and 100.
module.exports = {
    general : {
        entropy : 40,
        air_quality: 30
    },
    bodily_harm : {
        excessivetemperature: 20, // Temp > 100
        lowtemperature:       20,  // Temp < 20
        gasleak:              80,
        angrysportsfans:      20,
        air_quality:          10,
        crime:                35
    },
    emotional_harm : {
        angrysportsfans:      10,
        stockmarketdown:      20,
        hackathon:            40,
        air_quality:          20,
        nowifi:               90
    },
}
