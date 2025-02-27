// server/services/courseService.js
const seedCourses = async (db) => {
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
    } else {
        console.log('Courses collection already seeded');
    }
};

module.exports = { seedCourses };
