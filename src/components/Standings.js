import React from 'react';
import { useNavigate } from 'react-router-dom';

const Standings = ({ 
  darkMode, 
  selectedCompetition, 
  standings, 
  loading, 
  error, 
  fetchCompetitionStandings
}) => {
  const navigate = useNavigate();

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">
          📊 {selectedCompetition?.name || 'League'} Standings
        </h1>
        <p className="page-subtitle">
          Current standings and team statistics
        </p>
      </div>
      
      <div className="action-buttons">
        <button onClick={() => navigate('/competitions')} className="back-button">
          ← Back to Leagues
        </button>
        <button 
          onClick={() => fetchCompetitionStandings(selectedCompetition?.id, selectedCompetition?.name)} 
          className="refresh-button" 
          disabled={loading}
        >
          🔄 Refresh Standings
        </button>
      </div>

      {/* Enhanced Error State */}
      {error && (
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <h3 className="error-title">Failed to Load Standings</h3>
          <p className="error-message">
            {error.includes('429') 
              ? 'Too many requests. Please wait a moment and try again.' 
              : error
            }
          </p>
          <button 
            onClick={() => fetchCompetitionStandings(selectedCompetition?.id, selectedCompetition?.name)} 
            className="retry-button"
          >
            🔄 Retry
          </button>
        </div>
      )}

      {/* Enhanced Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading standings...</p>
        </div>
      )}

      {/* Enhanced Empty State */}
      {!loading && !error && (!standings || standings.length === 0) && (
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h3 className="empty-title">No Standings Available</h3>
          <p className="empty-message">
            No standings data is currently available for this competition. Please check back later.
          </p>
        </div>
      )}

      {/* Standings Display */}
      {!loading && !error && standings && standings.length > 0 && (
        <div className="standings-container">
          {standings.map((standing, index) => (
            <div key={index} className="standings-group">
              <h3 className="standings-group-title">
                {standing.type === 'TOTAL' ? 'Overall Table' : 
                 standing.type === 'HOME' ? 'Home Table' :
                 standing.type === 'AWAY' ? 'Away Table' :
                 standing.group || `Group ${index + 1}`}
                {standing.stage && ` - ${standing.stage.replace('_', ' ')}`}
              </h3>
              
              <div className="standings-table-container">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Team</th>
                      <th>P</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GF</th>
                      <th>GA</th>
                      <th>GD</th>
                      <th>Pts</th>
                      <th>Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standing.table?.map((team) => (
                      <tr key={team.position} className={`team-row ${team.position <= 4 ? 'champions-league' : team.position <= 6 ? 'europa-league' : team.position >= 18 ? 'relegation' : ''}`}>
                        <td className="position">{team.position}</td>
                        <td className="team-info">
                          <div className="team-details">
                            {team.team.crest && (
                              <img 
                                src={team.team.crest} 
                                alt={team.team.name} 
                                className="team-crest"
                              />
                            )}
                            <div className="team-text">
                              <span className="team-name">{team.team.name}</span>
                              {team.team.shortName && team.team.shortName !== team.team.name && (
                                <span className="team-short-name">({team.team.shortName})</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="played">{team.playedGames}</td>
                        <td className="won">{team.won}</td>
                        <td className="drawn">{team.draw}</td>
                        <td className="lost">{team.lost}</td>
                        <td className="goals-for">{team.goalsFor}</td>
                        <td className="goals-against">{team.goalsAgainst}</td>
                        <td className="goal-difference">{team.goalDifference}</td>
                        <td className="points">{team.points}</td>
                        <td className="form">
                          {team.form && team.form.split(',').map((result, i) => (
                            <span key={i} className={`form-result ${result.toLowerCase()}`}>
                              {result === 'W' ? 'W' : result === 'D' ? 'D' : 'L'}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Standings;
