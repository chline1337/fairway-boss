// src/components/TournamentSetup.js
import React from 'react';

const TournamentSetup = ({
    week,
    events,
    courses,
    weatherConditions,
    selectedEvent,
    setSelectedEvent,
    selectedCourse,
    setSelectedCourse,
    selectedWeather,
    setSelectedWeather,
    tactic,
    setTactic,
    startTournament,
    resetCurrent,
    hasResults
}) => {
    const getWeatherEffects = (weather) => {
        switch (weather) {
            case 'Windy':
                return 'Mental +10%, Driving -10%, Aggressive -5';
            case 'Rainy':
                return 'Putting +10%, Irons -10%, Conservative +5';
            default:
                return 'No effects';
        }
    };

    return (
        <>
            <h3>Tournament Setup (Week {week})</h3>
            <div className="tournament-setup">
                <div className="shop-filter">
                    <label>Event:</label>
                    <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
                        {events.map((event) => (
                            <option key={event} value={event}>
                                {event}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="shop-filter">
                    <label>Course:</label>
                    <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        {courses.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="shop-filter">
                    <label>Weather:</label>
                    <select value={selectedWeather} onChange={(e) => setSelectedWeather(e.target.value)}>
                        {weatherConditions.map((weather) => (
                            <option key={weather} value={weather}>
                                {weather}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <p className="weather-effects">Effects: {getWeatherEffects(selectedWeather)}</p>
            <h4>Select Tactic:</h4>
            <div className="button-group">
                <button onClick={() => setTactic('aggressive')}>Aggressive (-2)</button>
                <button onClick={() => setTactic('conservative')}>Conservative (+2)</button>
                <button onClick={() => setTactic('balanced')}>Balanced (0)</button>
            </div>
            <div className="tournament-actions">
                <button className="start-button" onClick={startTournament} disabled={!tactic}>
                    Start Tournament
                </button>
                {hasResults && (
                    <button className="reset-button" onClick={resetCurrent}>
                        Reset Current
                    </button>
                )}
            </div>
        </>
    );
};

export default TournamentSetup;
