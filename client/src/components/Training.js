import React from 'react';
import axios from 'axios';

const Training = ({ player, setPlayer, addAlert }) => {
    const train = (stat) => {
        axios.post('http://localhost:5000/train', { stat }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                const increase = res.data.stats[stat] - player.stats[stat];
                setPlayer(res.data);
                addAlert(`${stat.charAt(0).toUpperCase() + stat.slice(1)} increased by +${increase}!`, 'success');
            })
            .catch(err => {
                console.error('Training failed:', err.response?.data || err.message);
                addAlert('Training failed.', 'error');
            });
    };

    return (
        <div className="training">
            <h3>Training</h3>
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
    );
};

export default Training;