const jwt = require('jsonwebtoken');
const { loadPlayer, savePlayer, getXpForLevel, checkMilestones } = require('./utils'); // Correct path

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
    app.post('/level-up', authMiddleware, async (req, res) => {
        try {
            const db = app.locals.db;
            const { stat } = req.body;
            if (!['driving', 'irons', 'putting', 'mental'].includes(stat)) {
                return res.status(400).json({ error: 'Invalid stat' });
            }
            const player = await loadPlayer(db, req.userId);
            const nextLevelXp = getXpForLevel(player.level + 1);
            if (player.xp >= nextLevelXp) {
                player.level += 1;
                player.stats[stat] += 2;
                player.xp -= nextLevelXp;
                await checkMilestones(db, player);
                await savePlayer(db, player);
                console.log(`Leveled up to ${player.level}, boosted ${stat}`);
            }
            res.json(player);
        } catch (err) {
            console.error('Error in /level-up:', err.message);
            res.status(500).json({ error: 'Level-up failed' });
        }
    });
};