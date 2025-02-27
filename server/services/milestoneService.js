// server/services/milestoneService.js
const seedMilestones = async (db) => {
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
    } else {
        console.log('Milestones collection already seeded');
    }
};

module.exports = { seedMilestones };
