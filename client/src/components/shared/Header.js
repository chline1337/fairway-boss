// src/components/shared/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ player, handleLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="top-bar">
            <h1>Fairway Boss</h1>
            <div className="top-right">
                <span className="cash">
                    <i className="fas fa-dollar-sign"></i>
                    {player && typeof player.cash === 'number' ? player.cash.toLocaleString() : '0'}
                </span>
                <span className="level">Level: {player && player.level ? player.level : '1'}</span>
                <button className="icon-btn" onClick={() => navigate('/player')} title="Player Info">
                    <span className="nickname">{player && player.name ? player.name : 'Rookie'}</span>
                    <i className="fas fa-user"></i>
                </button>
                <button className="icon-btn" onClick={() => navigate('/settings')} title="Settings">
                    <i className="fas fa-cog"></i>
                </button>
                <button className="icon-btn" onClick={handleLogout} title="Logout">
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </div>
    );
};

export default Header;
