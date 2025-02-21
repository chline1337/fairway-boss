const jwt = require('jsonwebtoken');
const { loadPlayer, savePlayer, defaultPlayer, checkMilestones } = require('./utils');

const SECRET_KEY = 'your-secret-key'; // Match auth.js

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
    app.get('/player', authMiddleware, async (req, res) => {
        try {
            const db = app.locals.db;
            console.log('Fetching player for userId:', req.userId);
            const player = await loadPlayer(db, req.userId);
            console.log('Player loaded:', player.name, 'with userId:', player.userId);
            checkMilestones(player); // Pure JS, no DB needed
            console.log('Milestones checked');
            await savePlayer(db, player);
            console.log('Player saved');
            res.json(player);
        } catch (err) {
            console.error('Error in GET /player:', err.message, err.stack);
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