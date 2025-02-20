import React, { useEffect } from 'react';
import axios from 'axios';

const Home = ({ player, setPlayer, addAlert }) => {
    const sell = (item) => {
        axios.post(`${process.env.REACT_APP_API_URL}/sell`, { item }, { // Dynamic URL
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setPlayer(res.data);
                const refund = Math.floor(loadItems()[item]?.cost * 0.75 || 0);
                addAlert(`Sold ${item} for $${refund.toLocaleString()}!`, 'success');
            })
            .catch(err => {
                console.error('Sell failed:', err.response?.data || err.message);
                addAlert('Failed to sell item.', 'error');
            });
    };

    const loadItems = () => JSON.parse(localStorage.getItem('items') || '{}');
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/items`, { // Dynamic URL
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res =>
                localStorage.setItem('items', JSON.stringify(Object.fromEntries(res.data.map(i => [i.name, i]))))
            )
            .catch(err => console.error('Failed to fetch items:', err.response?.data || err.message));

        if (player && player.milestones) {
            player.milestones.forEach(m => {
                if (m.progress >= m.target && !m.completed) {
                    m.completed = true;
                    const rewardText = m.reward.cash ? `$${m.reward.cash}` : `${m.reward.xp} XP`;
                    addAlert(`Milestone completed: ${m.name}! Reward: ${rewardText}`, 'success');
                }
            });
        }
    }, [player, addAlert]);

    const getXpForLevel = (level) => level * 100;
    const canLevelUp = player.xp >= getXpForLevel(player.level + 1);

    const handleLevelUp = (stat) => {
        axios.post(`${process.env.REACT_APP_API_URL}/level-up`, { stat }, { // Dynamic URL
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setPlayer(res.data);
                addAlert(`Leveled up to ${res.data.level}! ${stat.charAt(0).toUpperCase() + stat.slice(1)} +2`, 'success');
            })
            .catch(err => {
                console.error('Level-up failed:', err.response?.data || err.message);
                addAlert('Level-up failed.', 'error');
            });
    };

    if (!player) return <div>Loading profile...</div>;

    return (
        <div className="home">
            <h2>{player.name}</h2>
            <div className="stats-grid">
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
            </div>
            <p>
                Cash: ${player.cash} | Earnings: ${player.earnings} | Week: {player.week} |
                Level: {player.level} | XP: {player.xp}/{getXpForLevel(player.level + 1)}
            </p>
            <div className="xp-bar">
                <div
                    className="xp-progress"
                    style={{ width: `${(player.xp / getXpForLevel(player.level + 1)) * 100}%` }}
                ></div>
            </div>
            {canLevelUp && (
                <div className="level-up">
                    <h4>Level Up! Choose a Stat (+2):</h4>
                    <div className="button-group">
                        <button onClick={() => handleLevelUp('driving')}>Driving</button>
                        <button onClick={() => handleLevelUp('irons')}>Irons</button>
                        <button onClick={() => handleLevelUp('putting')}>Putting</button>
                        <button onClick={() => handleLevelUp('mental')}>Mental</button>
                    </div>
                </div>
            )}
            <h3>Equipment</h3>
            {player.equipment && player.equipment.length > 0 ? (
                <ul className="equipment-list">
                    {player.equipment.map(item => (
                        <li key={item}>
                            <i className="fas fa-box"></i> {item}
                            <button className="sell-btn" onClick={() => sell(item)}>
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
                {player.milestones ? (
                    player.milestones.map(milestone => (
                        <div key={milestone.id} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
                            <span>{milestone.name}: {milestone.progress}/{milestone.target}</span>
                            <span className="reward">Reward: {milestone.reward.cash ? `$${milestone.reward.cash}` : `${milestone.reward.xp} XP`}</span>
                            {milestone.completed && <span className="completed-badge">Completed</span>}
                        </div>
                    ))
                ) : (
                    <p>Loading milestones...</p>
                )}
            </div>
        </div>
    );
};

export default Home;