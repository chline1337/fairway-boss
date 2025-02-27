const { defaultPlayer } = require('../utils/common');

/**
 * Loads a player from the database using the userId.
 * If not found, creates a new player with default values and seeds milestones.
 * @param {Object} db - MongoDB database instance.
 * @param {string} userId - Unique user identifier.
 * @returns {Object} The player object.
 */
const loadPlayer = async (db, userId) => {
    if (!userId) throw new Error('No userId provided');
    let player = await db.collection('players').findOne({ userId });
    if (!player) {
        player = { ...defaultPlayer, userId };
        const result = await db.collection('players').insertOne(player);
        console.log('New player inserted for userId:', userId, 'with id:', result.insertedId);
        player._id = result.insertedId;

        // Seed player milestones from the default milestones (if any exist)
        const milestones = await db.collection('milestones').find().toArray();
        console.log('Milestones fetched for new player:', milestones.length);
        if (milestones.length === 0) {
            console.warn('No milestones found in database - player milestones will be empty');
        }
        const playerMilestones = milestones.map(m => ({
            userId,
            milestoneId: m._id,
            progress: m._id.includes('level') ? 1 : 0,
            completed: false
        }));
        if (playerMilestones.length > 0) {
            const insertResult = await db.collection('playerMilestones').insertMany(playerMilestones);
            console.log('Player milestones inserted:', insertResult.insertedIds);
        } else {
            console.log('No player milestones to insert - milestones collection empty');
        }
    }
    return player;
};

/**
 * Saves the player data to the database.
 * @param {Object} db - MongoDB database instance.
 * @param {Object} player - The player object.
 * @returns {Object} The updated player.
 */
const savePlayer = async (db, player) => {
    const { _id, ...playerData } = player;
    await db.collection('players').updateOne(
        { _id },
        { $set: playerData },
        { upsert: true }
    );
    return player;
};

module.exports = { loadPlayer, savePlayer };
