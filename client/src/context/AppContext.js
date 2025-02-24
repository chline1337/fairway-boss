import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import api from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [player, setPlayer] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [alerts, setAlerts] = useState([]);
    const [results, setResults] = useState(null);
    const alertIdCounter = useRef(0);

    const addAlert = useCallback((message, type = 'success') => {
        const id = `${Date.now()}-${alertIdCounter.current++}`;
        setAlerts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }, 3000);
    }, []);

    // Fetch player data when token is set
    useEffect(() => {
        if (token) {
            const fetchPlayer = async () => {
                try {
                    const res = await api.get('/api/player');
                    setPlayer(res.data);
                } catch (err) {
                    console.error('Failed to fetch player:', err.response?.data || err.message);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    setToken(null);
                    setPlayer(null);
                    addAlert('Logged out due to auth failure', 'error');
                }
            };
            fetchPlayer();
        }
    }, [token, addAlert]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setToken(null);
        setPlayer(null);
        addAlert('Logged out successfully', 'success');
    };

    return (
        <AppContext.Provider
            value={{
                player,
                setPlayer,
                token,
                setToken,
                alerts,
                addAlert,
                logout,
                results,
                setResults,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
