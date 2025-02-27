// server/controllers/playerController.js
const { loadPlayer, savePlayer, defaultPlayer, checkMilestones } = require('../utils/utils');


exports.getPlayer = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { userId } = req;
        const player = await loadPlayer(db, userId);
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        // Build a response ensuring defaults
        const response = {
            name: player.name || 'Rookie',
            cash: player.cash || 50000,
            level: player.level || 1,
            stats: player.stats || { driving: 60, irons: 50, putting: 45, mental: 55 },
            equipment: player.equipment || [],
            week: player.week || 1,
            earnings: player.earnings || 0,
            wins: player.wins || 0,
            xp: player.xp || 0,
            itemsBought: player.itemsBought || 0,
            tournamentsPlayed: player.tournamentsPlayed || 0,
            itemsSold: player.itemsSold || 0,
            cashSpent: player.cashSpent || 0,
            userId: player.userId,
            _id: player._id,
        };

        // Fetch player milestones
        const playerMilestones = await db.collection('playerMilestones').find({ userId }).toArray();
        const milestones = await db.collection('milestones').find({
            _id: { $in: playerMilestones.map((pm) => pm.milestoneId) },
        }).toArray();

        response.milestones = playerMilestones.map((pm) => {
            const milestone = milestones.find((m) => m._id === pm.milestoneId);
            return {
                id: pm._id,
                name: milestone.name,
                progress: pm.progress,
                target: milestone.target,
                completed: pm.completed,
                reward: milestone.reward,
            };
        });

        res.json(response);
    } catch (err) {
        console.error('Error in GET /player:', err.message);
        res.status(500).json({ error: 'Failed to load player' });
    }
};

exports.updateName = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { userId } = req;
        const player = await loadPlayer(db, userId);
        const { name } = req.body;
        if (!name || typeof name !== 'string' || name.trim().length < 1) {
            return res.status(400).json({ error: 'Invalid name' });
        }
        player.name = name.trim();
        await savePlayer(db, player);
        res.json(player);
    } catch (err) {
        console.error('Error in /update-name:', err.message, err.stack);
        res.status(500).json({ error: 'Update name failed' });
    }
};

exports.resetPlayer = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { userId } = req;
        const resetPlayerData = { ...defaultPlayer, userId };
        await savePlayer(db, resetPlayerData);
        res.json(resetPlayerData);
    } catch (err) {
        console.error('Error in /reset:', err.message, err.stack);
        res.status(500).json({ error: 'Reset failed' });
    }
};
