const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../data', 'fairwayboss.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT
      )`, (err) => {
                if (err) console.error('Error creating users table:', err.message);
                else console.log('Users table ready');
            });

            db.run(`CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        stats TEXT NOT NULL,
        cash INTEGER DEFAULT 50000,
        equipment TEXT DEFAULT '[]',
        week INTEGER DEFAULT 1,
        earnings INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        milestones TEXT NOT NULL,
        itemsBought INTEGER DEFAULT 0,
        tournamentsPlayed INTEGER DEFAULT 0,
        itemsSold INTEGER DEFAULT 0,
        cashSpent INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`, (err) => {
                if (err) console.error('Error creating players table:', err.message);
                else console.log('Players table ready');
            });
        });
    }
});

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
    milestones: [
        { id: 'wins_5', name: 'Win 5 Tournaments', target: 5, progress: 0, reward: { cash: 10000 }, completed: false },
        { id: 'level_10', name: 'Reach Level 10', target: 10, progress: 1, reward: { xp: 500 }, completed: false },
        { id: 'earnings_100k', name: 'Earn $100,000', target: 100000, progress: 0, reward: { cash: 20000 }, completed: false },
        { id: 'train_50', name: 'Train 50 Times', target: 50, progress: 0, reward: { xp: 300 }, completed: false },
        { id: 'items_10', name: 'Buy 10 Items', target: 10, progress: 0, reward: { cash: 15000 }, completed: false },
        { id: 'tournaments_20', name: 'Play 20 Tournaments', target: 20, progress: 0, reward: { xp: 1000 }, completed: false },
        { id: 'sell_5', name: 'Sell 5 Items', target: 5, progress: 0, reward: { cash: 5000 }, completed: false },
        { id: 'cash_50k', name: 'Spend $50,000', target: 50000, progress: 0, reward: { xp: 200 }, completed: false },
        { id: 'wins_10', name: 'Win 10 Tournaments', target: 10, progress: 0, reward: { cash: 25000 }, completed: false },
        { id: 'level_20', name: 'Reach Level 20', target: 20, progress: 1, reward: { xp: 1000 }, completed: false }
    ],
    itemsBought: 0,
    tournamentsPlayed: 0,
    itemsSold: 0,
    cashSpent: 0
};

const loadPlayer = (userId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM players WHERE userId = ?', [userId], (err, row) => {
            if (err) return reject(err);
            if (!row) {
                const newPlayer = { ...defaultPlayer, userId };
                db.run(`INSERT INTO players (userId, name, stats, cash, equipment, week, earnings, wins, xp, level, milestones, itemsBought, tournamentsPlayed, itemsSold, cashSpent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [newPlayer.userId, newPlayer.name, JSON.stringify(newPlayer.stats), newPlayer.cash, JSON.stringify(newPlayer.equipment), newPlayer.week,
                    newPlayer.earnings, newPlayer.wins, newPlayer.xp, newPlayer.level, JSON.stringify(newPlayer.milestones),
                    newPlayer.itemsBought, newPlayer.tournamentsPlayed, newPlayer.itemsSold, newPlayer.cashSpent],
                    function (err) {
                        if (err) return reject(err);
                        console.log('New player inserted for userId:', userId, 'with id:', this.lastID);
                        resolve({ id: this.lastID, ...newPlayer });
                    });
            } else {
                resolve({ ...row, stats: JSON.parse(row.stats), equipment: JSON.parse(row.equipment), milestones: JSON.parse(row.milestones) });
            }
        });
    });
};

const savePlayer = (player) => {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE players SET name = ?, stats = ?, cash = ?, equipment = ?, week = ?, earnings = ?, wins = ?, xp = ?, level = ?, milestones = ?, 
            itemsBought = ?, tournamentsPlayed = ?, itemsSold = ?, cashSpent = ? WHERE id = ?`,
            [player.name, JSON.stringify(player.stats), player.cash, JSON.stringify(player.equipment), player.week, player.earnings, player.wins, player.xp,
            player.level, JSON.stringify(player.milestones), player.itemsBought, player.tournamentsPlayed, player.itemsSold, player.cashSpent, player.id],
            (err) => {
                if (err) {
                    console.error('Error saving player:', err.message);
                    reject(err);
                } else {
                    resolve(player);
                }
            });
    });
};

const loadItems = () => {
    try {
        console.log('Loading items from:', path.join(__dirname, '../data', 'items.json'));
        const data = fs.readFileSync(path.join(__dirname, '../data', 'items.json'), 'utf8');
        if (!data.trim()) throw new Error('items.json is empty');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error loading items:', err.message);
        throw err;
    }
};

const getXpForLevel = (level) => level * 100;

const checkMilestones = (player) => {
    console.log('Checking milestones for player:', player.name);
    if (!player.milestones) {
        console.error('No milestones found in player data');
        player.milestones = defaultPlayer.milestones;
    }
    player.milestones.forEach(m => {
        if (!m.completed) {
            switch (m.id) {
                case 'wins_5':
                case 'wins_10':
                    m.progress = player.wins;
                    break;
                case 'level_10':
                case 'level_20':
                    m.progress = player.level;
                    break;
                case 'earnings_100k':
                    m.progress = player.earnings;
                    break;
                case 'train_50':
                    m.progress = (m.progress || 0);
                    break;
                case 'items_10':
                    m.progress = player.itemsBought || 0;
                    break;
                case 'tournaments_20':
                    m.progress = player.tournamentsPlayed || 0;
                    break;
                case 'sell_5':
                    m.progress = player.itemsSold || 0;
                    break;
                case 'cash_50k':
                    m.progress = player.cashSpent || 0;
                    break;
            }
            if (m.progress >= m.target) {
                m.completed = true;
                if (m.reward.cash) player.cash += m.reward.cash;
                if (m.reward.xp) player.xp += m.reward.xp;
                console.log(`Milestone completed: ${m.name}`);
            }
        }
    });
};

module.exports = { loadPlayer, savePlayer, loadItems, getXpForLevel, defaultPlayer, checkMilestones, db };