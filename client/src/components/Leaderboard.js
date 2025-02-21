import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Removed since not used in static version

const Leaderboard = ({ player }) => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Static leaderboard data
        const aiPlayers = {
            'Scottie Scheffler': Math.floor(280 - Math.random() * 21),
            'Rory McIlroy': Math.floor(280 - Math.random() * 21),
            'Jon Rahm': Math.floor(280 - Math.random() * 21),
            'Brooks Koepka': Math.floor(280 - Math.random() * 21),
            'Jordan Spieth': Math.floor(280 - Math.random() * 21),
            'Justin Thomas': Math.floor(280 - Math.random() * 21),
            'Xander Schauffele': Math.floor(280 - Math.random() * 21),
            'Patrick Cantlay': Math.floor(280 - Math.random() * 21),
            'Collin Morikawa': Math.floor(280 - Math.random() * 21),
            'Viktor Hovland': Math.floor(280 - Math.random() * 21)
        };

        // Optional: Fetch real leaderboard from backend (uncomment and add axios if used)
        /*
        axios.get('/leaderboard', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setLeaderboard(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch leaderboard:', err.response?.data || err.message);
                if (err.response?.status === 401) {
                    addAlert('Session expired. Please log in again.', 'error');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload();
                } else {
                    const scores = Object.entries(aiPlayers)
                        .map(([name]) => ({ name, total: aiPlayers[name], wins: name === player.name ? player.wins : 'N/A' }))
                        .sort((a, b) => a.total - b.total)
                        .slice(0, 10);
                    setLeaderboard(scores);
                }
            });
        */

        // Static leaderboard (default behavior)
        const scores = Object.entries(aiPlayers)
            .map(([name]) => ({ name, total: aiPlayers[name], wins: name === player.name ? player.wins : 'N/A' }))
            .sort((a, b) => a.total - b.total)
            .slice(0, 10);
        setLeaderboard(scores);
    }, [player]); // Re-run if player changes (e.g., wins update)

    return (
        <div className="leaderboard">
            <h3>Leaderboard</h3>
            {leaderboard.length === 0 ? (
                <div>Loading leaderboard...</div>
            ) : (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Name</th>
                            <th>Total</th>
                            <th>Wins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((golfer, index) => (
                            <tr key={golfer.name} className={golfer.name === player.name ? 'highlight' : ''}>
                                <td>{index + 1}</td>
                                <td>{golfer.name}</td>
                                <td>{golfer.total}</td>
                                <td>{golfer.wins}</td>
                            </tr>
                        ))}
                        {leaderboard.every(g => g.name !== player.name) && (
                            <tr className="highlight">
                                <td>N/A</td>
                                <td>{player.name}</td>
                                <td>N/A</td>
                                <td>{player.wins}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Leaderboard;