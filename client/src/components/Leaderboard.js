import React, { useState, useEffect } from 'react';

const Leaderboard = ({ player }) => {
    const [sortField, setSortField] = useState('wins');
    const [sortDirection, setSortDirection] = useState('desc');
    const [aiPlayers, setAiPlayers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetch('/aiplayers.json')
            .then(res => res.json())
            .then(data => setAiPlayers(data))
            .catch(err => console.error('Failed to load AI players:', err));
    }, []);

    const leaderboardData = [
        ...aiPlayers.map((p, index) => ({ rank: index + 1, ...p })),
        { rank: 0, name: player.name, wins: player.wins || 0, earnings: player.earnings }
    ];

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
        setCurrentPage(1); // Reset to first page on sort
    };

    const sortedData = [...leaderboardData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (sortField === 'name') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }).map((entry, index) => ({ ...entry, rank: index + 1 }));

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="leaderboard">
            <h3>Leaderboard</h3>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('rank')}>
                            Rank {sortField === 'rank' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th onClick={() => handleSort('name')}>
                            Name {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th onClick={() => handleSort('wins')}>
                            Wins {sortField === 'wins' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th onClick={() => handleSort('earnings')}>
                            Earnings {sortField === 'earnings' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((entry) => (
                        <tr key={entry.name} className={entry.name === player.name ? 'highlight' : ''}>
                            <td>{entry.rank}</td>
                            <td>{entry.name}</td>
                            <td>{entry.wins}</td>
                            <td>${entry.earnings.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={currentPage === page ? 'active' : ''}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;