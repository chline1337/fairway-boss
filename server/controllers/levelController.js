// server/controllers/levelController.js
const { loadPlayer, savePlayer, getXpForLevel, checkMilestones } = require('../utils/utils');

exports.levelUp = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { stat } = req.body;

        if (!['driving', 'irons', 'putting', 'mental'].includes(stat)) {
            return res.status(400).json({ error: 'Invalid stat' });
        }

        const player = await loadPlayer(db, req.userId);
        const nextLevelXp = getXpForLevel(player.level + 1);

        // If player has enough XP, level up
        if (player.xp >= nextLevelXp) {
            player.level += 1;
            player.stats[stat] += 2; // +2 to the chosen stat
            player.xp -= nextLevelXp;

            // Check milestones in milestoneService
            await checkMilestones(db, player);

            // Save updated player to DB
            await savePlayer(db, player);

            console.log(`Leveled up to ${player.level}, boosted ${stat}`);
        }

        res.json(player);
    } catch (err) {
        console.error('Error in /level-up:', err.message);
        res.status(500).json({ error: 'Level-up failed' });
    }
};
