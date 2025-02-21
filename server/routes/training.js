const jwt = require('jsonwebtoken');
const { loadPlayer, savePlayer, checkMilestones } = require('./utils');

const SECRET_KEY = 'your-secret-key'; // Match auth.js

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
            if (!['driving', 'irons', 'putting', 'mental'].includes(stat)) { // Add validation
                return res.status(400).json({ error: 'Invalid stat' });
            }
            const statIncrease = Math.floor(Math.random() * 3) + 1;
            player.stats[stat] += statIncrease;
            player.xp = (player.xp || 0) + Math.floor(Math.random() * 11) + 10;
            const trainMilestone = player.milestones.find(m => m.id === 'train_50');
            if (trainMilestone && !trainMilestone.completed) trainMilestone.progress += 1;
            checkMilestones(player); // Pure JS
            await savePlayer(db, player);
            res.json(player);
        } catch (err) {
            console.error('Error in /train:', err.message);
            res.status(500).json({ error: 'Training failed' });
        }
    });
};