import React from 'react';

const Results = ({ results }) => {
    if (!results || !results.scores) {
        return <div className="results">No tournament results available yet.</div>;
    }

    return (
        <div className="results">
            <h3>Final Results - {results.course} ({results.weather})</h3>
            <p>Rounds: {results.scores.map((score, i) => `Round ${i + 1}: ${score}`).join(' | ')}</p>
            <p>Total: {results.total} | Place: {results.place} | Prize: ${results.prize.toLocaleString()}</p>
            <h4>Final Leaderboard</h4>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Place</th>
                        <th>Name</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {results.leaderboard.map((golfer, index) => (
                        <tr key={golfer.name} className={golfer.name === localStorage.getItem('userId') ? 'highlight' : ''}>
                            <td>{index + 1}</td>
                            <td>{golfer.name === localStorage.getItem('userId') ? 'You' : golfer.name}</td>
                            <td>{golfer.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Results;