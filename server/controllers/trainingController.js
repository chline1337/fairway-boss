// server/controllers/trainingController.js
const { loadPlayer, savePlayer, checkMilestones } = require('../utils/utils');

exports.trainStat = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const player = await loadPlayer(db, req.userId);
        const { stat } = req.body;

        if (!['driving', 'irons', 'putting', 'mental'].includes(stat)) {
            return res.status(400).json({ error: 'Invalid stat' });
        }

        // Ensure player.stats exists with defaults
        if (!player.stats) {
            player.stats = { driving: 60, irons: 50, putting: 45, mental: 55 };
        }

        if (typeof player.stats[stat] !== 'number') {
            return res.status(400).json({ error: 'Invalid stat value' });
        }

        const statIncrease = Math.floor(Math.random() * 3) + 1;
        player.stats[stat] = Math.min(player.stats[stat] + statIncrease, 100); // Cap at 100
        player.xp = (player.xp || 0) + Math.floor(Math.random() * 11) + 10;

        // Increment the progress of the train_50 milestone
        await db.collection('playerMilestones').updateOne(
            { userId: req.userId, milestoneId: 'train_50', completed: false },
            { $inc: { progress: 1 } },
            { upsert: true }
        );

        await checkMilestones(db, player);
        await savePlayer(db, player);

        res.json(player);
    } catch (err) {
        console.error('Error in trainStat:', err.message);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        res.status(500).json({ error: 'Training failed' });
    }
};
