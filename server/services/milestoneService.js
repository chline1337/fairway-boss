// server/services/milestoneService.js
module.exports.checkMilestones = async (db, player) => {
    try {
        console.log('Checking milestones for player:', player.name);
        const playerMilestones = await db
            .collection('playerMilestones')
            .find({ userId: player.userId })
            .toArray();
        console.log('Player milestones fetched:', playerMilestones.length);
        if (playerMilestones.length === 0) {
            console.warn('No player milestones found for userId:', player.userId);
            return; // Early return if no milestones
        }
        const milestones = await db
            .collection('milestones')
            .find({
                _id: { $in: playerMilestones.map((pm) => pm.milestoneId) }
            })
            .toArray();

        for (const pm of playerMilestones) {
            if (!pm.completed) {
                const milestone = milestones.find((m) => m._id === pm.milestoneId);
                if (!milestone) {
                    console.warn('Milestone not found for milestoneId:', pm.milestoneId);
                    continue;
                }

                let progress = pm.progress;
                switch (milestone._id) {
                    case 'wins_5':
                    case 'wins_10':
                        progress = player.wins;
                        break;
                    case 'level_10':
                    case 'level_20':
                        progress = player.level;
                        break;
                    case 'earnings_100k':
                        progress = player.earnings;
                        break;
                    case 'train_50':
                        progress = pm.progress;
                        break;
                    case 'items_10':
                        progress = player.itemsBought || 0;
                        break;
                    case 'tournaments_20':
                        progress = player.tournamentsPlayed || 0;
                        break;
                    case 'sell_5':
                        progress = player.itemsSold || 0;
                        break;
                    case 'cash_50k':
                        progress = player.cashSpent || 0;
                        break;
                }
                if (progress >= milestone.target) {
                    pm.completed = true;
                    if (milestone.reward.cash) player.cash += milestone.reward.cash;
                    if (milestone.reward.xp) player.xp += milestone.reward.xp;
                    console.log(`Milestone completed: ${milestone.name}`);
                }
                if (progress !== pm.progress) {
                    await db.collection('playerMilestones').updateOne(
                        { _id: pm._id },
                        { $set: { progress, completed: pm.completed } }
                    );
                    console.log(`Updated milestone ${milestone._id} progress to ${progress}`);
                }
            }
        }
    } catch (err) {
        console.error('Error checking milestones:', err.message);
        throw err;
    }
};
