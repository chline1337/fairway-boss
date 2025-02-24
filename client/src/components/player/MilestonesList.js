// src/components/player/MilestonesList.js
import React from 'react';

const MilestonesList = ({ milestones }) => {
    if (!milestones || milestones.length === 0) return <p>No milestones available yet.</p>;

    return (
        <div className="milestones-grid">
            {milestones.map((m) => (
                <div key={m.id} className={`milestone-item ${m.completed ? 'completed' : ''}`}>
                    <span>
                        {m.name}: {m.progress}/{m.target}
                    </span>
                    <span className="reward">
                        Reward: {m.reward.cash ? `$${m.reward.cash.toLocaleString()}` : `${m.reward.xp} XP`}
                    </span>
                    {m.completed && <span className="completed-badge">Completed</span>}
                </div>
            ))}
        </div>
    );
};

export default MilestonesList;
