// src/components/player/XPBar.js
import React from 'react';

const XPBar = ({ xp, level, getXpForLevel }) => {
    const percentage =
        typeof xp === 'number' && typeof level === 'number'
            ? (xp / getXpForLevel(level + 1)) * 100
            : 0;
    return (
        <div className="xp-bar">
            <div className="xp-progress" style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

export default XPBar;
