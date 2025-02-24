// src/components/CurrentTournament.js
import React from 'react';

const RoundLeaderboard = ({ roundIndex, getRoundLeaderboard }) => {
    const leaderboard = getRoundLeaderboard(roundIndex);
    return (
        <div className="round-leaderboard">
            <h4>Round {roundIndex + 1} Leaderboard</h4>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Place</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.length > 0 ? (
                        leaderboard.map((golfer, index) => (
                            <tr key={golfer.uniqueKey} className={golfer.name === 'You' ? 'highlight' : ''}>
                                <td>{index + 1}</td>
                                <td>{golfer.name}</td>
                                <td>{golfer.score !== undefined ? golfer.score : 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const CurrentTournament = ({ tournamentResults, getRoundLeaderboard }) => {
    return (
        <div className="current-tournament">
            <h3>Current Tournament: {tournamentResults.eventName}</h3>
            <p>
                Course: {tournamentResults.course} | Weather: {tournamentResults.weather}
            </p>
            <div className="round-leaderboards">
                <div className="rounds-row">
                    <RoundLeaderboard roundIndex={0} getRoundLeaderboard={getRoundLeaderboard} />
                    <RoundLeaderboard roundIndex={1} getRoundLeaderboard={getRoundLeaderboard} />
                </div>
                <div className="rounds-row">
                    <RoundLeaderboard roundIndex={2} getRoundLeaderboard={getRoundLeaderboard} />
                    <RoundLeaderboard roundIndex={3} getRoundLeaderboard={getRoundLeaderboard} />
                </div>
            </div>
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
                    {tournamentResults.leaderboard.map((golfer, index) => (
                        <tr key={`${golfer.name}-${index}`} className={golfer.name === 'You' ? 'highlight' : ''}>
                            <td>{index + 1}</td>
                            <td>{golfer.name}</td>
                            <td>{golfer.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CurrentTournament;
