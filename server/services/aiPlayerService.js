// server/services/aiPlayerService.js
const seedAiPlayers = async (db) => {
    const aiPlayerCount = await db.collection('aiPlayers').countDocuments();
    if (aiPlayerCount === 0) {
        const defaultAiPlayers = [
            { name: 'Scottie Scheffler', driving: 90, irons: 85, putting: 80, mental: 85, wins: 0, points: 0 },
            { name: 'Rory McIlroy', driving: 95, irons: 80, putting: 75, mental: 90, wins: 0, points: 0 },
            { name: 'Jon Rahm', driving: 85, irons: 90, putting: 80, mental: 85, wins: 0, points: 0 },
            { name: 'Brooks Koepka', driving: 90, irons: 85, putting: 75, mental: 90, wins: 0, points: 0 },
            { name: 'Jordan Spieth', driving: 80, irons: 90, putting: 85, mental: 80, wins: 0, points: 0 },
            { name: 'Justin Thomas', driving: 85, irons: 85, putting: 80, mental: 85, wins: 0, points: 0 },
            { name: 'Xander Schauffele', driving: 85, irons: 85, putting: 85, mental: 80, wins: 0, points: 0 },
            { name: 'Patrick Cantlay', driving: 80, irons: 90, putting: 85, mental: 85, wins: 0, points: 0 },
            { name: 'Collin Morikawa', driving: 80, irons: 95, putting: 80, mental: 85, wins: 0, points: 0 },
            { name: 'Viktor Hovland', driving: 85, irons: 85, putting: 80, mental: 85, wins: 0, points: 0 }
        ];
        await db.collection('aiPlayers').insertMany(defaultAiPlayers);
        console.log('Initialized aiPlayers collection with stats');
    } else {
        console.log('AiPlayers collection already seeded');
    }
};

module.exports = { seedAiPlayers };
