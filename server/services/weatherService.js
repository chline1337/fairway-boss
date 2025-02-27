// server/services/weatherService.js
const seedWeatherConditions = async (db) => {
    const weatherCount = await db.collection('weatherConditions').countDocuments();
    if (weatherCount === 0) {
        const defaultWeatherConditions = [
            {
                name: 'Calm',
                scoreMod: 0,
                statAdjust: { driving: 0, irons: 0, putting: 0, mental: 0 },
                tacticAdjust: { aggressive: 0, conservative: 0, balanced: 0 }
            },
            {
                name: 'Windy',
                scoreMod: 2,
                statAdjust: { driving: -0.1, irons: 0, putting: 0, mental: 0.1 },
                tacticAdjust: { aggressive: -5, conservative: 0, balanced: 0 }
            },
            {
                name: 'Rainy',
                scoreMod: 3,
                statAdjust: { driving: 0, irons: -0.1, putting: 0.1, mental: 0 },
                tacticAdjust: { aggressive: 0, conservative: 5, balanced: 0 }
            }
        ];
        await db.collection('weatherConditions').insertMany(defaultWeatherConditions);
        console.log('Initialized weatherConditions collection');
    } else {
        console.log('WeatherConditions collection already seeded');
    }
};

module.exports = { seedWeatherConditions };
