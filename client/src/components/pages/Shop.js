// src/components/Shop.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';


const Shop = ({ player, setPlayer, addAlert }) => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        api.get('/items')
            .then(res => setItems(res.data))
            .catch(err => {
                console.error('Failed to load items:', err.response?.data || err.message);
                if (err.response?.status === 401) {
                    addAlert('Session expired. Please log in again.', 'error');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload(); // Trigger App.js to show Login
                } else {
                    addAlert('Failed to load shop items.', 'error');
                }
            });
    }, [addAlert]);

    const buy = async (item) => {
        console.log('Sending buy request for:', item);
        try {
            const res = await api.post('/buy', { item });
            setPlayer(res.data);
            const cost = items.find(i => i.name === item)?.cost || 0;
            addAlert(`Purchased ${item} for $${cost.toLocaleString()}!`, 'success');
        } catch (err) {
            console.error('Purchase failed:', err.response?.data || err.message);
            if (err.response?.status === 401) {
                addAlert('Session expired. Please log in again.', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.reload();
            } else {
                addAlert(err.response?.data?.error || 'Purchase failed: Not enough cash or category owned.', 'error');
            }
        }
    };

    const getIcon = (category) => {
        switch (category) {
            case 'driver': return 'fas fa-golf-ball';
            case 'fairway': return 'fas fa-tree';
            case 'irons': return 'fas fa-flag';
            case 'putter': return 'fas fa-golf-ball';
            case 'grips': return 'fas fa-hand-paper';
            case 'balls': return 'fas fa-circle';
            case 'bag': return 'fas fa-suitcase';
            case 'shoes': return 'fas fa-shoe-prints';
            case 'watch': return 'fas fa-clock';
            case 'rangefinder': return 'fas fa-binoculars';
            case 'monitor': return 'fas fa-desktop';
            case 'trainer': return 'fas fa-dumbbell';
            case 'mirror': return 'fas fa-mirror'; // If unavailable, consider using 'fas fa-square'
            case 'coaching': return 'fas fa-chalkboard-teacher';
            case 'raingear': return 'fas fa-umbrella';
            case 'practice': return 'fas fa-boxes';
            case 'fitness': return 'fas fa-running';
            default: return 'fas fa-question';
        }
    };

    const getCategoryName = (category) => {
        switch (category) {
            case 'driver': return 'Drivers';
            case 'fairway': return 'Fairway Woods';
            case 'irons': return 'Irons';
            case 'putter': return 'Putters';
            case 'grips': return 'Grips';
            case 'balls': return 'Balls';
            case 'bag': return 'Bags';
            case 'shoes': return 'Shoes';
            case 'watch': return 'Watches';
            case 'rangefinder': return 'Rangefinders';
            case 'monitor': return 'Monitors';
            case 'trainer': return 'Trainers';
            case 'mirror': return 'Mirrors';
            case 'coaching': return 'Coaching';
            case 'raingear': return 'Rain Gear';
            case 'practice': return 'Practice';
            case 'fitness': return 'Fitness';
            default: return category.charAt(0).toUpperCase() + category.slice(1);
        }
    };

    if (!items.length) return <div className="loading">Loading shop...</div>;

    const categories = [...new Set(items.map(item => item.category))].sort();
    const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

    return (
        <div className="shop">
            <h3>Shop</h3>
            <div className="shop-filter">
                <label htmlFor="category-filter">Filter by Category: </label>
                <select
                    id="category-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {getCategoryName(cat)}
                        </option>
                    ))}
                </select>
            </div>
            {categories.map(category => {
                const categoryItems = filteredItems.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;
                return (
                    <div key={category} className="category-row">
                        <h4>{getCategoryName(category)}</h4>
                        <div className="shop-grid">
                            {categoryItems.map(item => {
                                const ownedCategory = player.equipment.some(eq =>
                                    items.find(i => i.name === eq)?.category === item.category
                                );
                                return (
                                    <div key={item.name} className="shop-item">
                                        <i className={getIcon(item.category)}></i>
                                        <span>{item.name}</span>
                                        <button
                                            onClick={() => buy(item.name)}
                                            disabled={player.cash < item.cost || ownedCategory}
                                        >
                                            Buy (${item.cost.toLocaleString()}) - {item.boost}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Shop;
