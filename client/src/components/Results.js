import React from 'react';

const Results = ({ results }) => {
    if (!results || !results.scores) {
        return <div className="results">No tournament results available yet.</div>;
    }

    return (
        <div className="results">
            <h3>Last Tournament - {results.course} ({results.weather})</h3>
            <p>Scores: {results.scores.join(' - ')} | Total: {results.total}</p>
            <p>Place: {results.place} | Prize: ${results.prize.toLocaleString()}</p>
        </div>
    );
};

export default Results;