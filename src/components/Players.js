import React from 'react';
import { useNavigate } from 'react-router-dom';

const Players = ({ 
  darkMode, 
  players, 
  loading, 
  error
}) => {
  const navigate = useNavigate();

  const handlePlayerClick = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <div className={`players-section ${darkMode ? 'dark-mode' : ''}`}>
      {/* Hero Header */}
      <div className="players-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">⚽</span>
            Football Players
          </h1>
          <p className="hero-subtitle">Discover players from around the world</p>
          <p className="hero-description">
            Explore {players.length} players with detailed profiles, statistics, 
            and career information
          </p>
        </div>
        
        <div className="hero-actions">
          <button onClick={() => navigate('/teams')} className="back-button">
            <span className="button-icon">←</span>
            <span className="button-text">Back to Teams</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading players data...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3 className="error-title">Something went wrong</h3>
          <p className="error-message">{error}</p>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && players.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <h3 className="empty-title">No Players Available</h3>
          <p className="empty-message">
            We couldn't find any players. Please try refreshing the data or check back later.
          </p>
          <button onClick={() => navigate('/teams')} className="back-button">
            <span className="button-icon">👥</span>
            <span className="button-text">Browse Teams</span>
          </button>
        </div>
      )}
      
      {/* Players Content */}
      {!loading && !error && players.length > 0 && (
        <>
          {/* Players Overview */}
          <div className="players-overview">
            <h2 className="overview-title">
              <span className="title-icon">📊</span>
              Players Overview
            </h2>
            <div className="overview-stats">
              <div className="overview-stat">
                <div className="stat-icon">⚽</div>
                <div className="stat-content">
                  <div className="stat-number">{players.length}</div>
                  <div className="stat-label">Total Players</div>
                </div>
              </div>
              <div className="overview-stat">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">{new Set(players.map(p => p.teamName)).size}</div>
                  <div className="stat-label">Teams</div>
                </div>
              </div>
              <div className="overview-stat">
                <div className="stat-icon">🌍</div>
                <div className="stat-content">
                  <div className="stat-number">{new Set(players.map(p => p.nationality)).size}</div>
                  <div className="stat-label">Nationalities</div>
                </div>
              </div>
              <div className="overview-stat">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-number">{new Set(players.map(p => p.position)).size}</div>
                  <div className="stat-label">Positions</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Players Grid */}
          <div className="players-grid">
            {players.map((player) => (
              <div key={player.id} className="player-card" onClick={() => handlePlayerClick(player.id)}>
                <div className="player-header">
                  <div className="player-photo-container">
                    <div className="player-photo-placeholder">
                      <span className="placeholder-text">{player.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="player-title">
                    <h3 className="player-name">{player.name}</h3>
                    <p className="player-position">{player.position || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="player-info">
                  {player.nationality && (
                    <div className="info-item">
                      <span className="info-icon">🌍</span>
                      <div className="info-content">
                        <span className="info-label">Nationality</span>
                        <span className="info-value">{player.nationality}</span>
                      </div>
                    </div>
                  )}
                  
                  {player.teamName && (
                    <div className="info-item">
                      <span className="info-icon">👥</span>
                      <div className="info-content">
                        <span className="info-label">Team</span>
                        <span className="info-value">{player.teamName}</span>
                      </div>
                    </div>
                  )}
                  
                  {player.dateOfBirth && (
                    <div className="info-item">
                      <span className="info-icon">🎂</span>
                      <div className="info-content">
                        <span className="info-label">Date of Birth</span>
                        <span className="info-value">
                          {new Date(player.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {player.teamId && (
                    <div className="info-item">
                      <span className="info-icon">🆔</span>
                      <div className="info-content">
                        <span className="info-label">Team ID</span>
                        <span className="info-value">{player.teamId}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="player-actions">
                  <button className="view-profile-button">
                    <span className="button-icon">👤</span>
                    <span className="button-text">View Profile</span>
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

export default Players;
