// server/routes/tournament.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const tournamentController = require('../controllers/tournamentController');

const SECRET_KEY = 'your-secret-key';

// Inline or separate auth middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Invalid token:', err.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// GET /tournament/options
router.get('/tournament/options', authMiddleware, tournamentController.getTournamentOptions);

// GET /tournament/history
router.get('/tournament/history', authMiddleware, tournamentController.getTournamentHistory);

// POST /tournament
router.post('/tournament', authMiddleware, tournamentController.createTournament);

module.exports = router;
