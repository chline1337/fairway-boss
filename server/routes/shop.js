const { loadPlayer, savePlayer, loadItems, checkMilestones } = require('./utils');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // Match auth.js

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = (app) => {
    app.get('/items', (req, res) => {
        try {
            console.log('Fetching items...');
            const items = loadItems();
            console.log('Items loaded:', Object.keys(items).length, 'items');
            const itemList = Object.keys(items).map(name => ({
                name,
                cost: items[name].cost,
                boost: items[name].stats
                    ? Object.entries(items[name].stats).map(([stat, val]) => `${stat} +${val}`).join(', ')
                    : `${items[name].stat} +${items[name].boost}`,
                category: items[name].category
            }));
            res.json(itemList);
        } catch (err) {
            console.error('Error in GET /items:', err.message, err.stack);
            res.status(500).json({ error: 'Failed to load items' });
        }
    });

    app.post('/buy', authMiddleware, async (req, res) => {
        try {
            const player = await loadPlayer(req.userId);
            const items = loadItems();
            const { item } = req.body;
            console.log('Buying item:', item);
            const itemData = items[item];

            if (!itemData) {
                console.error('Item not found in items.json:', item);
                return res.status(400).json({ error: 'Invalid item' });
            }

            console.log('Item data:', itemData);
            console.log('Current equipment:', player.equipment);
            const hasCategory = player.equipment.some(eq => {
                const eqData = items[eq];
                return eqData && eqData.category === itemData.category;
            });
            console.log('Has category?', hasCategory, 'Cash:', player.cash, 'Cost:', itemData.cost);

            if (player.cash >= itemData.cost && !hasCategory) {
                player.cash -= itemData.cost;
                player.cashSpent = (player.cashSpent || 0) + itemData.cost;
                player.itemsBought = (player.itemsBought || 0) + 1;
                if (itemData.stat) {
                    player.stats[itemData.stat] += itemData.boost;
                } else if (itemData.stats) {
                    Object.keys(itemData.stats).forEach(stat => {
                        player.stats[stat] += itemData.stats[stat];
                    });
                }
                player.equipment.push(item);
                checkMilestones(player);
                await savePlayer(player);
                console.log('Purchase successful:', player);
            } else {
                console.log('Purchase blocked: Insufficient cash or category owned');
            }
            res.json(player);
        } catch (err) {
            console.error('Error in /buy:', err.message, err.stack);
            res.status(500).json({ error: 'Purchase failed' });
        }
    });

    app.post('/sell', authMiddleware, async (req, res) => {
        try {
            const player = await loadPlayer(req.userId);
            const items = loadItems();
            const { item } = req.body;
            console.log('Selling item:', item);

            const itemIndex = player.equipment.indexOf(item);
            if (itemIndex === -1) {
                console.error('Item not found in equipment:', item);
                return res.status(400).json({ error: 'Item not in equipment' });
            }

            const itemData = items[item];
            if (itemData) {
                const refund = Math.floor(itemData.cost * 0.75);
                player.cash += refund;
                player.itemsSold = (player.itemsSold || 0) + 1;
                if (itemData.stat) {
                    player.stats[itemData.stat] -= itemData.boost;
                } else if (itemData.stats) {
                    Object.keys(itemData.stats).forEach(stat => {
                        player.stats[stat] -= itemData.stats[stat];
                    });
                }
                console.log('Sell successful:', player, 'Refund:', refund);
            } else {
                console.log('Item not in items.json, removing without refund:', item);
            }

            player.equipment.splice(itemIndex, 1);
            checkMilestones(player);
            await savePlayer(player);

            res.json(player);
        } catch (err) {
            console.error('Error in /sell:', err.message, err.stack);
            res.status(500).json({ error: 'Sell failed' });
        }
    });
};