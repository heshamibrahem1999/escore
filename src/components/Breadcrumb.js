import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = ({ darkMode, competitionName }) => {
  const location = useLocation();
  
  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const items = [];
    
    // Always add Home
    items.push({ name: 'Home', path: '/', icon: '🏠' });
    
    if (pathSegments.includes('league')) {
      items.push({ name: 'Leagues', path: '/competitions', icon: '🏆' });
      
      if (pathSegments.length >= 3) {
        const competitionId = pathSegments[1];
        const page = pathSegments[2];
        
        if (page === 'matches') {
          items.push({ 
            name: competitionName || 'League', 
            path: `/league/${competitionId}/matches`, 
            icon: '⚽',
            current: true 
          });
        } else if (page === 'standings') {
          items.push({ 
            name: competitionName || 'League', 
            path: `/league/${competitionId}/standings`, 
            icon: '📊',
            current: true 
          });
        }
      }
    } else if (pathSegments.includes('teams')) {
      items.push({ name: 'Teams', path: '/teams', icon: '👥', current: true });
    } else if (pathSegments.includes('players')) {
      items.push({ name: 'Players', path: '/players', icon: '⚽', current: true });
    } else if (pathSegments.includes('competitions')) {
      items.push({ name: 'Leagues', path: '/competitions', icon: '🏆', current: true });
    } else if (pathSegments.includes('matches')) {
      items.push({ name: 'Matches', path: '/matches', icon: '⚽', current: true });
    } else if (pathSegments.includes('standings')) {
      items.push({ name: 'Standings', path: '/standings', icon: '📊', current: true });
    }
    
    return items;
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumb on home page
  }
  
  return (
    <nav className={`breadcrumb ${darkMode ? 'dark-mode' : ''}`}>
      <div className="breadcrumb-container">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            {index > 0 && (
              <span className="breadcrumb-separator">/</span>
            )}
            {item.current ? (
              <span className="breadcrumb-item current">
                <span className="breadcrumb-icon">{item.icon}</span>
                <span className="breadcrumb-text">{item.name}</span>
              </span>
            ) : (
              <Link to={item.path} className="breadcrumb-item">
                <span className="breadcrumb-icon">{item.icon}</span>
                <span className="breadcrumb-text">{item.name}</span>
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
