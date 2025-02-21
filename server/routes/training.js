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
            const statIncrease = Math.floor(Math.random() * 3) + 1;
            player.stats[stat] += statIncrease;
            player.xp = (player.xp || 0) + Math.floor(Math.random() * 11) + 10;

            await db.collection('playerMilestones').updateOne(
                { userId: req.userId, milestoneId: 'train_50', completed: false },
                { $inc: { progress: 1 } }
            );

            await checkMilestones(db, player);
            await savePlayer(db, player);
            res.json(player);
        } catch (err) {
            console.error('Error in /train:', err.message);
            if (err.response?.status === 401) {
                res.status(401).json({ error: 'Session expired. Please log in again.' });
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.reload();
            } else {
                res.status(500).json({ error: 'Training failed' });
            }
        }
    });
};