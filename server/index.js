// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const { connectDB, getDB } = require('./config/db'); // your DB module
const { seedDatabase } = require('./services/seedService'); // combined seed service

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Logging middleware for incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url} from ${req.get('origin') || 'No origin'}`);
    next();
});

(async () => {
    try {
        const uri = process.env.MONGO_URI?.trim();
        if (!uri) {
            throw new Error('MONGO_URI not set in environment variables');
        }
        await connectDB(uri);
        app.locals.db = getDB();

        // Seed default data into all collections
        await seedDatabase(app.locals.db);

        // Import routers (which export an express.Router)
        const authRoutes = require('./routes/auth');
        const shopRoutes = require('./routes/shop');
        const trainingRoutes = require('./routes/training');
        const levelRoutes = require('./routes/level');
        const leaderboardRoutes = require('./routes/leaderboard');
        const tournamentRoutes = require('./routes/tournament');
        const playerRoutes = require('./routes/player');

        // Mount routers on the app
        app.use(authRoutes);
        app.use(shopRoutes);
        app.use(trainingRoutes);
        app.use(levelRoutes);
        app.use(leaderboardRoutes);
        app.use(tournamentRoutes);
        app.use(playerRoutes);

        // Health check endpoint
        app.get('/api', (req, res) => res.json({ status: 'API is live' }));

        const PORT = process.env.PORT || 5000;
        // Bind the server to all network interfaces (0.0.0.0)
        app.listen(PORT, '0.0.0.0', () =>
            console.log(`Server running on http://0.0.0.0:${PORT}`)
        );
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
})();

module.exports = app;
