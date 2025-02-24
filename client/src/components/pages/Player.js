// src/components/pages/Player.js
import React, { useEffect, useRef } from 'react';
import api from '../../services/api';
import PlayerStats from '../player/PlayerStats';
import XPBar from '../player/XPBar';
import EquipmentList from '../player/EquipmentList';
import MilestonesList from '../player/MilestonesList';

const Player = ({ player, setPlayer, addAlert }) => {
    const loadItems = () => JSON.parse(localStorage.getItem('items') || '{}');
    const alertedMilestones = useRef(new Set());

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
        // Fetch items
        api.get('/items')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    localStorage.setItem(
                        'items',
                        JSON.stringify(Object.fromEntries(res.data.map(i => [i.name, i])))
                    );
                } else {
                    console.warn('Unexpected items format:', res.data);
                    localStorage.setItem('items', JSON.stringify({}));
                }
            })
            .catch((err) => {
                console.error('Failed to fetch items:', err.response?.data || err.message);
                if (err.response?.status === 401) {
                    addAlert('Session expired. Please log in again.', 'error');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload();
                }
            });

        if (!player?.milestones) {
            api.get('/api/player')
                .then((res) => {
                    setPlayer(res.data);
                    console.log('Player data with milestones:', res.data);
                })
                .catch((err) => {
                    console.error('Failed to fetch player:', err.response?.data || err.message);
                    if (err.response?.status === 401) {
                        addAlert('Session expired. Please log in again.', 'error');
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        window.location.reload();
                    }
                });
        }
    }, [player, setPlayer, addAlert]);

    // Check milestones once using a ref to avoid duplicate alerts.
    useEffect(() => {
        if (player && player.milestones) {
            let updated = false;
            const newMilestones = player.milestones.map(m => {
                if (m.progress >= m.target && !m.completed && !alertedMilestones.current.has(m.id)) {
                    alertedMilestones.current.add(m.id);
                    const rewardText = m.reward.cash
                        ? `$${m.reward.cash.toLocaleString()}`
                        : `${m.reward.xp} XP`;
                    addAlert(`Milestone completed: ${m.name}! Reward: ${rewardText}`, 'success');
                    updated = true;
                    return { ...m, completed: true };
                }
                return m;
            });
            if (updated) {
                setPlayer({ ...player, milestones: newMilestones });
            }
        }
    }, [player?.milestones, player, setPlayer, addAlert]);

    const getXpForLevel = (level) => (level || 1) * 100;
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
        <div className="player-profile">
            <h2>{player.name || 'Rookie'}</h2>
            <PlayerStats stats={player.stats} />
            <p>
                Cash: {typeof player.cash === 'number' ? `$${player.cash.toLocaleString()}` : '$0'} |
                Earnings: {typeof player.earnings === 'number' ? `$${player.earnings.toLocaleString()}` : '$0'} |
                Week: {player.week || 1} |
                Level: {player.level || 1} |
                XP: {typeof player.xp === 'number' ? `${player.xp}/${getXpForLevel(player.level)}` : '0/100'}
            </p>
            <XPBar xp={player.xp} level={player.level} getXpForLevel={getXpForLevel} />
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
            <EquipmentList equipment={player.equipment} sellItem={sell} />
            <h3>Career Milestones</h3>
            <MilestonesList milestones={player.milestones} />
        </div>
    );
};

export default Player;
