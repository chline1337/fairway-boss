import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './components/Home';
import Training from './components/Training';
import Tournament from './components/Tournament';
import Shop from './components/Shop';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import Login from './components/Login';
import './App.css';

const App = () => {
    const [player, setPlayer] = useState(null);
    const [results, setResults] = useState(null);
    const [activeTab, setActiveTab] = useState('training');
    const [alerts, setAlerts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [, setUserId] = useState(localStorage.getItem('userId') || null);
    const alertIdCounter = useRef(0); // Persist counter across renders

    const addAlert = useCallback((message, type = 'success') => {
        const id = `${Date.now()}-${alertIdCounter.current++}`; // Unique ID with incrementing counter
        setAlerts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, 3000);
    }, []); // No dependencies needed

    useEffect(() => {
        if (token) {
            const fetchPlayer = async () => {
                try {
                    const res = await axios.get('/player', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setPlayer(res.data);
                } catch (err) {
                    console.error('Failed to fetch player:', err.response?.data || err.message);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    setToken(null);
                    setUserId(null);
                    setPlayer(null);
                    setActiveTab('training');
                    addAlert('Logged out due to auth failure', 'error');
                }
            };
            fetchPlayer();
        }
    }, [token, addAlert]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setToken(null);
        setUserId(null);
        setPlayer(null);
        setActiveTab('training');
        addAlert('Logged out successfully', 'success');
    };

    if (!token) {
        return <Login setToken={setToken} setUserId={setUserId} addAlert={addAlert} />;
    }
    if (!player) {
        return <div className="loading">Loading...</div>;
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'player':
                return <Home player={player} setPlayer={setPlayer} addAlert={addAlert} />;
            case 'training':
                return <Training player={player} setPlayer={setPlayer} addAlert={addAlert} />;
            case 'tournament':
                return (
                    <>
                        <Tournament player={player} setPlayer={setPlayer} setResults={setResults} addAlert={addAlert} />
                        {results && <Results results={results} />}
                    </>
                );
            case 'shop':
                return <Shop player={player} setPlayer={setPlayer} addAlert={addAlert} />;
            case 'leaderboard':
                return <Leaderboard player={player} />;
            case 'settings':
                return (
                    <Settings
                        player={player}
                        setPlayer={setPlayer}
                        addAlert={addAlert}
                        setToken={setToken}
                        handleLogout={handleLogout}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="app">
            <div className="top-bar">
                <h1>Fairway Boss</h1>
                <div className="top-right">
                    <span className="cash">
                        <i className="fas fa-dollar-sign"></i> {player.cash.toLocaleString()}
                    </span>
                    <span className="level">Level: {player.level}</span>
                    <button className="icon-btn" onClick={() => setActiveTab('player')} title="Player Info">
                        <span className="nickname">{player.name}</span>
                        <i className="fas fa-user"></i>
                    </button>
                    <button className="icon-btn" onClick={() => setActiveTab('settings')} title="Settings">
                        <i className="fas fa-cog"></i>
                    </button>
                </div>
            </div>
            <div className="alerts">
                {alerts.map(alert => (
                    <div key={alert.id} className={`alert ${alert.type}`}>{alert.message}</div>
                ))}
            </div>
            <div className="tabs">
                <button
                    className={activeTab === 'training' ? 'active' : ''}
                    onClick={() => setActiveTab('training')}
                >
                    <i className="fas fa-dumbbell"></i> Training
                </button>
                <button
                    className={activeTab === 'tournament' ? 'active' : ''}
                    onClick={() => setActiveTab('tournament')}
                >
                    <i className="fas fa-trophy"></i> Tournament
                </button>
                <button
                    className={activeTab === 'shop' ? 'active' : ''}
                    onClick={() => setActiveTab('shop')}
                >
                    <i className="fas fa-shopping-cart"></i> Shop
                </button>
                <button
                    className={activeTab === 'leaderboard' ? 'active' : ''}
                    onClick={() => setActiveTab('leaderboard')}
                >
                    <i className="fas fa-list-ol"></i> Leaderboard
                </button>
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default App;