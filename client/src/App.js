// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import pages
import Dashboard from './components/pages/Dashboard';
import Player from './components/pages/Player';
import Training from './components/pages/Training';
import Tournament from './components/pages/Tournament';
import Shop from './components/pages/Shop';
import Leaderboard from './components/pages/Leaderboard';
import Settings from './components/pages/Settings';
import Login from './components/pages/Login';
import Results from './components/pages/Results'; // Ensure this file exists

// Import shared components
import Header from './components/shared/Header';
import Alert from './components/shared/Alert';
import Navigation from './components/shared/Navigation';

// Import global context
import { AppContext } from './context/AppContext';
import './App.css';

const AppContent = () => {
    const { player, alerts, addAlert, logout, setToken, setPlayer, results, setResults } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app">
            <Header player={player} handleLogout={handleLogout} />
            <Alert alerts={alerts} />
            <Navigation />
            <div className="tab-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/player" element={<Player player={player} setPlayer={setPlayer} addAlert={addAlert} />} />
                    <Route path="/training" element={<Training player={player} setPlayer={setPlayer} addAlert={addAlert} />} />
                    <Route
                        path="/tournament"
                        element={
                            <>
                                <Tournament player={player} setPlayer={setPlayer} setResults={setResults} addAlert={addAlert} />
                                {results && <Results results={results} />}
                            </>
                        }
                    />
                    <Route path="/shop" element={<Shop player={player} setPlayer={setPlayer} addAlert={addAlert} />} />
                    <Route path="/leaderboard" element={<Leaderboard player={player} />} />
                    <Route path="/settings" element={<Settings player={player} setPlayer={setPlayer} addAlert={addAlert} setToken={setToken} handleLogout={logout} />} />
                    {/* If user is logged in, redirect /login to /dashboard */}
                    <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
        </div>
    );
};

const App = () => {
    // Call useContext unconditionally
    const context = useContext(AppContext);
    const { token, player } = context;

    if (!token) {
        return <Login setToken={context.setToken} addAlert={context.addAlert} />;
    }
    if (!player) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
