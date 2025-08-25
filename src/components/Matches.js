import React from 'react';
import { useNavigate } from 'react-router-dom';

const Matches = ({ 
  darkMode, 
  selectedCompetition, 
  matches, 
  loading, 
  error, 
  matchFilters, 
  selectedMatchday, 
  filterStatus, 
  filterStage, 
  filterGroup, 
  filterSeason, 
  filterDateFrom, 
  filterDateTo, 
  handleFilterChange, 
  fetchCompetitionMatches
}) => {
  const navigate = useNavigate();

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">
          ⚽ {selectedCompetition?.name || 'League'} Matches
        </h1>
        <p className="page-subtitle">
          Match results, schedules, and detailed statistics
        </p>
      </div>
      
      <div className="action-buttons">
        <button onClick={() => navigate('/competitions')} className="back-button">
          ← Back to Leagues
        </button>
        <button 
          onClick={() => fetchCompetitionMatches(selectedCompetition?.id, selectedCompetition?.name)} 
          className="refresh-button" 
          disabled={loading}
        >
          🔄 Refresh Matches
        </button>
      </div>

      {/* Enhanced Error State */}
      {error && (
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <h3 className="error-title">Failed to Load Matches</h3>
          <p className="error-message">
            {error.includes('429') 
              ? 'Too many requests. Please wait a moment and try again.' 
              : error
            }
          </p>
          <button 
            onClick={() => fetchCompetitionMatches(selectedCompetition?.id, selectedCompetition?.name)} 
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
          <p className="loading-text">Loading matches...</p>
        </div>
      )}

      {/* Enhanced Filter Section */}
      {!loading && !error && (
        <div className="filters-section">
          <div className="filters-grid">
            {/* Matchday Filter */}
            <div className="filter-item">
              <label htmlFor="matchday" className="filter-label">Matchday</label>
              <select 
                id="matchday" 
                className="filter-select"
                value={selectedMatchday} 
                onChange={(e) => handleFilterChange('matchday', parseInt(e.target.value) || '')}
              >
                <option value="">All Matchdays</option>
                {Array.from({ length: 38 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>Matchday {day}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-item">
              <label htmlFor="status" className="filter-label">Status</label>
              <select 
                id="status" 
                className="filter-select"
                value={filterStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="LIVE">Live</option>
                <option value="IN_PLAY">In Play</option>
                <option value="PAUSED">Paused</option>
                <option value="FINISHED">Finished</option>
                <option value="POSTPONED">Postponed</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Stage Filter */}
            <div className="filter-item">
              <label htmlFor="stage" className="filter-label">Stage</label>
              <select 
                id="stage" 
                className="filter-select"
                value={filterStage}
                onChange={(e) => handleFilterChange('stage', e.target.value)}
              >
                <option value="">All Stages</option>
                <option value="REGULAR_SEASON">Regular Season</option>
                <option value="GROUP_STAGE">Group Stage</option>
                <option value="ROUND_OF_16">Round of 16</option>
                <option value="QUARTER_FINALS">Quarter Finals</option>
                <option value="SEMI_FINALS">Semi Finals</option>
                <option value="FINAL">Final</option>
                <option value="PLAYOFF_ROUND_1">Playoff Round 1</option>
                <option value="PLAYOFF_ROUND_2">Playoff Round 2</option>
                <option value="PLAYOFFS">Playoffs</option>
              </select>
            </div>

            {/* Season Filter */}
            <div className="filter-item">
              <label htmlFor="season" className="filter-label">Season</label>
              <select 
                id="season" 
                className="filter-select"
                value={filterSeason}
                onChange={(e) => handleFilterChange('season', e.target.value)}
              >
                <option value="">All Seasons</option>
                <option value="2024">2024/25</option>
                <option value="2023">2023/24</option>
                <option value="2022">2022/23</option>
                <option value="2021">2021/22</option>
                <option value="2020">2020/21</option>
              </select>
            </div>

            {/* Group Filter */}
            <div className="filter-item">
              <label htmlFor="group" className="filter-label">Group</label>
              <select 
                id="group" 
                className="filter-select"
                value={filterGroup}
                onChange={(e) => handleFilterChange('group', e.target.value)}
              >
                <option value="">All Groups</option>
                <option value="A">Group A</option>
                <option value="B">Group B</option>
                <option value="C">Group C</option>
                <option value="D">Group D</option>
                <option value="E">Group E</option>
                <option value="F">Group F</option>
                <option value="G">Group G</option>
                <option value="H">Group H</option>
              </select>
            </div>

            {/* Date Range Filters */}
            <div className="filter-item">
              <label htmlFor="dateFrom" className="filter-label">From Date</label>
              <input 
                type="date" 
                id="dateFrom"
                className="filter-input"
                value={filterDateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="filter-item">
              <label htmlFor="dateTo" className="filter-label">To Date</label>
              <input 
                type="date" 
                id="dateTo"
                className="filter-input"
                value={filterDateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {!loading && !error && (!matches || matches.length === 0) && (
        <div className="empty-state">
          <span className="empty-icon">⚽</span>
          <h3 className="empty-title">No Matches Found</h3>
          <p className="empty-message">
            No matches match your current filters. Try adjusting your search criteria or check back later for new matches.
          </p>
        </div>
      )}

      {/* Matches Display */}
      {!loading && !error && matches && matches.length > 0 && (
        <div className="matches-grid">
          {matches.map((match) => (
            <div key={match.id} className={`match-card ${darkMode ? 'dark-mode' : ''}`}>
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
      )}
    </div>
  );
};

export default Matches;
