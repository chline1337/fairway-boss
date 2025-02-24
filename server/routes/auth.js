const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

module.exports = (app) => {
    app.post('/register', async (req, res) => {
        try {
            const { username, password, email } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password required' });
            }
            const db = app.locals.db;
            const existingUser = await db.collection('users').findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await db.collection('users').insertOne({
                username,
                password: hashedPassword,
                email: email || null
            });
            const userId = result.insertedId.toString(); // Convert ObjectId to string
            console.log('Registered user:', { username, userId });
            const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token, userId });
        } catch (err) {
            console.error('Error in /register:', err.message);
            if (err.code === 11000) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            res.status(500).json({ error: 'Registration failed' });
        }
    });

    app.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const db = app.locals.db;
            const user = await db.collection('users').findOne({ username });
            if (!user) {
                console.error('Login failed—no user:', username);
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                console.error('Login failed—wrong password for:', username);
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const userId = user._id.toString(); // Convert ObjectId to string
            const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
            console.log('Logged in user:', { username, userId });
            res.json({ token, userId });
        } catch (err) {
            console.error('Error in /login:', err.message);
            res.status(500).json({ error: 'Login failed' });
        }
    });

    app.post('/logout', (req, res) => {
        res.json({ message: 'Logged out' });
    });
};