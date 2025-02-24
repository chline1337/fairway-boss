// src/components/pages/Dashboard.js
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
    const { player } = useContext(AppContext);

    return (
        <div className="dashboard">
            <h2>Welcome, {player.name || 'Player'}!</h2>
            <div className="dashboard-summary">
                <div className="summary-item">
                    <h4>Level</h4>
                    <p>{player.level}</p>
                </div>
                <div className="summary-item">
                    <h4>Cash</h4>
                    <p>${typeof player.cash === 'number' ? player.cash.toLocaleString() : 0}</p>
                </div>
                <div className="summary-item">
                    <h4>XP</h4>
                    <p>{player.xp}</p>
                </div>
                {/* Placeholder for future features */}
                <div className="summary-item">
                    <h4>Upcoming Events</h4>
                    <p>Coming Soon!</p>
                </div>
                <div className="summary-item">
                    <h4>Recent Achievements</h4>
                    <p>Coming Soon!</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
