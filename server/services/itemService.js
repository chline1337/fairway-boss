// server/services/itemService.js
const seedItems = async (db) => {
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
    } else {
        console.log('Items collection already seeded');
    }
};

module.exports = { seedItems };
