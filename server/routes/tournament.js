const jwt = require('jsonwebtoken');
const { loadPlayer, savePlayer, checkMilestones } = require('./utils');

const SECRET_KEY = 'your-secret-key';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Invalid token:', err.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

const getTournamentOptions = async (db) => {
    const courses = await db.collection('courses').find().toArray();
    const weatherConditions = await db.collection('weatherConditions').find().toArray();
    const events = await db.collection('events').find().toArray();
    return {
        courses: courses.map(c => c.name),
        weatherConditions: weatherConditions.map(w => w.name),
        events: events.map(e => e.name)
    };
};

const generateLeaderboard = async (db, playerScores, weather, course) => {
    const aiPlayers = await db.collection('aiPlayers').find().toArray();
    const par = 72;
    const leaderboard = aiPlayers.map(ai => {
        const scores = Array(4).fill(0).map(() => {
            const baseAdjustment = Math.floor(Math.random() * 4) + 2;
            const random = Math.floor(Math.random() * 11) - 5;
            return par - baseAdjustment + weather.scoreMod + random;
        });
        return { name: ai.name, scores, total: scores.reduce((a, b) => a + b, 0) };
    });
    const playerEntry = { name: 'You', scores: playerScores, total: playerScores.reduce((a, b) => a + b, 0) };
    leaderboard.push(playerEntry);

    // Sort by total, prioritizing "You" in ties
    leaderboard.sort((a, b) => {
        if (a.total === b.total) return a.name === 'You' ? -1 : 1;
        return a.total - b.total;
    });

    // Assign explicit positions
    return leaderboard.map((entry, index) => ({
        ...entry,
        position: index + 1
    }));
};

module.exports = (app) => {
    app.get('/tournament/options', authMiddleware, async (req, res) => {
        const db = app.locals.db;
        try {
            const player = await loadPlayer(db, req.userId);
            const options = await getTournamentOptions(db);
            res.json({ week: player.week, ...options });
        } catch (err) {
            console.error('Error in GET /tournament/options:', err.message);
            res.status(500).json({ error: 'Failed to load tournament options' });
        }
    });

    app.get('/tournament/history', authMiddleware, async (req, res) => {
        const db = app.locals.db;
        try {
            const history = await db.collection('tournaments')
                .find({ userId: req.userId })
                .sort({ completedAt: -1 })
                .toArray();
            res.json(history);
        } catch (err) {
            console.error('Error in GET /tournament/history:', err.message);
            res.status(500).json({ error: 'Failed to load tournament history' });
        }
    });

    app.post('/tournament', authMiddleware, async (req, res) => {
        const db = app.locals.db;
        try {
            const player = await loadPlayer(db, req.userId);
            const { tactic, courseName, weatherName, eventName } = req.body;

            const course = await db.collection('courses').findOne({ name: courseName });
            const weather = await db.collection('weatherConditions').findOne({ name: weatherName });
            const event = await db.collection('events').findOne({ name: eventName });

            if (!course || !weather || !event) {
                return res.status(400).json({ error: 'Invalid course, weather, or event name' });
            }

            const drivingMod = course.drivingMod + weather.statAdjust.driving;
            const ironsMod = course.ironsMod + weather.statAdjust.irons;
            const puttingMod = course.puttingMod + weather.statAdjust.putting;
            const mentalMod = course.mentalMod + weather.statAdjust.mental;

            const baseScore = Math.round(
                player.stats.driving * (1 + drivingMod) +
                player.stats.irons * (1 + ironsMod) +
                player.stats.putting * (1 + puttingMod) +
                player.stats.mental * (1 + mentalMod)
            );
            const par = 72;
            const baseAdjustment = Math.round(baseScore / 100);
            const tacticMod = { aggressive: -2, conservative: 2, balanced: 0 }[tactic] + weather.tacticAdjust[tactic];

            const scores = Array(4).fill(0).map(() => {
                const random = Math.floor(Math.random() * 11) - 5;
                return par - baseAdjustment + tacticMod + weather.scoreMod + random;
            });
            const total = scores.reduce((a, b) => a + b, 0);

            const leaderboard = await generateLeaderboard(db, scores, weather, course);
            const place = leaderboard.find(p => p.name === 'You').position;

            const prizes = [4000000, 2000000, 1200000, 800000, 600000, 400000, 300000, 200000, 150000, 100000];
            const prize = prizes[place - 1] || 50000;

            console.log('Player total:', total, 'Place:', place, 'Leaderboard:', leaderboard);

            player.cash += prize;
            player.earnings += prize;
            if (place === 1) player.wins = (player.wins || 0) + 1;
            player.xp = (player.xp || 0) + Math.max(100 - (place - 1) * 10, 10);
            player.week += 1;
            player.tournamentsPlayed = (player.tournamentsPlayed || 0) + 1;
            await checkMilestones(db, player);
            await savePlayer(db, player);

            const tournament = {
                userId: req.userId,
                week: player.week - 1,
                eventName,
                courseName,
                weatherName,
                tactic,
                rounds: leaderboard.map(p => ({ name: p.name, scores: p.scores })),
                leaderboard,
                place,
                prize,
                total,
                completedAt: new Date()
            };
            await db.collection('tournaments').insertOne(tournament);

            res.json({
                scores,
                total,
                place,
                prize,
                player,
                course: course.name,
                weather: weather.name,
                eventName,
                rounds: tournament.rounds,
                leaderboard
            });
        } catch (err) {
            console.error('Error in POST /tournament:', err.message);
            res.status(500).json({ error: 'Tournament failed' });
        }
    });
};