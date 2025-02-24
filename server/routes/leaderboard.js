// server/routes/leaderboard.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const leaderboardController = require('../controllers/leaderboardController');

const SECRET_KEY = 'your-secret-key';

// Inline auth middleware (or use a separate file if you prefer)
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Invalid token:', err.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// GET /leaderboard
router.get('/leaderboard', authMiddleware, leaderboardController.getLeaderboard);

module.exports = router;
