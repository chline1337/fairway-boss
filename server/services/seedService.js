// server/services/seedService.js
const { seedMilestones } = require('./milestoneService');
const { seedCourses } = require('./courseService');
const { seedEvents } = require('./eventService');
const { seedWeatherConditions } = require('./weatherService');
const { seedItems } = require('./itemService');
const { seedAiPlayers } = require('./aiPlayerService');

/**
 * Aggregates all individual seed functions to ensure the database is populated with default data.
 * @param {Object} db - The MongoDB database instance.
 */
const seedDatabase = async (db) => {
    try {
        await seedMilestones(db);
        await seedCourses(db);
        await seedEvents(db);
        await seedWeatherConditions(db);
        await seedItems(db);
        await seedAiPlayers(db);
        console.log('Database seeding complete.');
    } catch (err) {
        console.error('Error during database seeding:', err.message);
    }
};

module.exports = { seedDatabase };
