const fs = require('fs');
const path = require('path');

/**
 * Default player object used for new players.
 */
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

/**
 * Returns the XP required for a given level.
 * @param {number} level 
 * @returns {number} XP threshold for that level.
 */
const getXpForLevel = (level) => level * 100;

module.exports = { defaultPlayer, getXpForLevel };
