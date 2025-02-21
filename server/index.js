const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
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
                { name: 'Driver X1', cost: 10000, stat: 'driving', boost: 5, category: 'driver' },
                { name: 'Putter Pro', cost: 8000, stats: { putting: 4, mental: 2 }, category: 'putter' },
                // Add more items from your items.json here
            ];
            await db.collection('items').insertMany(defaultItems);
            console.log('Initialized items collection');
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