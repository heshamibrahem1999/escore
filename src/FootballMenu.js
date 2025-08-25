import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './FootballMenu.css';

const FootballMenu = ({ darkMode, onToggleDarkMode }) => {
  const location = useLocation();

  return (
    <nav className={`football-menu ${darkMode ? 'dark-mode' : ''}`}>
      <div className="menu-container">
        <div className="menu-left">
          <div className="brand-section">
            <div className="brand-logo">⚽</div>
            <div className="brand-text">
              <span className="brand-name">EScore</span>
              <span className="brand-tagline">Football Hub</span>
            </div>
          </div>
          
          <div className="nav-links">
            <Link to="/" className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}>
              <span className="menu-icon">🏠</span>
              <span className="menu-text">Home</span>
            </Link>
            <Link to="/teams" className={`menu-item ${location.pathname === '/teams' ? 'active' : ''}`}>
              <span className="menu-icon">👥</span>
              <span className="menu-text">Teams</span>
            </Link>
            <Link to="/competitions" className={`menu-item ${location.pathname === '/competitions' ? 'active' : ''}`}>
              <span className="menu-icon">🏆</span>
              <span className="menu-text">Leagues</span>
            </Link>
            <Link to="/players" className={`menu-item ${location.pathname === '/players' ? 'active' : ''}`}>
              <span className="menu-icon">⚽</span>
              <span className="menu-text">Players</span>
            </Link>
          </div>
        </div>
        
        <div className="menu-right">
          <button 
            onClick={onToggleDarkMode} 
            className="theme-toggle"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default FootballMenu; 