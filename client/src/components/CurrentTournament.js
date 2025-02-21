import React from 'react';

const CurrentTournament = ({ tournamentResults, getRoundLeaderboard }) => {
    return (
        <div className="current-tournament">
            <h3>Current Tournament: {tournamentResults.eventName}</h3>
            <p>Course: {tournamentResults.course} | Weather: {tournamentResults.weather}</p>
            <div className="round-leaderboards">
                <div className="rounds-row">
                    <div className="round-leaderboard">
                        <h4>Round 1 Leaderboard</h4>
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Place</th>
                                    <th>Name</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getRoundLeaderboard(0).length > 0 ? (
                                    getRoundLeaderboard(0).map((golfer, index) => (
                                        <tr key={golfer.uniqueKey} className={golfer.name === 'You' ? 'highlight' : ''}>
                                            <td>{index + 1}</td>
                                            <td>{golfer.name}</td>
                                            <td>{golfer.score !== undefined ? golfer.score : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No data available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="round-leaderboard">
                        <h4>Round 2 Leaderboard</h4>
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Place</th>
                                    <th>Name</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getRoundLeaderboard(1).length > 0 ? (
                                    getRoundLeaderboard(1).map((golfer, index) => (
                                        <tr key={golfer.uniqueKey} className={golfer.name === 'You' ? 'highlight' : ''}>
                                            <td>{index + 1}</td>
                                            <td>{golfer.name}</td>
                                            <td>{golfer.score !== undefined ? golfer.score : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No data available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="rounds-row">
                    <div className="round-leaderboard">
                        <h4>Round 3 Leaderboard</h4>
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Place</th>
                                    <th>Name</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getRoundLeaderboard(2).length > 0 ? (
                                    getRoundLeaderboard(2).map((golfer, index) => (
                                        <tr key={golfer.uniqueKey} className={golfer.name === 'You' ? 'highlight' : ''}>
                                            <td>{index + 1}</td>
                                            <td>{golfer.name}</td>
                                            <td>{golfer.score !== undefined ? golfer.score : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No data available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="round-leaderboard">
                        <h4>Round 4 Leaderboard</h4>
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Place</th>
                                    <th>Name</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getRoundLeaderboard(3).length > 0 ? (
                                    getRoundLeaderboard(3).map((golfer, index) => (
                                        <tr key={golfer.uniqueKey} className={golfer.name === 'You' ? 'highlight' : ''}>
                                            <td>{index + 1}</td>
                                            <td>{golfer.name}</td>
                                            <td>{golfer.score !== undefined ? golfer.score : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No data available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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