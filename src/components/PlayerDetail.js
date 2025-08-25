import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PlayerDetail = ({ 
  darkMode, 
  players
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const player = players.find((p) => p.id === parseInt(id));
  
  if (!player) return <div>Player not found.</div>;
  
  return (
    <div className={`player-detail-section ${darkMode ? 'dark-mode' : ''}`}>
      <button className="back-btn" onClick={() => navigate("/players")}>← Back to Players</button>
      <div className="player-detail-card">
        <div className="player-photo-container">
          <div className="player-photo-placeholder-large">
            <span>{player.name.charAt(0)}</span>
          </div>
        </div>
        <h2>{player.name}</h2>
        <p><strong>Position:</strong> {player.position || 'N/A'}</p>
        <p><strong>Nationality:</strong> {player.nationality || 'N/A'}</p>
        <p><strong>Team:</strong> {player.teamName || 'Unknown'}</p>
        <p><strong>Date of Birth:</strong> {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Shirt Number:</strong> {player.shirtNumber || 'N/A'}</p>
        <p><strong>Contract Until:</strong> {player.contractUntil ? new Date(player.contractUntil).toLocaleDateString() : 'N/A'}</p>
      </div>
    </div>
  );
};

export default PlayerDetail;
