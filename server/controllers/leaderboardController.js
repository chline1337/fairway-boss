// server/controllers/leaderboardController.js
const jwt = require('jsonwebtoken'); // if needed, otherwise remove
// Possibly import any other utils if needed
// const { someUtil } = require('../utils/utils');

exports.getLeaderboard = async (req, res) => {
    try {
        const db = req.app.locals.db;
        console.log('User ID from token:', req.userId);

        const tournaments = await db.collection('tournaments').find({ userId: req.userId }).toArray();
        console.log('Fetched tournaments:', tournaments);

        const pointsTable = [100, 80, 60, 50, 40, 30, 20, 10, 5, 2];
        const playerPoints = {};
        const playerWins = {};

        tournaments.forEach((tournament) => {
            tournament.leaderboard.forEach((entry) => {
                const name = entry.name;
                const position = entry.position;
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
};
