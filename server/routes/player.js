const jwt = require('jsonwebtoken');
const { loadPlayer, savePlayer, defaultPlayer, checkMilestones } = require('./utils'); // Correct path

const SECRET_KEY = 'your-secret-key';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        console.log('Auth middleware - userId:', req.userId);
        next();
    } catch (err) {
        console.error('Invalid token:', err.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = (app) => {
    app.get('/api/player', authMiddleware, async (req, res) => {
        const db = app.locals.db;
        try {
            const player = await loadPlayer(db, req.userId);
            if (!player) {
                return res.status(404).json({ error: 'Player not found' });
            }
            // Ensure all required fields exist, using defaults if missing
            const response = {
                name: player.name || 'Rookie',
                cash: player.cash || 50000,
                level: player.level || 1,
                stats: player.stats || { driving: 60, irons: 50, putting: 45, mental: 55 },
                equipment: player.equipment || [],
                week: player.week || 1,
                earnings: player.earnings || 0,
                wins: player.wins || 0,
                xp: player.xp || 0,
                itemsBought: player.itemsBought || 0,
                tournamentsPlayed: player.tournamentsPlayed || 0,
                itemsSold: player.itemsSold || 0,
                cashSpent: player.cashSpent || 0,
                userId: player.userId,
                _id: player._id
            };
            const playerMilestones = await db.collection('playerMilestones').find({ userId: req.userId }).toArray();
            const milestones = await db.collection('milestones').find({
                _id: { $in: playerMilestones.map(pm => pm.milestoneId) }
            }).toArray();
            // Add milestones
            response.milestones = playerMilestones.map(pm => {
                const milestone = milestones.find(m => m._id === pm.milestoneId);
                return {
                    id: pm._id,
                    name: milestone.name,
                    progress: pm.progress,
                    target: milestone.target,
                    completed: pm.completed,
                    reward: milestone.reward
                };
            });
            res.json(response);
        } catch (err) {
            console.error('Error in GET /player:', err.message);
            res.status(500).json({ error: 'Failed to load player' });
        }
    });

    app.post('/update-name', authMiddleware, async (req, res) => {
        try {
            const db = app.locals.db;
            const player = await loadPlayer(db, req.userId);
            const { name } = req.body;
            if (!name || typeof name !== 'string' || name.trim().length < 1) {
                return res.status(400).json({ error: 'Invalid name' });
            }
            player.name = name.trim();
            await savePlayer(db, player);
            res.json(player);
        } catch (err) {
            console.error('Error in /update-name:', err.message, err.stack);
            res.status(500).json({ error: 'Update name failed' });
        }
    });

    app.post('/reset', authMiddleware, async (req, res) => {
        try {
            const db = app.locals.db;
            const resetPlayer = { ...defaultPlayer, userId: req.userId };
            await savePlayer(db, resetPlayer);
            res.json(resetPlayer);
        } catch (err) {
            console.error('Error in /reset:', err.message, err.stack);
            res.status(500).json({ error: 'Reset failed' });
        }
    });
};