import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = ({ player, setPlayer, addAlert, handleLogout }) => { // Replace setToken with handleLogout
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [difficulty, setDifficulty] = useState(localStorage.getItem('difficulty') || 50);
    const [muteSound, setMuteSound] = useState(localStorage.getItem('muteSound') === 'true');
    const [newName, setNewName] = useState(player.name);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
        localStorage.setItem('difficulty', difficulty);
        localStorage.setItem('muteSound', muteSound);
    }, [darkMode, difficulty, muteSound]);

    const handleNameChange = () => {
        axios.post('/update-name', { name: newName }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setPlayer(res.data);
                setNewName(res.data.name); // Sync input with updated name
                addAlert(`Username changed to ${res.data.name}!`, 'success');
            })
            .catch(err => {
                console.error('Name change failed:', err.response?.data || err.message);
                addAlert('Failed to change username.', 'error');
            });
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all progress?')) {
            axios.post('/reset', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => {
                    setPlayer(res.data);
                    setNewName(res.data.name);
                    addAlert('Game reset successfully!', 'success');
                })
                .catch(err => {
                    console.error('Reset failed:', err.response?.data || err.message);
                    addAlert('Reset failed.', 'error');
                });
        }
    };

    return (
        <div className="settings">
            <h3>Settings</h3>
            <div className="settings-section">
                <h4>Profile</h4>
                <div className="setting-item">
                    <label>Username</label>
                    <div className="name-input">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            maxLength={20}
                        />
                        <button onClick={handleNameChange}>Save</button>
                    </div>
                </div>
            </div>
            <div className="settings-section">
                <h4>Gameplay</h4>
                <div className="setting-item">
                    <label>Dark Mode</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={() => setDarkMode(prev => !prev)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="setting-item">
                    <label>Difficulty (Tournament AI)</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    />
                    <span>{difficulty}%</span>
                </div>
                <div className="setting-item">
                    <label>Mute Sound</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={muteSound}
                            onChange={() => setMuteSound(prev => !prev)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            <div className="settings-section">
                <h4>Socials</h4>
                <div className="setting-item">
                    <label>Connect Discord</label>
                    <button className="social-btn" disabled>
                        <i className="fab fa-discord"></i> Connect
                    </button>
                </div>
                <div className="setting-item">
                    <label>Connect Google</label>
                    <button className="social-btn" disabled>
                        <i className="fab fa-google"></i> Connect
                    </button>
                </div>
                <div className="setting-item">
                    <label>Connect X</label>
                    <button className="social-btn" disabled>
                        <i className="fab fa-x-twitter"></i> Connect
                    </button>
                </div>
            </div>
            <div className="settings-section">
                <h4>Reset</h4>
                <div className="setting-item">
                    <label>Reset Game</label>
                    <button className="reset-btn" onClick={handleReset}>Reset</button>
                </div>
                <div className="setting-item">
                    <label>Logout</label>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;