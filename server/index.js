// server/index.js
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const app = express();
app.use(express.json());

// Temporarily allow all origins (for development/testing)
app.use(cors({
    origin: true,
    credentials: true
}));

// If you'd like to keep your request logging, place it here:
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url} from ${req.get('origin') || 'No origin'}`);
    next();
});

console.log('Environment variables:', process.env);
const uri = process.env.MONGO_URI?.trim();
if (!uri) {
    throw new Error('MONGO_URI not set in environment variables');
}
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error(`Invalid MONGO_URI format: ${uri}`);
}
console.log('MongoDB URI:', uri);
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('fairwayboss');
        app.locals.db = db;

        // ...All your code for ensuring indexes and default data initializations...
        // e.g. ensure users index, fill up milestone defaults, item defaults, etc.

    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}
connectDB();

// Import routes
const authRoutes = require('./routes/auth');    // old style
const playerRoutes = require('./routes/player');
const tournamentRoutes = require('./routes/tournament');
const shopRoutes = require('./routes/shop');
const trainingRoutes = require('./routes/training');
const levelRoutes = require('./routes/level');
const leaderboardRoutes = require('./routes/leaderboard');

// The old style routes are still being called as a function with (app)
// The new router-based route (playerRoutes) is used via app.use

require('./routes/auth')(app);
app.use(playerRoutes);
require('./routes/tournament')(app);
require('./routes/shop')(app);
require('./routes/training')(app);
require('./routes/level')(app);
require('./routes/leaderboard')(app);

app.get('/api', (req, res) => res.json({ status: 'API is live' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
