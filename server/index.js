const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/fairwayboss';
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('fairwayboss');
        app.locals.db = db;

        // Ensure unique index on users.username
        await db.collection('users').createIndex({ username: 1 }, { unique: true });
        console.log('Unique index on users.username ensured');

        // Initialize milestones collection (only if empty)
        const milestoneCount = await db.collection('milestones').countDocuments();
        if (milestoneCount === 0) {
            const defaultMilestones = [
                { _id: 'wins_5', name: 'Win 5 Tournaments', target: 5, reward: { cash: 10000 } },
                { _id: 'level_10', name: 'Reach Level 10', target: 10, reward: { xp: 500 } },
                { _id: 'earnings_100k', name: 'Earn $100,000', target: 100000, reward: { cash: 20000 } },
                { _id: 'train_50', name: 'Train 50 Times', target: 50, reward: { xp: 300 } },
                { _id: 'items_10', name: 'Buy 10 Items', target: 10, reward: { cash: 15000 } },
                { _id: 'tournaments_20', name: 'Play 20 Tournaments', target: 20, reward: { xp: 1000 } },
                { _id: 'sell_5', name: 'Sell 5 Items', target: 5, reward: { cash: 5000 } },
                { _id: 'cash_50k', name: 'Spend $50,000', target: 50000, reward: { xp: 200 } },
                { _id: 'wins_10', name: 'Win 10 Tournaments', target: 10, reward: { cash: 25000 } },
                { _id: 'level_20', name: 'Reach Level 20', target: 20, reward: { xp: 1000 } }
            ];
            await db.collection('milestones').insertMany(defaultMilestones);
            console.log('Initialized milestones collection');
        }

        // Initialize items collection (only if empty)
        const itemCount = await db.collection('items').countDocuments();
        if (itemCount === 0) {
            const defaultItems = [
                { name: 'TaylorMade Stealth 2 Driver', cost: 25000, stat: 'driving', boost: 7, category: 'driver' },
                { name: 'Callaway Rogue ST Fairway Wood', cost: 18000, stat: 'driving', boost: 5, category: 'fairway' },
                { name: 'Titleist T100 Irons', cost: 30000, stat: 'irons', boost: 8, category: 'irons' },
                { name: 'Mizuno JPX 923 Hot Metal Irons', cost: 22000, stat: 'irons', boost: 6, category: 'irons' },
                { name: 'Scotty Cameron Phantom X Putter', cost: 20000, stat: 'putting', boost: 7, category: 'putter' },
                { name: 'Odyssey White Hot OG Putter', cost: 15000, stat: 'putting', boost: 5, category: 'putter' },
                { name: 'Golf Pride MCC Grips', cost: 5000, stat: 'mental', boost: 3, category: 'grips' },
                { name: 'Titleist Pro V1 Golf Balls', cost: 8000, stats: { driving: 3, putting: 2 }, category: 'balls' },
                { name: 'Bridgestone Tour B XS Golf Balls', cost: 7000, stats: { irons: 3, putting: 2 }, category: 'balls' },
                { name: 'Cobra Golf Bag', cost: 10000, stat: 'mental', boost: 4, category: 'bag' },
                { name: 'FootJoy ProDry Shoes', cost: 12000, stat: 'mental', boost: 5, category: 'shoes' },
                { name: 'Garmin Approach S62 Watch', cost: 15000, stats: { irons: 4, mental: 2 }, category: 'watch' },
                { name: 'Bushnell Tour V6 Rangefinder', cost: 18000, stat: 'irons', boost: 6, category: 'rangefinder' },
                { name: 'TrackMan 4 Launch Monitor', cost: 40000, stats: { driving: 5, irons: 5 }, category: 'monitor' },
                { name: 'Swing Speed Trainer', cost: 6000, stat: 'driving', boost: 4, category: 'trainer' },
                { name: 'Putting Alignment Mirror', cost: 4000, stat: 'putting', boost: 3, category: 'mirror' },
                { name: 'Mental Game Coaching Session', cost: 9000, stat: 'mental', boost: 6, category: 'coaching' },
                { name: 'Rain Gear Set', cost: 11000, stat: 'mental', boost: 4, category: 'raingear' },
                { name: 'Callaway Chrome Soft Practice Balls', cost: 3000, stat: 'putting', boost: 2, category: 'practice' },
                { name: 'Golf Fitness Program', cost: 14000, stats: { driving: 3, mental: 3 }, category: 'fitness' }
            ];
            await db.collection('items').insertMany(defaultItems);
            console.log('Initialized items collection with full dataset');
        }

        // Initialize courses collection (only if empty)
        const courseCount = await db.collection('courses').countDocuments();
        if (courseCount === 0) {
            const defaultCourses = [
                { name: 'Riyadh Golf Club', drivingMod: 0.3, ironsMod: 0.3, puttingMod: 0.2, mentalMod: 0.2 },
                { name: 'Trump National Doral', drivingMod: 0.4, ironsMod: 0.2, puttingMod: 0.2, mentalMod: 0.2 },
                { name: 'Real Club Valderrama', drivingMod: 0.2, ironsMod: 0.4, puttingMod: 0.2, mentalMod: 0.2 },
                { name: 'Jack Nicklaus Golf Club Korea', drivingMod: 0.3, ironsMod: 0.2, puttingMod: 0.3, mentalMod: 0.2 }
            ];
            await db.collection('courses').insertMany(defaultCourses);
            console.log('Initialized courses collection');
        }

        // Initialize weatherConditions collection (only if empty)
        const weatherCount = await db.collection('weatherConditions').countDocuments();
        if (weatherCount === 0) {
            const defaultWeatherConditions = [
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
            await db.collection('weatherConditions').insertMany(defaultWeatherConditions);
            console.log('Initialized weatherConditions collection');
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

connectDB();

require('./routes/auth')(app);
require('./routes/player')(app);
require('./routes/tournament')(app);
require('./routes/shop')(app);
require('./routes/training')(app);
require('./routes/level')(app);

app.get('/api', (req, res) => res.json({ status: 'API is live' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;