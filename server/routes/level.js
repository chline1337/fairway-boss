// server/routes/level.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const levelController = require('../controllers/levelController');

const SECRET_KEY = 'your-secret-key';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.post('/level-up', authMiddleware, levelController.levelUp);

module.exports = router;
