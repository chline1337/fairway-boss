// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /register
router.post('/register', authController.register);

// POST /login
router.post('/login', authController.login);

// POST /logout
router.post('/logout', authController.logout);

module.exports = router;
