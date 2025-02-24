const fs = require('fs');
const path = require('path');

const defaultPlayer = {
    name: 'Rookie',
    stats: { driving: 60, irons: 50, putting: 45, mental: 55 },
    cash: 50000,
    equipment: [],
    week: 1,
    earnings: 0,
    wins: 0,
    xp: 0,
    level: 1,
    itemsBought: 0,
    tournamentsPlayed: 0,
    itemsSold: 0,
    cashSpent: 0
};

const loadPlayer = async (db, userId) => {
    if (!userId) throw new Error('No userId provided');
    try {
        let player = await db.collection('players').findOne({ userId });
        if (!player) {
            player = { ...defaultPlayer, userId };
            const result = await db.collection('players').insertOne(player);
            console.log('New player inserted for userId:', userId, 'with id:', result.insertedId);
            player._id = result.insertedId;

            const milestones = await db.collection('milestones').find().toArray();
            console.log('Milestones fetched for new player:', milestones.length);
            if (milestones.length === 0) {
                console.warn('No milestones found in database - player milestones will be empty');
            }
            const playerMilestones = milestones.map(m => ({
                userId,
                milestoneId: m._id,
                progress: m._id.includes('level') ? 1 : 0,
                completed: false
            }));
            if (playerMilestones.length > 0) {
                const insertResult = await db.collection('playerMilestones').insertMany(playerMilestones);
                console.log('Player milestones inserted:', insertResult.insertedIds);
            } else {
                console.log('No player milestones to insert - milestones collection empty');
            }
        }
        return player;
    } catch (err) {
        console.error('Error loading player:', err.message);
        throw err;
    }
};

const savePlayer = async (db, player) => {
    try {
        const { _id, ...playerData } = player;
        await db.collection('players').updateOne(
            { _id },
            { $set: playerData },
            { upsert: true }
        );
        return player;
    } catch (err) {
        console.error('Error saving player:', err.message);
        throw err;
    }
};

const loadItems = async (db) => {
    try {
        const items = await db.collection('items').find().toArray();
        return Object.fromEntries(items.map(item => [item.name, item]));
    } catch (err) {
        console.error('Error loading items:', err.message);
        throw err;
    }
};

const getXpForLevel = (level) => level * 100;

const checkMilestones = async (db, player) => {
    try {
        console.log('Checking milestones for player:', player.name);
        const playerMilestones = await db.collection('playerMilestones').find({ userId: player.userId }).toArray();
        console.log('Player milestones fetched:', playerMilestones.length);
        if (playerMilestones.length === 0) {
            console.warn('No player milestones found for userId:', player.userId);
            return; // Early return if no milestones
        }
        const milestones = await db.collection('milestones').find({
            _id: { $in: playerMilestones.map(pm => pm.milestoneId) }
        }).toArray();

        for (const pm of playerMilestones) {
            if (!pm.completed) {
                const milestone = milestones.find(m => m._id === pm.milestoneId);
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

module.exports = { loadPlayer, savePlayer, loadItems, getXpForLevel, checkMilestones };