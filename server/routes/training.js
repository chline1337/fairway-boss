const jwt = require('jsonwebtoken');
const { loadPlayer, savePlayer, checkMilestones } = require('./utils'); // Correct path

const SECRET_KEY = 'your-secret-key';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = (app) => {
    app.post('/train', authMiddleware, async (req, res) => {
        try {
            const db = app.locals.db;
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

            await db.collection('playerMilestones').updateOne(
                { userId: req.userId, milestoneId: 'train_50', completed: false },
                { $inc: { progress: 1 } },
                { upsert: true } // Create if not exists
            );

            await checkMilestones(db, player);
            await savePlayer(db, player);
            res.json(player);
        } catch (err) {
            console.error('Error in /train:', err.message);
            if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
            res.status(500).json({ error: 'Training failed' });
        }
    });
};