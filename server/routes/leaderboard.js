const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key'; // Must match tournament.js

module.exports = (app) => {
    const authMiddleware = (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.userId = decoded.userId;
            next();
        } catch (err) {
            console.error('Invalid token:', err.message);
            return res.status(401).json({ error: 'Invalid token' });
        }
    };

    app.get('/leaderboard', authMiddleware, async (req, res) => {
        const db = app.locals.db;
        try {
            console.log('User ID from token:', req.userId);
            const tournaments = await db.collection('tournaments').find({ userId: req.userId }).toArray();
            console.log('Fetched tournaments:', tournaments);

            const playerPoints = {};
            const playerWins = {};
            const pointsTable = [100, 80, 60, 50, 40, 30, 20, 10, 5, 2];

            tournaments.forEach(tournament => {
                tournament.leaderboard.forEach(entry => {
                    const name = entry.name;
                    const position = entry.position; // Use stored position
                    const points = position <= 10 ? pointsTable[position - 1] : 0;

                    if (!playerPoints[name]) {
                        playerPoints[name] = 0;
                        playerWins[name] = 0;
                    }
                    playerPoints[name] += points;
                    if (position === 1) playerWins[name] += 1;
                });
            });

            const leaderboard = Object.entries(playerPoints)
                .map(([name, points]) => ({
                    name,
                    points,
                    wins: playerWins[name] || 0,
                }))
                .sort((a, b) => b.points - a.points);

            console.log('Aggregated leaderboard:', leaderboard);
            res.json(leaderboard);
        } catch (err) {
            console.error('Error in GET /leaderboard:', err.message);
            res.status(500).json({ error: 'Failed to load leaderboard' });
        }
    });
};