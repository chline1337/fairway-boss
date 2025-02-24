// src/components/Tournament.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import TournamentSetup from '../tournament/TournamentSetup';
import CurrentTournament from '../tournament/CurrentTournament';
import TournamentHistory from '../tournament/TournamentHistory';

const Tournament = ({ player, setPlayer, setResults, addAlert }) => {
    const [options, setOptions] = useState(null);
    const [tournamentResults, setTournamentResults] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedWeather, setSelectedWeather] = useState('');
    const [tactic, setTactic] = useState('');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await api.get('/tournament/options');
                setOptions(res.data);
                setSelectedEvent(res.data.events[0]);
                setSelectedCourse(res.data.courses[0]);
                setSelectedWeather(res.data.weatherConditions[0]);
            } catch (err) {
                console.error('Failed to load tournament options:', err.response?.data || err.message);
                addAlert('Failed to load tournament options.', 'error');
            }
        };

        const fetchHistory = async () => {
            try {
                const res = await api.get('/tournament/history');
                console.log('Tournament history data:', res.data);
                setHistory(res.data);
            } catch (err) {
                console.error('Failed to load tournament history:', err.response?.data || err.message);
                addAlert('Failed to load tournament history.', 'error');
            }
        };

        fetchOptions();
        fetchHistory();
    }, [player.week, addAlert]);

    const startTournament = async () => {
        if (!tactic) {
            addAlert('Please select a tactic.', 'error');
            return;
        }
        try {
            const res = await api.post('/tournament', {
                tactic,
                courseName: selectedCourse,
                weatherName: selectedWeather,
                eventName: selectedEvent
            });
            console.log('New tournament data:', res.data);
            setPlayer(res.data.player);
            setTournamentResults(res.data);
            setResults(null);
            setHistory(prev => [res.data, ...prev]);
            const { place, prize, course } = res.data;
            if (place === 1) {
                addAlert(`You won the ${selectedEvent} at ${course}! +$${prize.toLocaleString()}`, 'success');
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
        } catch (err) {
            console.error('Tournament play failed:', err.response?.data || err.message);
            addAlert('Tournament play failed.', 'error');
        }
    };

    const resetCurrent = () => {
        setTournamentResults(null);
        setTactic('');
    };

    const getOrdinalSuffix = (number) => {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = number % 100;
        return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    };

    if (!options) return <div className="loading">Loading tournament options...</div>;

    return (
        <div className="tournament">
            <TournamentSetup
                week={options.week}
                events={options.events}
                courses={options.courses}
                weatherConditions={options.weatherConditions}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                selectedWeather={selectedWeather}
                setSelectedWeather={setSelectedWeather}
                tactic={tactic}
                setTactic={setTactic}
                startTournament={startTournament}
                resetCurrent={resetCurrent}
                hasResults={!!tournamentResults}
            />
            {tournamentResults && (
                <CurrentTournament
                    tournamentResults={tournamentResults}
                    getRoundLeaderboard={(roundIndex) => {
                        if (!tournamentResults || !Array.isArray(tournamentResults.rounds)) return [];
                        return tournamentResults.rounds
                            .map((player, idx) => ({
                                name: player.name,
                                score: player.scores[roundIndex],
                                uniqueKey: `${player.name}-${idx}-${roundIndex}`
                            }))
                            .sort((a, b) => a.score - b.score);
                    }}
                />
            )}
            <TournamentHistory history={history} />
        </div>
    );
};

export default Tournament;
