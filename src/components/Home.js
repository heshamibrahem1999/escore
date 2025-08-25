import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ 
  darkMode, 
  selectedDate, 
  teams, 
  competitions, 
  allMatches, 
  navigateDate, 
  setSelectedDate, 
  formatDateDisplay, 
  getMatchesForDate
}) => {
  const navigate = useNavigate();

  return (
    <div className={`home-section ${darkMode ? 'dark-mode' : ''}`}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">⚽</span>
            Welcome to EScore
          </h1>
          <p className="hero-subtitle">Your Ultimate Football Companion</p>
          <p className="hero-description">
            Discover live scores, team statistics, player profiles, and everything football in one place
          </p>
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">{teams.length}</div>
            <div className="stat-label">Teams</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{competitions.length}</div>
            <div className="stat-label">Leagues</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{allMatches.length}</div>
            <div className="stat-label">Matches</div>
          </div>
        </div>
      </div>

      {/* Date Navigation Section */}
      <div className="date-section">
        <div className="date-header">
          <h2 className="date-title">
            <span className="date-icon">📅</span>
            {formatDateDisplay(selectedDate)}
          </h2>
          <p className="date-subtitle">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="date-navigation">
          <button 
            onClick={() => navigateDate('prev')}
            className="date-nav-button prev"
            title="Previous Day"
          >
            <span className="nav-icon">←</span>
            <span className="nav-text">Previous</span>
          </button>
          
          <button 
            onClick={() => setSelectedDate(new Date())}
            className="date-reset-button"
            title="Go to Today"
          >
            <span className="reset-icon">🎯</span>
            <span className="reset-text">Today</span>
          </button>
          
          <button 
            onClick={() => navigateDate('next')}
            className="date-nav-button next"
            title="Next Day"
          >
            <span className="nav-text">Next</span>
            <span className="nav-icon">→</span>
          </button>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <h3 className="section-title">
          <span className="title-icon">🚀</span>
          Quick Actions
        </h3>
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/teams')} 
            className="action-button primary"
          >
            <span className="action-icon">👥</span>
            <span className="action-text">Browse Teams</span>
            <span className="action-arrow">→</span>
          </button>
          
          <button 
            onClick={() => navigate('/competitions')} 
            className="action-button secondary"
          >
            <span className="action-icon">🏆</span>
            <span className="action-text">View Leagues</span>
            <span className="action-arrow">→</span>
          </button>
          
          <button 
            onClick={() => navigate('/players')} 
            className="action-button accent"
          >
            <span className="action-icon">⚽</span>
            <span className="action-text">Player Profiles</span>
            <span className="action-arrow">→</span>
          </button>
        </div>
      </div>

      {/* Matches Section */}
      {allMatches.length > 0 && (
        <div className="matches-section">
          <div className="section-header">
            <h3 className="section-title">
              <span className="title-icon">⚽</span>
              {formatDateDisplay(selectedDate)}
            </h3>
            <p className="section-subtitle">
              {(() => {
                const selectedDateMatches = getMatchesForDate(selectedDate);
                return `${selectedDateMatches.length} match${selectedDateMatches.length !== 1 ? 'es' : ''} scheduled`;
              })()}
            </p>
          </div>
          
          {(() => {
            const selectedDateMatches = getMatchesForDate(selectedDate);
            
            if (selectedDateMatches.length === 0) {
              return (
                <div className="no-matches">
                  <div className="no-matches-icon">📅</div>
                  <h4>No Matches Today</h4>
                  <p>No matches are scheduled for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <button 
                    onClick={() => navigate('/matches')} 
                    className="browse-matches-button"
                  >
                    Browse All Matches
                  </button>
                </div>
              );
            }
            
            return (
              <>
                <div className="matches-grid">
                  {selectedDateMatches.slice(0, 6).map((match) => (
                    <div key={match.id} className="match-card">
                      <div className="match-header">
                        <div className="competition-info">
                          {match.competition?.emblem && (
                            <img 
                              src={match.competition.emblem} 
                              alt={match.competition.name} 
                              className="competition-emblem"
                            />
                          )}
                          <span className="competition-name">{match.competition?.name || 'Unknown'}</span>
                        </div>
                        <div className="match-status">
                          <span className={`status-badge ${match.status.toLowerCase()}`}>
                            {match.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="match-teams">
                        <div className="team home-team">
                          {match.homeTeam?.crest && (
                            <img 
                              src={match.homeTeam.crest} 
                              alt={match.homeTeam.name} 
                              className="team-crest"
                            />
                          )}
                          <span className="team-name">{match.homeTeam?.name || 'TBD'}</span>
                        </div>
                        
                        <div className="match-score">
                          {match.score?.fullTime?.home !== null ? (
                            <>
                              <span className="score">{match.score.fullTime.home}</span>
                              <span className="separator">-</span>
                              <span className="score">{match.score.fullTime.away}</span>
                            </>
                          ) : (
                            <span className="vs">vs</span>
                          )}
                        </div>
                        
                        <div className="team away-team">
                          <span className="team-name">{match.awayTeam?.name || 'TBD'}</span>
                          {match.awayTeam?.crest && (
                            <img 
                              src={match.awayTeam.crest} 
                              alt={match.awayTeam.name} 
                              className="team-crest"
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="match-details">
                        <div className="match-info">
                          <span className="match-time">
                            {new Date(match.utcDate).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </span>
                          {match.venue && (
                            <span className="match-venue">📍 {match.venue}</span>
                          )}
                        </div>
                        {match.area && (
                          <div className="match-area">
                            <span className="area-name">🌍 {match.area.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedDateMatches.length > 6 && (
                  <div className="view-more-section">
                    <button 
                      onClick={() => navigate('/matches')} 
                      className="view-more-button"
                    >
                      <span className="view-more-text">
                        View All {selectedDateMatches.length} Matches
                      </span>
                      <span className="view-more-arrow">→</span>
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Home;
