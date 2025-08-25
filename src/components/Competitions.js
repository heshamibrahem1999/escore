import React from 'react';
import { useNavigate } from 'react-router-dom';

const Competitions = ({ 
  darkMode, 
  competitions, 
  loading, 
  error, 
  fetchAllCompetitions, 
  fetchCompetitionStandings, 
  fetchCompetitionMatches
}) => {
  const navigate = useNavigate();

  return (
    <div className={`competitions-section ${darkMode ? 'dark-mode' : ''}`}>
      {/* Hero Header */}
      <div className="competitions-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🏆</span>
            Football Leagues
          </h1>
          <p className="hero-subtitle">Discover leagues and competitions worldwide</p>
          <p className="hero-description">
            Explore {competitions.length} competitions with detailed information about standings, 
            matches, and current seasons
          </p>
        </div>
        
        <div className="hero-actions">
          <button onClick={() => navigate('/')} className="back-button">
            <span className="button-icon">←</span>
            <span className="button-text">Back to Home</span>
          </button>
          <button onClick={fetchAllCompetitions} className="refresh-button" disabled={loading}>
            <span className="button-icon">🔄</span>
            <span className="button-text">{loading ? 'Refreshing...' : 'Refresh Leagues'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading leagues data...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3 className="error-title">Something went wrong</h3>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchAllCompetitions}>
            <span className="retry-icon">🔄</span>
            <span className="retry-text">Try Again</span>
          </button>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && competitions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3 className="empty-title">No Leagues Available</h3>
          <p className="empty-message">
            We couldn't find any leagues. Please try refreshing the data.
          </p>
          <button className="refresh-button" onClick={fetchAllCompetitions}>
            <span className="button-icon">🔄</span>
            <span className="button-text">Refresh Data</span>
          </button>
        </div>
      )}
      
      {/* Competitions Content */}
      {!loading && !error && competitions.length > 0 && (
        <>
          {/* Competitions Overview */}
          <div className="competitions-overview">
            <h2 className="overview-title">
              <span className="title-icon">📊</span>
              Leagues Overview
            </h2>
            <div className="overview-stats">
              <div className="overview-stat">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div className="stat-number">{competitions.filter(c => c.type === 'LEAGUE').length}</div>
                  <div className="stat-label">League Competitions</div>
                </div>
              </div>
              <div className="overview-stat">
                <div className="stat-icon">🏅</div>
                <div className="stat-content">
                  <div className="stat-number">{competitions.filter(c => c.type === 'CUP').length}</div>
                  <div className="stat-label">Cup Competitions</div>
                </div>
              </div>
              <div className="overview-stat">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-number">{competitions.filter(c => c.currentSeason).length}</div>
                  <div className="stat-label">Active Seasons</div>
                </div>
              </div>
              <div className="overview-stat">
                <div className="stat-icon">🌍</div>
                <div className="stat-content">
                  <div className="stat-number">{new Set(competitions.map(c => c.area?.name)).size}</div>
                  <div className="stat-label">Countries/Regions</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Competitions Grid */}
          <div className="competitions-grid">
            {competitions.map((competition) => (
              <div key={competition.id} className="competition-card">
                <div className="competition-header">
                  <div className="competition-emblem-container">
                    {competition.emblem ? (
                      <img src={competition.emblem} alt={`${competition.name} emblem`} className="competition-emblem" />
                    ) : (
                      <div className="competition-emblem-placeholder">
                        <span className="placeholder-text">{competition.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="competition-title">
                    <h3 className="competition-name">{competition.name}</h3>
                    {competition.code && (
                      <p className="competition-code">{competition.code}</p>
                    )}
                  </div>
                </div>
                
                <div className="competition-info">
                  {competition.area && (
                    <div className="info-item">
                      <span className="info-icon">🌍</span>
                      <div className="info-content">
                        <span className="info-label">Region</span>
                        <span className="info-value">{competition.area.name}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="info-item">
                    <span className="info-icon">🏆</span>
                    <div className="info-content">
                      <span className="info-label">Type</span>
                      <span className="info-value">{competition.type || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-icon">📋</span>
                    <div className="info-content">
                      <span className="info-label">Plan</span>
                      <span className="info-value">{competition.plan || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {competition.currentSeason && (
                    <div className="info-item">
                      <span className="info-icon">📅</span>
                      <div className="info-content">
                        <span className="info-label">Season</span>
                        <span className="info-value">
                          {competition.currentSeason.startDate ? 
                            new Date(competition.currentSeason.startDate).getFullYear() : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="competition-actions">
                  <button 
                    className="view-standings-button"
                    onClick={() => {
                      navigate(`/league/${competition.id}/standings`);
                    }}
                  >
                    <span className="button-icon">📊</span>
                    <span className="button-text">View Standings</span>
                    <span className="button-arrow">→</span>
                  </button>
                  
                  <button 
                    className="view-matches-button"
                    onClick={() => {
                      navigate(`/league/${competition.id}/matches`);
                    }}
                  >
                    <span className="button-icon">⚽</span>
                    <span className="button-text">View Matches</span>
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

export default Competitions;
