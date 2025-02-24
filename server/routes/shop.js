// server/routes/shop.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const shopController = require('../controllers/shopController');

const SECRET_KEY = 'your-secret-key';

// Auth middleware (inline or from a separate file)
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

// GET /items
router.get('/items', shopController.getItems);

// POST /buy (protected by auth)
router.post('/buy', authMiddleware, shopController.buyItem);

// POST /sell (protected by auth)
router.post('/sell', authMiddleware, shopController.sellItem);

module.exports = router;
