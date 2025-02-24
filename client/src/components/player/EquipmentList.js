// src/components/player/EquipmentList.js
import React from 'react';

const EquipmentList = ({ equipment, sellItem }) => {
    if (!equipment || equipment.length === 0) return <p>No equipment owned yet.</p>;

    return (
        <ul className="equipment-list">
            {equipment.map((item) => (
                <li key={item}>
                    <i className="fas fa-box"></i> {item}
                    <button className="sell-btn" onClick={() => sellItem(item)}>
                        Sell (75%)
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default EquipmentList;
