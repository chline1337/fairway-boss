// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // The file from Step 2
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const { connectDB, getDB } = require('./config/db'); // the new db module

const app = express();
app.use(express.json());

// Example: temporarily allow all origins for dev
app.use(cors({ origin: true, credentials: true }));

// Optionally add logging for incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url} from ${req.get('origin') || 'No origin'}`);
    next();
});

// Connect to the DB in an async IIFE so we can await
(async () => {
    try {
        const uri = process.env.MONGO_URI?.trim();
        if (!uri) {
            throw new Error('MONGO_URI not set in environment variables');
        }
        await connectDB(uri);

        // Expose db on app.locals, so route handlers can do req.app.locals.db
        app.locals.db = getDB();

        // Import routes AFTER the DB is ready
        const authRoutes = require('./routes/auth');
        const shopRoutes = require('./routes/shop');
        const levelRoutes = require('./routes/level');
        const leaderboardRoutes = require('./routes/leaderboard');
        const playerRoutes = require('./routes/player');
        const tournamentRoutes = require('./routes/tournament');
        const trainingRoutes = require('./routes/training');

        // Mount new-style routers
        app.use(authRoutes);
        app.use(shopRoutes);
        app.use(playerRoutes);
        app.use(levelRoutes);
        app.use(leaderboardRoutes);
        app.use(tournamentRoutes);
        app.use(trainingRoutes);

        // Serve your YAML-based Swagger spec at /api-docs
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // Simple health check
        app.get('/api', (req, res) => res.json({ status: 'API is live' }));

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
})();

module.exports = app;
