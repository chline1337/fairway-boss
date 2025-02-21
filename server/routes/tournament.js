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

const getRandomCourse = async (db) => {
    const courses = await db.collection('courses').find().toArray();
    return courses[Math.floor(Math.random() * courses.length)];
};

const getRandomWeather = async (db) => {
    const weatherConditions = await db.collection('weatherConditions').find().toArray();
    return weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
};

const getRandomEventName = () => {
    const events = [
        'Saudi International', 'LIV Golf Invitational', 'PGA Championship', 'Masters Tournament',
        'Dubai Desert Classic', 'Players Championship', 'Genesis Invitational', 'Memorial Tournament'
    ];
    return events[Math.floor(Math.random() * events.length)];
};

const generateLeaderboard = (playerTotal, weather) => {
    const aiPlayers = [
        'Scottie Scheffler', 'Rory McIlroy', 'Jon Rahm', 'Brooks Koepka', 'Jordan Spieth',
        'Justin Thomas', 'Xander Schauffele', 'Patrick Cantlay', 'Collin Morikawa', 'Viktor Hovland'
    ];
    const aiScores = aiPlayers.map(name => ({
        name,
        total: 270 - Math.floor(Math.random() * 21) + weather.scoreMod // 249-270 per round
    }));
    return [...aiScores, { name: 'You', total: playerTotal }].sort((a, b) => a.total - b.total);
};

module.exports = (app) => {
    app.get('/tournament', authMiddleware, async (req, res) => {
        try {
            const db = app.locals.db;
            const player = await loadPlayer(db, req.userId);
            const course = await getRandomCourse(db);
            const weather = await getRandomWeather(db);
            const eventName = getRandomEventName();
            res.json({ week: player.week, eventName, course: course.name, weather: weather.name });
        } catch (err) {
            console.error('Error in GET /tournament:', err.message);
            res.status(500).json({ error: 'Failed to load tournament preview' });
        }
    });

    app.post('/tournament', authMiddleware, async (req, res) => {
        try {
            const db = app.locals.db;
            const player = await loadPlayer(db, req.userId);
            const { tactic, courseName, weatherName } = req.body;

            const course = await db.collection('courses').findOne({ name: courseName });
            const weather = await db.collection('weatherConditions').findOne({ name: weatherName });

            if (!course || !weather) {
                return res.status(400).json({ error: 'Invalid course or weather' });
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

            // Simulate 4 rounds
            const scores = Array(4).fill(0).map((_, round) => {
                const random = Math.floor(Math.random() * 11) - 5;
                return par - baseAdjustment + tacticMod + weather.scoreMod + random;
            });
            const total = scores.reduce((a, b) => a + b, 0);

            // Generate leaderboard with AI scores
            const leaderboard = generateLeaderboard(total, weather);
            const place = leaderboard.findIndex(p => p.name === 'You') + 1;

            // LIV/PGA-inspired payouts (in-game millions)
            const prizes = [
                4000000, 2000000, 1200000, 800000, 600000, 400000, 300000, 200000, 150000, 100000
            ];
            const prize = prizes[place - 1] || 50000; // Minimum payout for lower ranks

            console.log('Player total:', total, 'Place:', place, 'Leaderboard:', leaderboard);

            player.cash += prize;
            player.earnings += prize;
            if (place === 1) player.wins = (player.wins || 0) + 1;
            player.xp = (player.xp || 0) + Math.max(100 - (place - 1) * 10, 10);
            player.week += 1;
            player.tournamentsPlayed = (player.tournamentsPlayed || 0) + 1;
            await checkMilestones(db, player);
            await savePlayer(db, player);

            res.json({
                scores,
                total,
                place,
                prize,
                player,
                course: course.name,
                weather: weather.name,
                leaderboard
            });
        } catch (err) {
            console.error('Error in POST /tournament:', err.message);
            res.status(500).json({ error: 'Tournament failed' });
        }
    });
};