import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = ({ player, addAlert }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/leaderboard', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                console.log('Leaderboard data:', response.data); // Debug
                setLeaderboard(response.data);
            } catch (err) {
                console.error('Failed to fetch leaderboard:', err.response?.data || err.message);
                if (err.response?.status === 401) {
                    addAlert('Session expired. Please log in again.', 'error');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload();
                } else {
                    setLeaderboard([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [addAlert]);

    return (
        <div className="leaderboard">
            <h3>Season Leaderboard</h3>
            {isLoading ? (
                <div>Loading leaderboard...</div>
            ) : leaderboard.length === 0 ? (
                <div>No leaderboard data available yet.</div>
            ) : (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Points</th>
                            <th>Wins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((golfer, index) => (
                            <tr key={golfer.name} className={golfer.name === 'You' ? 'highlight' : ''}>
                                <td>{index + 1}</td>
                                <td>{golfer.name}</td>
                                <td>{golfer.points}</td>
                                <td>{golfer.wins}</td>
                            </tr>
                        ))}
                        {leaderboard.every(g => g.name !== 'You') && (
                            <tr className="highlight">
                                <td>N/A</td>
                                <td>{player.name}</td>
                                <td>0</td>
                                <td>{player.wins || 0}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Leaderboard;