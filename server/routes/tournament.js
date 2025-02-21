const jwt = require('jsonwebtoken');
const { loadPlayer, savePlayer, checkMilestones } = require('./utils'); // Correct path

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

const courses = [
    { name: 'Riyadh Golf Club', drivingMod: 0.3, ironsMod: 0.3, puttingMod: 0.2, mentalMod: 0.2 },
    { name: 'Trump National Doral', drivingMod: 0.4, ironsMod: 0.2, puttingMod: 0.2, mentalMod: 0.2 },
    { name: 'Real Club Valderrama', drivingMod: 0.2, ironsMod: 0.4, puttingMod: 0.2, mentalMod: 0.2 },
    { name: 'Jack Nicklaus Golf Club Korea', drivingMod: 0.3, ironsMod: 0.2, puttingMod: 0.3, mentalMod: 0.2 }
];

const weatherConditions = [
    {
        name: 'Calm',
        scoreMod: 0,
        statAdjust: { driving: 0, irons: 0, putting: 0, mental: 0 },
        tacticAdjust: { aggressive: 0, conservative: 0, balanced: 0 }
    },
    {
        name: 'Windy',
        scoreMod: 2,
        statAdjust: { driving: -0.1, irons: 0, putting: 0, mental: 0.1 },
        tacticAdjust: { aggressive: -5, conservative: 0, balanced: 0 }
    },
    {
        name: 'Rainy',
        scoreMod: 3,
        statAdjust: { driving: 0, irons: -0.1, putting: 0.1, mental: 0 },
        tacticAdjust: { aggressive: 0, conservative: 5, balanced: 0 }
    }
];

const getRandomCourse = () => courses[Math.floor(Math.random() * courses.length)];
const getRandomWeather = () => weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

module.exports = (app) => {
    app.get('/tournament', authMiddleware, async (req, res) => {
        try {
            const db = app.locals.db;
            const player = await loadPlayer(db, req.userId);
            const course = getRandomCourse();
            const weather = getRandomWeather();
            res.json({ week: player.week, course: course.name, weather: weather.name });
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
            const course = courses.find(c => c.name === courseName);
            const weather = weatherConditions.find(w => w.name === weatherName);

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
            const tacticMod = { aggressive: -2, conservative: 2, balanced: 0 }[tactic] + weather.tacticAdjust[tactic];
            const scores = Array(4).fill(0).map(() => {
                const random = Math.floor(Math.random() * 11) - 5;
                return 68 - Math.round((baseScore - 50) / 10) + tacticMod + weather.scoreMod + random;
            });
            const total = scores.reduce((a, b) => a + b, 0);
            const aiScores = Array(19).fill(0).map(() => 280 - Math.floor(Math.random() * 21) + weather.scoreMod);
            const allScores = [...aiScores, total].sort((a, b) => a - b);
            const place = allScores.indexOf(total) + 1;
            const prizes = [50000, 30000, 20000, 15000, 10000, 5000];
            const prize = prizes[place - 1] || 0;

            console.log('Player total:', total, 'Place:', place, 'All scores:', allScores);

            player.cash += prize;
            player.earnings += prize;
            if (place === 1) player.wins = (player.wins || 0) + 1;
            player.xp = (player.xp || 0) + Math.max(100 - (place - 1) * 10, 10);
            player.week += 1;
            player.tournamentsPlayed = (player.tournamentsPlayed || 0) + 1;
            await checkMilestones(db, player);
            await savePlayer(db, player);

            res.json({ scores, total, place, prize, player, course: course.name, weather: weather.name });
        } catch (err) {
            console.error('Error in POST /tournament:', err.message);
            res.status(500).json({ error: 'Tournament failed' });
        }
    });
};