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
            addAlert(
                `${stat.charAt(0).toUpperCase() + stat.slice(1)} increased by +${increase}!`,
                'success'
            );
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
                <>
                    <div className="training-stats-grid">
                        <div className="training-card">
                            <i className="fas fa-golf-ball training-icon"></i>
                            <h4>Driving</h4>
                            <p>{player.stats.driving}</p>
                        </div>
                        <div className="training-card">
                            <i className="fas fa-flag training-icon"></i>
                            <h4>Irons</h4>
                            <p>{player.stats.irons}</p>
                        </div>
                        <div className="training-card">
                            <i className="fas fa-golf-ball training-icon"></i>
                            <h4>Putting</h4>
                            <p>{player.stats.putting}</p>
                        </div>
                        <div className="training-card">
                            <i className="fas fa-brain training-icon"></i>
                            <h4>Mental</h4>
                            <p>{player.stats.mental}</p>
                        </div>
                    </div>
                    <div className="training-actions-grid">
                        <button onClick={() => train('driving')}>
                            <i className="fas fa-golf-ball"></i> Train Driving
                        </button>
                        <button onClick={() => train('irons')}>
                            <i className="fas fa-flag"></i> Train Irons
                        </button>
                        <button onClick={() => train('putting')}>
                            <i className="fas fa-golf-ball"></i> Train Putting
                        </button>
                        <button onClick={() => train('mental')}>
                            <i className="fas fa-brain"></i> Train Mental
                        </button>
                    </div>
                </>
            ) : (
                <div className="loading">Loading player stats...</div>
            )}
        </div>
    );
};

export default Training;
