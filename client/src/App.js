import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    const [alerts, setAlerts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [, setUserId] = useState(localStorage.getItem('userId') || null);
    const alertIdCounter = useRef(0);

    const addAlert = useCallback((message, type = 'success') => {
        const id = `${Date.now()}-${alertIdCounter.current++}`;
        setAlerts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, 3000);
    }, []);

    useEffect(() => {
        if (token) {
            const fetchPlayer = async () => {
                try {
                    const BASE_URL = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:5000' : '/api';
                    console.log('NODE_ENV in App:', process.env.NODE_ENV, 'BASE_URL:', BASE_URL); // Debug
                    const res = await axios.get(`${BASE_URL}/api/player`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log('Player data:', res.data);
                    setPlayer(res.data);
                } catch (err) {
                    console.error('Failed to fetch player:', err.response?.data || err.message);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    setToken(null);
                    setUserId(null);
                    setPlayer(null);
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
        addAlert('Logged out successfully', 'success');
    };

    if (!token) {
        return <Login setToken={setToken} setUserId={setUserId} addAlert={addAlert} />;
    }
    if (!player) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
        >
            <div className="app">
                <div className="top-bar">
                    <h1>Fairway Boss</h1>
                    <div className="top-right">
                        <span className="cash">
                            <i className="fas fa-dollar-sign"></i>
                            {player && typeof player.cash === 'number' ? player.cash.toLocaleString() : '0'}
                        </span>
                        <span className="level">Level: {player && player.level ? player.level : '1'}</span>
                        <button className="icon-btn" onClick={() => window.location.href = '/player'} title="Player Info">
                            <span className="nickname">{player && player.name ? player.name : 'Rookie'}</span>
                            <i className="fas fa-user"></i>
                        </button>
                        <button className="icon-btn" onClick={() => window.location.href = '/settings'} title="Settings">
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
                    <button onClick={() => window.location.href = '/training'}>
                        <i className="fas fa-dumbbell"></i> Training
                    </button>
                    <button onClick={() => window.location.href = '/tournament'}>
                        <i className="fas fa-trophy"></i> Tournament
                    </button>
                    <button onClick={() => window.location.href = '/shop'}>
                        <i className="fas fa-shopping-cart"></i> Shop
                    </button>
                    <button onClick={() => window.location.href = '/leaderboard'}>
                        <i className="fas fa-list-ol"></i> Leaderboard
                    </button>
                </div>
                <div className="tab-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/training" />} />
                        <Route path="/player" element={<Home player={player} setPlayer={setPlayer} addAlert={addAlert} />} />
                        <Route path="/training" element={<Training player={player} setPlayer={setPlayer} addAlert={addAlert} />} />
                        <Route path="/tournament" element={
                            <>
                                <Tournament player={player} setPlayer={setPlayer} setResults={setResults} addAlert={addAlert} />
                                {results && <Results results={results} />}
                            </>
                        } />
                        <Route path="/shop" element={<Shop player={player} setPlayer={setPlayer} addAlert={addAlert} />} />
                        <Route path="/leaderboard" element={<Leaderboard player={player} />} />
                        <Route path="/settings" element={
                            <Settings
                                player={player}
                                setPlayer={setPlayer}
                                addAlert={addAlert}
                                setToken={setToken}
                                handleLogout={handleLogout}
                            />
                        } />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;