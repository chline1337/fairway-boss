// server/controllers/shopController.js
const { loadPlayer, savePlayer, loadItems, checkMilestones } = require('../utils/utils');

exports.getItems = async (req, res) => {
    try {
        const db = req.app.locals.db;
        console.log('Fetching items...');
        const itemsObj = await loadItems(db);
        console.log('Items loaded:', Object.keys(itemsObj).length, 'items');
        const itemList = Object.keys(itemsObj).map((name) => ({
            name,
            cost: itemsObj[name].cost,
            boost: itemsObj[name].stats
                ? Object.entries(itemsObj[name].stats)
                    .map(([stat, val]) => `${stat} +${val}`)
                    .join(', ')
                : `${itemsObj[name].stat} +${itemsObj[name].boost}`,
            category: itemsObj[name].category,
        }));
        res.json(itemList);
    } catch (err) {
        console.error('Error in GET /items:', err.message, err.stack);
        res.status(500).json({ error: 'Failed to load items' });
    }
};

exports.buyItem = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const player = await loadPlayer(db, req.userId);
        const items = await loadItems(db);
        const { item } = req.body;

        console.log('Buying item:', item);
        const itemData = items[item];

        if (!itemData) {
            console.error('Item not found in items:', item);
            return res.status(400).json({ error: 'Invalid item' });
        }

        console.log('Item data:', itemData);
        console.log('Current equipment:', player.equipment);

        const hasCategory = player.equipment.some((eq) => {
            const eqData = items[eq];
            return eqData && eqData.category === itemData.category;
        });
        console.log(
            'Has category?',
            hasCategory,
            'Cash:',
            player.cash,
            'Cost:',
            itemData.cost
        );

        if (player.cash >= itemData.cost && !hasCategory) {
            player.cash -= itemData.cost;
            player.cashSpent = (player.cashSpent || 0) + itemData.cost;
            player.itemsBought = (player.itemsBought || 0) + 1;
            if (itemData.stat) {
                player.stats[itemData.stat] += itemData.boost;
            } else if (itemData.stats) {
                Object.keys(itemData.stats).forEach((stat) => {
                    player.stats[stat] += itemData.stats[stat];
                });
            }
            player.equipment.push(item);
            await checkMilestones(db, player);
            await savePlayer(db, player);
            console.log('Purchase successful:', player);
        } else {
            console.log('Purchase blocked: Insufficient cash or category owned');
        }
        res.json(player);
    } catch (err) {
        console.error('Error in /buy:', err.message, err.stack);
        res.status(500).json({ error: 'Purchase failed' });
    }
};

exports.sellItem = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const player = await loadPlayer(db, req.userId);
        const items = await loadItems(db);
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
                Object.keys(itemData.stats).forEach((stat) => {
                    player.stats[stat] -= itemData.stats[stat];
                });
            }
            console.log('Sell successful:', player, 'Refund:', refund);
        } else {
            console.log('Item not in items, removing without refund:', item);
        }

        player.equipment.splice(itemIndex, 1);
        await checkMilestones(db, player);
        await savePlayer(db, player);

        res.json(player);
    } catch (err) {
        console.error('Error in /sell:', err.message, err.stack);
        res.status(500).json({ error: 'Sell failed' });
    }
};
