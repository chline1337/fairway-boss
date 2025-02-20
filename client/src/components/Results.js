// Results.js
import React from 'react';

const Results = ({ results }) => (
    <div className="results">
        <h3>Last Tournament - {results.course} ({results.weather})</h3>
        <p>Scores: {results.scores.join(' - ')} | Total: {results.total}</p>
        <p>Place: {results.place} | Prize: ${results.prize}</p>
    </div>
);

export default Results;