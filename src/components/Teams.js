import React from 'react';
import { useNavigate } from 'react-router-dom';

const Teams = ({ 
  darkMode, 
  teams, 
  loading, 
  error, 
  fetchAllTeams
}) => {
  const navigate = useNavigate();

  return (
    <div className={`teams-section ${darkMode ? 'dark-mode' : ''}`}>
      {/* Hero Header */}
      <div className="teams-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">👥</span>
            Football Teams
          </h1>
          <p className="hero-subtitle">Discover teams from around the world</p>
          <p className="hero-description">
            Explore {teams.length} teams with detailed information about their history, 
            stadiums, and squad members
          </p>
        </div>
        
        <div className="hero-actions">
          <button onClick={() => navigate('/')} className="back-button">
            <span className="button-icon">←</span>
            <span className="button-text">Back to Home</span>
          </button>
          <button onClick={fetchAllTeams} className="refresh-button" disabled={loading}>
            <span className="button-icon">🔄</span>
            <span className="button-text">{loading ? 'Refreshing...' : 'Refresh Teams'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading teams data...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3 className="error-title">Something went wrong</h3>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchAllTeams}>
            <span className="retry-icon">🔄</span>
            <span className="retry-text">Try Again</span>
          </button>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && teams.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏟️</div>
          <h3 className="empty-title">No Teams Available</h3>
          <p className="empty-message">
            We couldn't find any teams. Please try refreshing the data.
          </p>
          <button className="refresh-button" onClick={fetchAllTeams}>
            <span className="button-icon">🔄</span>
            <span className="button-text">Refresh Data</span>
          </button>
        </div>
      )}
      
      {/* Teams Content */}
      {!loading && !error && teams.length > 0 && (
        <>
          {/* Teams Overview */}
          <div className="teams-overview">
            <h2 className="overview-title">
              <span className="title-icon">📊</span>
              Teams Overview
            </h2>
            <div className="overview-stats">
              <div className="overview-stat">
                <div className="stat-icon">🏗️</div>
                <div className="stat-content">
                  <div className="stat-number">{teams.filter(t => t.founded).length}</div>
                  <div className="stat-label">Founded Teams</div>
                </div>
              </div>
              <div className="overview-stat">
                <div className="stat-icon">🏟️</div>
                <div className="stat-content">
                  <div className="stat-number">{teams.filter(t => t.venue).length}</div>
                  <div className="stat-label">With Stadiums</div>
                </div>
              </div>
              <div className="overview-stat">
                <div className="stat-icon">🌐</div>
                <div className="stat-content">
                  <div className="stat-number">{teams.filter(t => t.website).length}</div>
                  <div className="stat-label">With Websites</div>
                </div>
              </div>
              <div className="overview-stat">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">{teams.filter(t => t.squad && t.squad.length > 0).length}</div>
                  <div className="stat-label">With Squad Data</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Teams Grid */}
          <div className="teams-grid">
            {teams.map((team) => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <div className="team-logo-container">
                    {team.crest ? (
                      <img src={team.crest} alt={`${team.name} logo`} className="team-logo" />
                    ) : (
                      <div className="team-logo-placeholder">
                        <span className="placeholder-text">{team.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="team-title">
                    <h3 className="team-name">{team.name}</h3>
                    {team.shortName && team.shortName !== team.name && (
                      <p className="team-short-name">{team.shortName}</p>
                    )}
                  </div>
                </div>
                
                <div className="team-info">
                  {team.founded && (
                    <div className="info-item">
                      <span className="info-icon">🏗️</span>
                      <div className="info-content">
                        <span className="info-label">Founded</span>
                        <span className="info-value">{team.founded}</span>
                      </div>
                    </div>
                  )}
                  
                  {team.venue && (
                    <div className="info-item">
                      <span className="info-icon">🏟️</span>
                      <div className="info-content">
                        <span className="info-label">Stadium</span>
                        <span className="info-value">{team.venue}</span>
                      </div>
                    </div>
                  )}
                  
                  {team.address && (
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <div className="info-content">
                        <span className="info-label">Location</span>
                        <span className="info-value">{team.address}</span>
                      </div>
                    </div>
                  )}
                  
                  {team.clubColors && (
                    <div className="info-item">
                      <span className="info-icon">🎨</span>
                      <div className="info-content">
                        <span className="info-label">Colors</span>
                        <span className="info-value">{team.clubColors}</span>
                      </div>
                    </div>
                  )}
                  
                  {team.website && (
                    <div className="info-item">
                      <span className="info-icon">🌐</span>
                      <div className="info-content">
                        <span className="info-label">Website</span>
                        <a href={team.website} target="_blank" rel="noopener noreferrer" className="team-website">
                          Visit Site
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {team.squad && team.squad.length > 0 && (
                  <div className="team-squad">
                    <div className="squad-header">
                      <h4 className="squad-title">
                        <span className="squad-icon">👥</span>
                        Squad ({team.squad.length} players)
                      </h4>
                    </div>
                    <div className="squad-preview">
                      {team.squad.slice(0, 3).map((player) => (
                        <div key={player.id} className="player-preview">
                          <div className="player-info">
                            <span className="player-name">{player.name}</span>
                            <span className="player-position">{player.position || 'N/A'}</span>
                          </div>
                        </div>
                      ))}
                      {team.squad.length > 3 && (
                        <div className="more-players">
                          <span className="more-text">... and {team.squad.length - 3} more</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="team-actions">
                  <button 
                    className="view-players-button"
                    onClick={() => navigate("/players")}
                  >
                    <span className="button-icon">👥</span>
                    <span className="button-text">View Players</span>
                    <span className="button-arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Teams;
