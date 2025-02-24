// server/routes/player.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const playerController = require('../controllers/playerController');

const SECRET_KEY = 'your-secret-key';

// This is the same auth middleware you had. 
// If you already have a separate file (e.g., server/middleware/authMiddleware.js), import it from there.
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        console.log('Auth middleware - userId:', req.userId);
        next();
    } catch (err) {
        console.error('Invalid token:', err.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Define routes
router.get('/api/player', authMiddleware, playerController.getPlayer);
router.post('/update-name', authMiddleware, playerController.updateName);
router.post('/reset', authMiddleware, playerController.resetPlayer);

module.exports = router;
