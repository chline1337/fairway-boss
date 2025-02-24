// src/components/player/PlayerStats.js
import React from 'react';

const PlayerStats = ({ stats }) => {
    return (
        <div className="stats-grid">
            <div className="stat-item">
                <i className="fas fa-golf-ball"></i>
                <span>Driving:</span> <span>{stats.driving}</span>
            </div>
            <div className="stat-item">
                <i className="fas fa-flag"></i>
                <span>Irons:</span> <span>{stats.irons}</span>
            </div>
            <div className="stat-item">
                <i className="fas fa-golf-ball"></i>
                <span>Putting:</span> <span>{stats.putting}</span>
            </div>
            <div className="stat-item">
                <i className="fas fa-brain"></i>
                <span>Mental:</span> <span>{stats.mental}</span>
            </div>
        </div>
    );
};

export default PlayerStats;
