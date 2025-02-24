// src/components/shared/Alert.js
import React from 'react';

const Alert = ({ alerts }) => (
    <div className="alerts">
        {alerts.map((alert) => (
            <div key={alert.id} className={`alert ${alert.type}`}>
                {alert.message}
            </div>
        ))}
    </div>
);

export default Alert;
