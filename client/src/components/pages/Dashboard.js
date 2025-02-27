// src/components/pages/Dashboard.js
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
    const { player } = useContext(AppContext);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h2>Welcome, {player.name || 'Player'}!</h2>
                <img
                    src="/images/dashboard-banner.jpg"
                    alt="Dashboard Banner"
                    className="dashboard-banner"
                />
            </header>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <i className="fas fa-level-up-alt dashboard-icon"></i>
                    <h4>Level</h4>
                    <p>{player.level}</p>
                </div>
                <div className="dashboard-card">
                    <i className="fas fa-dollar-sign dashboard-icon"></i>
                    <h4>Cash</h4>
                    <p>${typeof player.cash === 'number' ? player.cash.toLocaleString() : 0}</p>
                </div>
                <div className="dashboard-card">
                    <i className="fas fa-chart-line dashboard-icon"></i>
                    <h4>XP</h4>
                    <p>{player.xp}</p>
                </div>
                <div className="dashboard-card">
                    <i className="fas fa-calendar-alt dashboard-icon"></i>
                    <h4>Upcoming Events</h4>
                    <p>Coming Soon!</p>
                </div>
                <div className="dashboard-card">
                    <i className="fas fa-trophy dashboard-icon"></i>
                    <h4>Recent Achievements</h4>
                    <p>Coming Soon!</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
