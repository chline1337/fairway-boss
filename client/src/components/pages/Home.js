// src/components/Home.js
import React, { useEffect } from 'react';
import api from '../../services/api';

const Home = ({ player, setPlayer, addAlert }) => {
    const loadItems = () => JSON.parse(localStorage.getItem('items') || '{}');

    const sell = async (item) => {
        if (!player || typeof player.cash !== 'number') {
            addAlert('Player data not loaded. Please try again.', 'error');
            return;
        }

        try {
            const res = await api.post('/sell', { item });
            setPlayer(res.data);
            const refund = Math.floor(loadItems()[item]?.cost * 0.75 || 0);
            addAlert(`Sold ${item} for $${refund.toLocaleString()}!`, 'success');
        } catch (err) {
            console.error('Sell failed:', err.response?.data || err.message);
            if (err.response?.status === 401) {
                addAlert('Session expired. Please log in again.', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.reload();
            } else {
                addAlert('Failed to sell item.', 'error');
            }
        }
    };

    useEffect(() => {
        // Fetch items from the correct endpoint (adjusted from '/api/items' to '/items')
        api.get('/items')
            .then(res => {
                if (Array.isArray(res.data)) {
                    localStorage.setItem(
                        'items',
                        JSON.stringify(Object.fromEntries(res.data.map(i => [i.name, i])))
                    );
                } else {
                    console.warn('Unexpected items format:', res.data);
                    localStorage.setItem('items', JSON.stringify({})); // Default to empty object
                }
            })
            .catch(err => {
                console.error('Failed to fetch items:', err.response?.data || err.message);
                if (err.response?.status === 401) {
                    addAlert('Session expired. Please log in again.', 'error');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload();
                }
            });

        // Fetch player data with milestones if not already present
        if (!player?.milestones) {
            api.get('/api/player')
                .then(res => {
                    setPlayer(res.data);
                    console.log('Player data with milestones:', res.data);
                })
                .catch(err => {
                    console.error('Failed to fetch player:', err.response?.data || err.message);
                    if (err.response?.status === 401) {
                        addAlert('Session expired. Please log in again.', 'error');
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        window.location.reload();
                    }
                });
        }

        // Check milestones for completion alerts
        if (player && player.milestones) {
            player.milestones.forEach(m => {
                if (m.progress >= m.target && !m.completed) {
                    m.completed = true;
                    const rewardText = m.reward.cash
                        ? `$${m.reward.cash.toLocaleString()}`
                        : `${m.reward.xp} XP`;
                    addAlert(`Milestone completed: ${m.name}! Reward: ${rewardText}`, 'success');
                }
            });
        }
    }, [player, setPlayer, addAlert]);

    const getXpForLevel = (level) => (level || 1) * 100; // Default to level 1 if undefined
    const canLevelUp = player && typeof player.xp === 'number' && player.xp >= getXpForLevel(player.level);

    const handleLevelUp = async (stat) => {
        if (!player || !player.stats || typeof player.stats[stat] !== 'number') {
            addAlert('Player stats not loaded. Please try again.', 'error');
            return;
        }

        try {
            const res = await api.post('/level-up', { stat });
            setPlayer(res.data);
            addAlert(`Leveled up to ${res.data.level}! ${stat.charAt(0).toUpperCase() + stat.slice(1)} +2`, 'success');
        } catch (err) {
            console.error('Level-up failed:', err.response?.data || err.message);
            if (err.response?.status === 401) {
                addAlert('Session expired. Please log in again.', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.reload();
            } else {
                addAlert('Level-up failed.', 'error');
            }
        }
    };

    if (!player) return <div className="loading">Loading profile...</div>;

    return (
        <div className="home">
            <h2>{player.name || 'Rookie'}</h2>
            <div className="stats-grid">
                {player && player.stats ? (
                    <>
                        <div className="stat-item">
                            <i className="fas fa-golf-ball"></i>
                            <span>Driving:</span> <span>{player.stats.driving}</span>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-flag"></i>
                            <span>Irons:</span> <span>{player.stats.irons}</span>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-golf-ball"></i>
                            <span>Putting:</span> <span>{player.stats.putting}</span>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-brain"></i>
                            <span>Mental:</span> <span>{player.stats.mental}</span>
                        </div>
                    </>
                ) : (
                    <div className="loading">Loading stats...</div>
                )}
            </div>
            <p>
                Cash: {typeof player.cash === 'number' ? `$${player.cash.toLocaleString()}` : '$0'} |
                Earnings: {typeof player.earnings === 'number' ? `$${player.earnings.toLocaleString()}` : '$0'} |
                Week: {player.week || 1} |
                Level: {player.level || 1} |
                XP: {typeof player.xp === 'number' ? `${player.xp}/${getXpForLevel(player.level)}` : '0/100'}
            </p>
            <div className="xp-bar">
                <div
                    className="xp-progress"
                    style={{
                        width: `${typeof player.xp === 'number' && typeof player.level === 'number'
                            ? (player.xp / getXpForLevel(player.level + 1)) * 100
                            : 0
                            }%`
                    }}
                ></div>
            </div>
            {canLevelUp && (
                <div className="level-up">
                    <h4>Level Up! Choose a Stat (+2):</h4>
                    <div className="button-group">
                        <button onClick={() => handleLevelUp('driving')} disabled={!player || !player.stats}>
                            Driving
                        </button>
                        <button onClick={() => handleLevelUp('irons')} disabled={!player || !player.stats}>
                            Irons
                        </button>
                        <button onClick={() => handleLevelUp('putting')} disabled={!player || !player.stats}>
                            Putting
                        </button>
                        <button onClick={() => handleLevelUp('mental')} disabled={!player || !player.stats}>
                            Mental
                        </button>
                    </div>
                </div>
            )}
            <h3>Equipment</h3>
            {player && player.equipment && player.equipment.length > 0 ? (
                <ul className="equipment-list">
                    {player.equipment.map(item => (
                        <li key={item}>
                            <i className="fas fa-box"></i> {item}
                            <button className="sell-btn" onClick={() => sell(item)} disabled={!player}>
                                Sell (75%)
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No equipment owned yet.</p>
            )}
            <h3>Career Milestones</h3>
            <div className="milestones-grid">
                {player && player.milestones && player.milestones.length > 0 ? (
                    player.milestones.map(milestone => (
                        <div key={milestone.id} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
                            <span>
                                {milestone.name}: {milestone.progress}/{milestone.target}
                            </span>
                            <span className="reward">
                                Reward:{' '}
                                {milestone.reward.cash
                                    ? `$${milestone.reward.cash.toLocaleString()}`
                                    : `${milestone.reward.xp} XP`}
                            </span>
                            {milestone.completed && <span className="completed-badge">Completed</span>}
                        </div>
                    ))
                ) : (
                    <p>No milestones available yet.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
