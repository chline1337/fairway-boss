import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tournament = ({ player, setPlayer, setResults, addAlert }) => {
    const [tournamentPreview, setTournamentPreview] = useState(null);

    useEffect(() => {
        axios.get('/tournament', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => setTournamentPreview(res.data))
            .catch(err => {
                console.error('Failed to load tournament preview:', err.response?.data || err.message);
                addAlert('Failed to load tournament preview.', 'error');
            });
    }, [player.week, addAlert]); // Added addAlert to dependencies

    const play = (tactic) => {
        if (!tournamentPreview) {
            addAlert('No tournament preview available.', 'error');
            return;
        }
        if (!['aggressive', 'conservative', 'balanced'].includes(tactic)) {
            addAlert('Invalid tactic selected.', 'error');
            return;
        }

        axios.post('/tournament', {
            tactic,
            courseName: tournamentPreview.course,
            weatherName: tournamentPreview.weather
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setPlayer(res.data.player);
                setResults(res.data);
                const { place, prize, course } = res.data; // Removed unused 'leaderboard'
                if (place === 1) {
                    addAlert(`You won the ${tournamentPreview.eventName} at ${course}! +$${prize.toLocaleString()}`, 'success');
                } else {
                    addAlert(`Finished ${place}${getOrdinalSuffix(place)} at ${course}, earned $${prize.toLocaleString()}!`, 'neutral');
                }
                switch (res.data.weather) {
                    case 'Windy':
                        addAlert('Windy conditions favored your Mental but challenged Driving.', 'neutral');
                        break;
                    case 'Rainy':
                        addAlert('Rainy weather boosted your Putting but hindered Irons.', 'neutral');
                        break;
                    default:
                        addAlert('Calm weather provided a neutral playing field.', 'neutral');
                        break;
                }
            })
            .catch(err => {
                console.error('Tournament play failed:', err.response?.data || err.message);
                addAlert('Tournament play failed.', 'error');
            });
    };

    const getOrdinalSuffix = (number) => {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = number % 100;
        return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    };

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

    if (!tournamentPreview) return <div className="loading">Loading tournament...</div>;

    return (
        <div className="tournament">
            <h3>{tournamentPreview.eventName} (Week {tournamentPreview.week})</h3>
            <p>Course: {tournamentPreview.course}</p>
            <p>Weather: {tournamentPreview.weather}</p>
            <p className="weather-effects">Effects: {getWeatherEffects(tournamentPreview.weather)}</p>
            <div className="button-group">
                <button onClick={() => play('aggressive')}>Aggressive (-2)</button>
                <button onClick={() => play('conservative')}>Conservative (+2)</button>
                <button onClick={() => play('balanced')}>Balanced (0)</button>
            </div>
        </div>
    );
};

export default Tournament;