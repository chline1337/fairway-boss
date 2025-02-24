// src/components/shared/Navigation.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();

    return (
        <div className="tabs">
            <button onClick={() => navigate('/dashboard')}>
                <i className="fas fa-home"></i> Dashboard
            </button>
            <button onClick={() => navigate('/training')}>
                <i className="fas fa-dumbbell"></i> Training
            </button>
            <button onClick={() => navigate('/tournament')}>
                <i className="fas fa-trophy"></i> Tournament
            </button>
            <button onClick={() => navigate('/shop')}>
                <i className="fas fa-shopping-cart"></i> Shop
            </button>
            <button onClick={() => navigate('/leaderboard')}>
                <i className="fas fa-list-ol"></i> Leaderboard
            </button>
        </div>
    );
};

export default Navigation;
