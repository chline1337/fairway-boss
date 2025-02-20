import React from 'react';

const Leaderboard = ({ player }) => {
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

    const scores = Object.entries(aiPlayers)
        .map(([name]) => ({ name, total: aiPlayers[name] }))
        .sort((a, b) => a.total - b.total)
        .slice(0, 10);

    return (
        <div className="leaderboard">
            <h3>Leaderboard</h3>
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
                    {scores.map((golfer, index) => (
                        <tr key={golfer.name} className={golfer.name === player.name ? 'highlight' : ''}>
                            <td>{index + 1}</td>
                            <td>{golfer.name}</td>
                            <td>{golfer.total}</td>
                            <td>{golfer.name === player.name ? player.wins : 'N/A'}</td>
                        </tr>
                    ))}
                    {scores.every(g => g.name !== player.name) && (
                        <tr className="highlight">
                            <td>N/A</td>
                            <td>{player.name}</td>
                            <td>N/A</td>
                            <td>{player.wins}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;