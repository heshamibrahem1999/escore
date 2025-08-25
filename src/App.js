import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import './App.css';
import { footballApi } from './api/footballApi';
import FootballMenu from './FootballMenu';
import Home from './components/Home';
import Teams from './components/Teams';
import Competitions from './components/Competitions';
import Standings from './components/Standings';
import Matches from './components/Matches';
import Players from './components/Players';
import PlayerDetail from './components/PlayerDetail';
import Breadcrumb from './components/Breadcrumb';

// Custom hook to handle league-specific routes
const useLeagueRoute = (competitions, fetchCompetitionMatches, fetchCompetitionStandings) => {
  const { competitionId } = useParams();
  const [hasInitialized, setHasInitialized] = React.useState(false);
  const [lastCompetitionId, setLastCompetitionId] = React.useState(null);
  
  useEffect(() => {
    // Only proceed if we have a competition ID and competitions data
    if (!competitionId || competitions.length === 0) {
      return;
    }
    
    // Check if this is a new competition or first load
    const isNewCompetition = lastCompetitionId !== competitionId;
    const shouldInitialize = !hasInitialized || isNewCompetition;
    
    if (shouldInitialize) {
      const competition = competitions.find(c => c.id.toString() === competitionId);
      if (competition) {
        // Auto-fetch data based on current route
        const path = window.location.pathname;
        if (path.includes('/matches')) {
          fetchCompetitionMatches(competition.id, competition.name);
        } else if (path.includes('/standings')) {
          fetchCompetitionStandings(competition.id, competition.name);
        }
        setHasInitialized(true);
        setLastCompetitionId(competitionId);
      }
    }
  }, [competitionId, competitions, fetchCompetitionMatches, fetchCompetitionStandings, hasInitialized, lastCompetitionId]);
  
  return { competitionId };
};

// Wrapper components for league routes
const LeagueMatches = ({ 
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
  fetchCompetitionMatches,
  competitions,
  fetchCompetitionStandings
}) => {
  useLeagueRoute(competitions, fetchCompetitionMatches, fetchCompetitionStandings);
  
  return (
    <>
      <Breadcrumb darkMode={darkMode} competitionName={selectedCompetition?.name} />
      <Matches 
        darkMode={darkMode}
        selectedCompetition={selectedCompetition}
        matches={matches}
        loading={loading}
        error={error}
        matchFilters={matchFilters}
        selectedMatchday={selectedMatchday}
        filterStatus={filterStatus}
        filterStage={filterStage}
        filterGroup={filterGroup}
        filterSeason={filterSeason}
        filterDateFrom={filterDateFrom}
        filterDateTo={filterDateTo}
        handleFilterChange={handleFilterChange}
        fetchCompetitionMatches={fetchCompetitionMatches}
      />
    </>
  );
};

const LeagueStandings = ({ 
  darkMode, 
  selectedCompetition, 
  standings, 
  loading, 
  error, 
  fetchCompetitionStandings,
  competitions,
  fetchCompetitionMatches
}) => {
  useLeagueRoute(competitions, fetchCompetitionMatches, fetchCompetitionStandings);
  
  return (
    <>
      <Breadcrumb darkMode={darkMode} competitionName={selectedCompetition?.name} />
      <Standings 
        darkMode={darkMode}
        selectedCompetition={selectedCompetition}
        standings={standings}
        loading={loading}
        error={error}
        fetchCompetitionStandings={fetchCompetitionStandings}
      />
    </>
  );
};

function App() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [standings, setStandings] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatchday, setSelectedMatchday] = useState('');
  const [matchFilters, setMatchFilters] = useState({});
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterSeason, setFilterSeason] = useState('2024');
  const [loadingCompetition, setLoadingCompetition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [allMatches, setAllMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch all teams and competitions on component mount
  useEffect(() => {
    fetchAllTeams();
    fetchAllCompetitions();
    fetchAllMatches();
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    // Apply dark mode class to body and html if needed
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const fetchAllTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching all teams data...');
      console.log('📡 Making API call to footballApi.getTeams()');
      
      const teamsData = await footballApi.getTeams();
      console.log('📊 All Teams Data received:', teamsData);
      console.log('🏟️ Teams data structure:', {
        hasTeams: !!teamsData.teams,
        teamsArray: Array.isArray(teamsData.teams),
        totalTeams: teamsData.teams?.length || 0,
        hasFilters: !!teamsData.filters,
        hasCount: !!teamsData.count
      });
      
      // Set teams data
      const teams = teamsData.teams || [];
      console.log('✅ Setting teams state with:', teams.length, 'teams');
      setTeams(teams);
      
      // Extract players from teams
      console.log(`👤 Extracting players from teams...`);
      const allPlayers = [];
      teams.forEach((team, index) => {
        console.log(`🏃 Processing team ${index + 1}/${teams.length}:`, {
          teamId: team.id,
          teamName: team.name,
          hasSquad: !!team.squad,
          squadSize: team.squad?.length || 0
        });
        
        if (team.squad) {
          console.log(`👥 Players for ${team.name}:`, team.squad.map(player => ({
            id: player.id,
            name: player.name,
            position: player.position,
            nationality: player.nationality
          })));
          
          team.squad.forEach(player => {
            allPlayers.push({
              ...player,
              teamId: team.id,
              teamName: team.name,
              teamLogo: team.crest,
              teamStadium: team.venue
            });
          });
        } else {
          console.log(`⚠️ Team ${team.name} has no squad data`);
        }
      });
      
      console.log(`🎯 Total players extracted:`, allPlayers.length);
      console.log(`👥 Sample players:`, allPlayers.slice(0, 5));
      console.log(`✅ Setting players state with:`, allPlayers.length, 'players');
      setPlayers(allPlayers);
      
      // Additional teams analysis in App component
      console.log('🏟️ Teams Summary from App:', {
        totalTeams: teams.length,
        oldestTeam: teams.reduce((oldest, team) => 
          team.founded && (!oldest || team.founded < oldest.founded) ? team : oldest, null
        ),
        newestTeam: teams.reduce((newest, team) => 
          team.founded && (!newest || team.founded > newest.founded) ? team : newest, null
        ),
        teamsWithFullInfo: teams.filter(team => 
          team.crest && team.website && team.venue && team.founded && team.clubColors
        ).length
      });
      
      // Log some interesting team facts
      const germanTeams = teams.filter(team => 
        team.name.includes('FC') || team.name.includes('SV') || team.name.includes('TSV')
      );
      console.log('🇩🇪 German Teams Analysis:', {
        totalGermanTeams: germanTeams.length,
        sampleGermanTeams: germanTeams.slice(0, 5).map(team => ({
          name: team.name,
          founded: team.founded,
          venue: team.venue
        }))
      });
      
      // Log data quality metrics
      console.log('📊 Data Quality Metrics:', {
        teamsWithLogos: teams.filter(t => t.crest).length,
        teamsWithWebsites: teams.filter(t => t.website).length,
        teamsWithVenues: teams.filter(t => t.venue).length,
        teamsWithFoundedYear: teams.filter(t => t.founded).length,
        teamsWithClubColors: teams.filter(t => t.clubColors).length,
        teamsWithAddress: teams.filter(t => t.address).length,
        teamsWithSquad: teams.filter(t => t.squad && t.squad.length > 0).length
      });
      
      console.log('✅ Teams data successfully processed and state updated!');
      
    } catch (err) {
      console.error('❌ Error fetching teams:', err);
      console.error('❌ Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      });
      setError('Failed to load teams. Please try again later.');
    } finally {
      console.log('🏁 Fetch operation completed, setting loading to false');
      setLoading(false);
    }
  };

  const fetchAllCompetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching all competitions data...');
      console.log('📡 Making API call to footballApi.getCompetitions()');
      
      const competitionsData = await footballApi.getCompetitions();
      console.log('📊 All Competitions Data received:', competitionsData);
      console.log('🏟️ Competitions data structure:', {
        hasCompetitions: !!competitionsData.competitions,
        competitionsArray: Array.isArray(competitionsData.competitions),
        totalCompetitions: competitionsData.competitions?.length || 0,
        hasFilters: !!competitionsData.filters,
        hasCount: !!competitionsData.count
      });
      
      // Set competitions data
      const competitions = competitionsData.competitions || [];
      console.log('✅ Setting competitions state with:', competitions.length, 'competitions');
      setCompetitions(competitions);
      
      console.log('✅ Competitions data successfully processed and state updated!');
      
    } catch (err) {
      console.error('❌ Error fetching competitions:', err);
      console.error('❌ Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      });
      setError('Failed to load competitions. Please try again later.');
    } finally {
      console.log('🏁 Fetch operation completed, setting loading to false');
      setLoading(false);
    }
  };

  const fetchAllMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching all matches data...');
      console.log('📡 Making API call to footballApi.getAllMatches()');
      
      const matchesData = await footballApi.getAllMatches();
      console.log('📊 All Matches Data received:', matchesData);
      console.log('🏟️ Matches data structure:', {
        hasMatches: !!matchesData.matches,
        matchesArray: Array.isArray(matchesData.matches),
        totalMatches: matchesData.matches?.length || 0,
        hasFilters: !!matchesData.filters,
        hasResultSet: !!matchesData.resultSet
      });
      
      // Set matches data
      const matches = matchesData.matches || [];
      console.log('✅ Setting all matches state with:', matches.length, 'matches');
      setAllMatches(matches);
      
      console.log('✅ All matches data successfully processed and state updated!');
      
    } catch (err) {
      console.error('❌ Error fetching all matches:', err);
      console.error('❌ Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      });
      setError('Failed to load all matches. Please try again later.');
    } finally {
      console.log('🏁 Fetch operation completed, setting loading to false');
      setLoading(false);
    }
  };

  // Add function to navigate between dates
  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  // Add function to get matches for a specific date
  const getMatchesForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return allMatches
      .filter(match => {
        const matchDate = new Date(match.utcDate);
        const matchDateString = matchDate.toISOString().split('T')[0];
        return matchDateString === dateString;
      })
      .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate)); // Sort by time
  };

  // Add function to format date for display
  const formatDateDisplay = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today's Matches";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday's Matches";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow's Matches";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      }) + "'s Matches";
    }
  };

  const fetchCompetitionStandings = async (competitionId, competitionName) => {
    // Prevent duplicate calls if already loading the same competition
    if (loadingCompetition === competitionId || (selectedCompetition?.id === competitionId && standings.length > 0)) {
      return;
    }
    
    const startTime = Date.now();
    setLoadingCompetition(competitionId);
    setLoading(true);
    setError(null);
    try {
      console.log(`🔍 Fetching standings for competition ${competitionId} (${competitionName})`);
      console.log('📡 Making API call to footballApi.getCompetitionStandings()');
      
      const standingsData = await footballApi.getCompetitionStandings(competitionId);
      console.log('📊 Standings Data received:', standingsData);
      
      setStandings(standingsData.standings || []);
      setSelectedCompetition({ id: competitionId, name: competitionName });
      
      console.log('✅ Standings data successfully processed and state updated!');
      
    } catch (err) {
      console.error('❌ Error fetching standings:', err);
      console.error('❌ Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      });
      setError('Failed to load standings. Please try again later.');
    } finally {
      // Ensure minimum loading time to prevent flickering
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 300; // 300ms minimum
      
      if (elapsedTime < minLoadingTime) {
        setTimeout(() => {
          setLoading(false);
          setLoadingCompetition(null);
        }, minLoadingTime - elapsedTime);
      } else {
        setLoading(false);
        setLoadingCompetition(null);
      }
    }
  };

  // Fetch competition matches
  const fetchCompetitionMatches = async (competitionId, competitionName, filters = {}) => {
    // Prevent duplicate calls if already loading the same competition
    if (loadingCompetition === competitionId || (selectedCompetition?.id === competitionId && matches.length > 0 && Object.keys(filters).length === 0)) {
      return;
    }
    
    const startTime = Date.now();
    try {
      setLoadingCompetition(competitionId);
      setLoading(true);
      setError(null);
      console.log(`🔍 Fetching matches for competition ${competitionId} (${competitionName})`);
      console.log(`🔍 Filters applied:`, filters);
      
      const matchesData = await footballApi.getCompetitionMatches(competitionId, filters);
      console.log(`📊 Matches data received:`, matchesData);
      
      setMatches(matchesData.matches || []);
      setSelectedCompetition({ id: competitionId, name: competitionName });
      setMatchFilters(filters);
    } catch (error) {
      console.error('❌ Error fetching matches:', error);
      setError(`Failed to fetch matches: ${error.message}`);
    } finally {
      // Ensure minimum loading time to prevent flickering
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 300; // 300ms minimum
      
      if (elapsedTime < minLoadingTime) {
        setTimeout(() => {
          setLoading(false);
          setLoadingCompetition(null);
        }, minLoadingTime - elapsedTime);
      } else {
        setLoading(false);
        setLoadingCompetition(null);
      }
    }
  };

  // Handle individual filter changes and apply immediately
  const handleFilterChange = (filterType, value) => {
    console.log(`🔍 Filter changed: ${filterType} = ${value}`);
    
    // Update the specific filter state
    switch (filterType) {
      case 'matchday':
        setSelectedMatchday(value);
        break;
      case 'status':
        setFilterStatus(value);
        break;
      case 'stage':
        setFilterStage(value);
        break;
      case 'group':
        setFilterGroup(value);
        break;
      case 'season':
        setFilterSeason(value);
        break;
      case 'dateFrom':
        setFilterDateFrom(value);
        break;
      case 'dateTo':
        setFilterDateTo(value);
        break;
      default:
        break;
    }

    // Build and apply filters immediately
    const filters = {};
    
    // Only include non-default/empty values
    if (value && filterType === 'matchday') filters.matchday = value;
    if (filterStatus) filters.status = filterStatus;
    if (filterStage) filters.stage = filterStage;
    if (filterGroup) filters.group = filterGroup;
    if (filterSeason && filterSeason !== '2024') filters.season = filterSeason;
    if (filterDateFrom) filters.dateFrom = filterDateFrom;
    if (filterDateTo) filters.dateTo = filterDateTo;
    
    // Also check other filters that might have values
    if (selectedMatchday && filterType !== 'matchday') filters.matchday = selectedMatchday;
    if (filterStatus && filterType !== 'status') filters.status = filterStatus;
    if (filterStage && filterType !== 'stage') filters.stage = filterStage;
    if (filterGroup && filterType !== 'group') filters.group = filterGroup;
    if (filterSeason && filterType !== 'season') filters.season = filterSeason;
    if (filterDateFrom && filterType !== 'dateFrom') filters.dateFrom = filterDateFrom;
    if (filterDateTo && filterType !== 'dateTo') filters.dateTo = filterDateTo;
    
    console.log('🔄 Auto-applying filters:', filters);
    
    // Apply filters immediately if we have a competition selected
    if (selectedCompetition?.id) {
      fetchCompetitionMatches(selectedCompetition.id, selectedCompetition.name, filters);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Add/remove dark-mode class to body and html for global styles
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  };

  return (
    <Router>
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
        <FootballMenu 
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        
        <Routes>
          <Route path="/" element={
            <Home 
              darkMode={darkMode}
              selectedDate={selectedDate}
              teams={teams}
              competitions={competitions}
              allMatches={allMatches}
              navigateDate={navigateDate}
              setSelectedDate={setSelectedDate}
              formatDateDisplay={formatDateDisplay}
              getMatchesForDate={getMatchesForDate}
            />
          } />
          
          <Route path="/teams" element={
            <>
              <Breadcrumb darkMode={darkMode} />
              <Teams 
                darkMode={darkMode}
                teams={teams}
                loading={loading}
                error={error}
                fetchAllTeams={fetchAllTeams}
              />
            </>
          } />
          
          <Route path="/competitions" element={
            <>
              <Breadcrumb darkMode={darkMode} />
              <Competitions 
                darkMode={darkMode}
                competitions={competitions}
                loading={loading}
                error={error}
                fetchAllCompetitions={fetchAllCompetitions}
                fetchCompetitionStandings={fetchCompetitionStandings}
                fetchCompetitionMatches={fetchCompetitionMatches}
              />
            </>
          } />
          
          <Route path="/standings" element={
            <>
              <Breadcrumb darkMode={darkMode} />
              <Standings 
                darkMode={darkMode}
                selectedCompetition={selectedCompetition}
                standings={standings}
                loading={loading}
                error={error}
                fetchCompetitionStandings={fetchCompetitionStandings}
              />
            </>
          } />
          
          <Route path="/matches" element={
            <>
              <Breadcrumb darkMode={darkMode} />
              <Matches 
                darkMode={darkMode}
                selectedCompetition={selectedCompetition}
                matches={matches}
                loading={loading}
                error={error}
                matchFilters={matchFilters}
                selectedMatchday={selectedMatchday}
                filterStatus={filterStatus}
                filterStage={filterStage}
                filterGroup={filterGroup}
                filterSeason={filterSeason}
                filterDateFrom={filterDateFrom}
                filterDateTo={filterDateTo}
                handleFilterChange={handleFilterChange}
                fetchCompetitionMatches={fetchCompetitionMatches}
              />
            </>
          } />
          
          {/* Individual League Routes */}
          <Route path="/league/:competitionId/matches" element={
            <LeagueMatches 
              darkMode={darkMode}
              selectedCompetition={selectedCompetition}
              matches={matches}
              loading={loading}
              error={error}
              matchFilters={matchFilters}
              selectedMatchday={selectedMatchday}
              filterStatus={filterStatus}
              filterStage={filterStage}
              filterGroup={filterGroup}
              filterSeason={filterSeason}
              filterDateFrom={filterDateFrom}
              filterDateTo={filterDateTo}
              handleFilterChange={handleFilterChange}
              fetchCompetitionMatches={fetchCompetitionMatches}
              competitions={competitions}
              fetchCompetitionStandings={fetchCompetitionStandings}
            />
          } />
          
          <Route path="/league/:competitionId/standings" element={
            <LeagueStandings 
              darkMode={darkMode}
              selectedCompetition={selectedCompetition}
              standings={standings}
              loading={loading}
              error={error}
              fetchCompetitionStandings={fetchCompetitionStandings}
              competitions={competitions}
              fetchCompetitionMatches={fetchCompetitionMatches}
            />
          } />
          
          <Route path="/players" element={
            <>
              <Breadcrumb darkMode={darkMode} />
              <Players 
                darkMode={darkMode}
                players={players}
                loading={loading}
                error={error}
              />
            </>
          } />
          
          <Route path="/player/:id" element={
            <PlayerDetail 
              darkMode={darkMode}
              players={players}
            />
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
