const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('./utils');

const SECRET_KEY = 'your-secret-key'; // Replace with env var in prod

module.exports = (app) => {
    app.post('/register', async (req, res) => {
        try {
            const { username, password, email } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password required' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                [username, hashedPassword, email || null], function (err) {
                    if (err) {
                        console.error('Error registering user:', err.message);
                        return res.status(500).json({ error: 'Registration failed—username might be taken' });
                    }
                    const userId = this.lastID;
                    console.log('Registered user:', { username, userId });
                    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
                    res.json({ token, userId });
                });
        } catch (err) {
            console.error('Error in /register:', err.message);
            res.status(500).json({ error: 'Registration failed' });
        }
    });

    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err || !user) {
                console.error('Login failed—no user:', err?.message || 'No user found');
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                console.error('Login failed—wrong password for:', username);
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
            console.log('Logged in user:', { username, userId: user.id });
            res.json({ token, userId: user.id });
        });
    });

    app.post('/logout', (req, res) => {
        res.json({ message: 'Logged out' }); // Client clears token
    });
};