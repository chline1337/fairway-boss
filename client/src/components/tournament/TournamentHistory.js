// src/components/pages/TournamentHistory.js
import React, { useState } from 'react';

const TournamentHistory = ({ history }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const tournamentsPerPage = 5;

    // Calculate pagination
    const totalPages = Math.ceil(history.length / tournamentsPerPage);
    const startIndex = (currentPage - 1) * tournamentsPerPage;
    const endIndex = startIndex + tournamentsPerPage;
    const paginatedHistory = history.slice(startIndex, endIndex);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="tournament-history">
            <h3>Past Tournaments</h3>
            {history.length === 0 ? (
                <p>No tournaments completed yet.</p>
            ) : (
                <>
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Week</th>
                                <th>Event</th>
                                <th>Course</th>
                                <th>Weather</th>
                                <th>Rounds</th>
                                <th>Total</th>
                                <th>Place</th>
                                <th>Prize</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedHistory.map((tournament, index) => (
                                <tr key={tournament._id ? tournament._id : index}>
                                    <td>{tournament.week}</td>
                                    <td>{tournament.eventName}</td>
                                    <td>{tournament.courseName}</td>
                                    <td>{tournament.weatherName}</td>
                                    <td>
                                        {Array.isArray(tournament.rounds) && tournament.rounds.length > 0
                                            ? tournament.rounds.find(r => r.name === 'You')?.scores.join(', ')
                                            : 'N/A'}
                                    </td>
                                    <td>{tournament.total || 'N/A'}</td>
                                    <td>{tournament.place || 'N/A'}</td>
                                    <td>${tournament.prize ? tournament.prize.toLocaleString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button onClick={handlePrevious} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TournamentHistory;
