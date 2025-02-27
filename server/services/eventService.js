// server/services/eventService.js
const seedEvents = async (db) => {
    const eventCount = await db.collection('events').countDocuments();
    if (eventCount === 0) {
        const defaultEvents = [
            { name: 'Saudi International' },
            { name: 'LIV Golf Invitational' },
            { name: 'PGA Championship' },
            { name: 'Masters Tournament' },
            { name: 'Dubai Desert Classic' },
            { name: 'Players Championship' },
            { name: 'Genesis Invitational' },
            { name: 'Memorial Tournament' }
        ];
        await db.collection('events').insertMany(defaultEvents);
        console.log('Initialized events collection');
    } else {
        console.log('Events collection already seeded');
    }
};

module.exports = { seedEvents };
