// src/components/Training.js
import React from 'react';
import api from '../../services/api';


const Training = ({ player, setPlayer, addAlert }) => {
    const train = async (stat) => {
        if (!['driving', 'irons', 'putting', 'mental'].includes(stat)) {
            addAlert('Invalid stat selected.', 'error');
            return;
        }

        if (!player || !player.stats || typeof player.stats[stat] !== 'number') {
            addAlert('Player stats not loaded. Please try again.', 'error');
            return;
        }

        try {
            const res = await api.post('/train', { stat });
            if (!res.data || !res.data.stats || typeof res.data.stats[stat] !== 'number') {
                throw new Error('Invalid response from server');
            }
            const increase = res.data.stats[stat] - player.stats[stat];
            setPlayer(res.data);
            addAlert(`${stat.charAt(0).toUpperCase() + stat.slice(1)} increased by +${increase}!`, 'success');
        } catch (err) {
            console.error('Training failed:', err.response?.data || err.message);
            if (err.response?.status === 401) {
                addAlert('Session expired. Please log in again.', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.reload();
            } else {
                addAlert('Training failed.', 'error');
            }
        }
    };

    return (
        <div className="training">
            <h3>Training</h3>
            {player && player.stats ? (
                <div>
                    {/* Display stats and buttons */}
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
                    <div className="button-group">
                        <button onClick={() => train('driving')}>Train Driving</button>
                        <button onClick={() => train('irons')}>Train Irons</button>
                        <button onClick={() => train('putting')}>Train Putting</button>
                        <button onClick={() => train('mental')}>Train Mental</button>
                    </div>
                </div>
            ) : (
                <div className="loading">Loading player stats...</div>
            )}
        </div>
    );
};

export default Training;
