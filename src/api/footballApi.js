import axios from 'axios';

// Check if we're in development or production
const isDevelopment = process.env.NODE_ENV === 'development';
const isGitHubPages = window.location.hostname === 'heshamibrahem1999.github.io';

console.log('🔍 Environment Detection:', {
  NODE_ENV: process.env.NODE_ENV,
  isDevelopment,
  hostname: window.location.hostname,
  isGitHubPages,
  fullUrl: window.location.href
});

// Use local proxy for development, serverless proxy for production
const API_BASE_URL = isDevelopment 
  ? '/api/v4' 
  : 'https://your-vercel-app.vercel.app/api/football-proxy';

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🚀 Using CORS proxy for production:', !isDevelopment);

const API_KEY = 'f0feb9b1c09c4788931d390d46c8bd8d';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for production to use the proxy path parameter
if (!isDevelopment) {
  apiClient.interceptors.request.use(
    (config) => {
      // For production, we need to pass the path as a query parameter
      const originalUrl = config.url;
      config.url = '';
      config.params = {
        ...config.params,
        path: originalUrl
      };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

// API service functions
export const footballApi = {

  // Get all teams
  getTeams: async () => {
    try {
      console.log('🌐 API Call: GET /teams');
      console.log('🔑 Using API Key:', API_KEY.substring(0, 8) + '...');
      console.log('📡 Request URL (via proxy):', `${API_BASE_URL}/teams`);
      console.log('🔄 Proxied to: https://api.football-data.org/v4/teams');
      
      const response = await apiClient.get('/teams');
      
      console.log('📡 Raw API Response (Teams):', response);
      console.log('📊 Teams Response Data:', response.data);
      console.log('📈 Teams Response Metadata:', {
        status: response.status,
        statusText: response.statusText,
        totalTeams: response.data.count,
        filters: response.data.filters,
        teamsCount: response.data.teams?.length
      });
      
      // Enhanced teams data analysis
      const teams = response.data.teams || [];
      console.log('🏟️ Teams Data Analysis:', {
        totalTeams: teams.length,
        teamsWithCrests: teams.filter(team => team.crest).length,
        teamsWithWebsites: teams.filter(team => team.website).length,
        teamsWithVenues: teams.filter(team => team.venue).length,
        teamsWithFoundedYear: teams.filter(team => team.founded).length,
        teamsWithClubColors: teams.filter(team => team.clubColors).length
      });
      
      // Sample team structure
      if (teams.length > 0) {
        const sampleTeam = teams[0];
        console.log('⚽ Sample Team Structure:', {
          id: sampleTeam.id,
          name: sampleTeam.name,
          shortName: sampleTeam.shortName,
          tla: sampleTeam.tla,
          crest: sampleTeam.crest,
          address: sampleTeam.address,
          website: sampleTeam.website,
          founded: sampleTeam.founded,
          clubColors: sampleTeam.clubColors,
          venue: sampleTeam.venue,
          lastUpdated: sampleTeam.lastUpdated
        });
        
        // Log squad information if available
        if (sampleTeam.squad && sampleTeam.squad.length > 0) {
          console.log('👥 Sample Team Squad Structure:', {
            teamName: sampleTeam.name,
            totalPlayers: sampleTeam.squad.length,
            samplePlayer: sampleTeam.squad[0],
            positions: [...new Set(sampleTeam.squad.map(p => p.position))],
            nationalities: [...new Set(sampleTeam.squad.map(p => p.nationality))]
          });
        }
      }
      
      // Teams by founding year analysis
      const teamsByDecade = teams.reduce((acc, team) => {
        if (team.founded) {
          const decade = Math.floor(team.founded / 10) * 10;
          acc[decade] = (acc[decade] || 0) + 1;
        }
        return acc;
      }, {});
      
      console.log('📅 Teams by Founding Decade:', teamsByDecade);
      
      // Teams with club colors analysis
      const clubColors = teams
        .filter(team => team.clubColors)
        .map(team => team.clubColors)
        .reduce((acc, colors) => {
          acc[colors] = (acc[colors] || 0) + 1;
          return acc;
        }, {});
      
      console.log('🎨 Popular Club Colors:', Object.entries(clubColors)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10));
      
      // Teams with venues analysis
      const venues = teams
        .filter(team => team.venue)
        .map(team => team.venue)
        .reduce((acc, venue) => {
          acc[venue] = (acc[venue] || 0) + 1;
          return acc;
        }, {});
      
      console.log('🏟️ Unique Venues Count:', Object.keys(venues).length);
      
      // Teams with websites
      const teamsWithWebsites = teams.filter(team => team.website);
      console.log('🌐 Teams with Websites:', teamsWithWebsites.length);
      console.log('🔗 Sample Team Websites:', teamsWithWebsites.slice(0, 5).map(team => ({
        name: team.name,
        website: team.website
      })));
      
      // Log all teams with their key information
      console.log('📋 Complete Teams List:', teams.map(team => ({
        id: team.id,
        name: team.name,
        shortName: team.shortName,
        tla: team.tla,
        founded: team.founded,
        venue: team.venue,
        website: team.website,
        clubColors: team.clubColors,
        squadSize: team.squad?.length || 0,
        hasCrest: !!team.crest,
        hasAddress: !!team.address
      })));
      
      return response.data;
    } catch (error) {
      console.error('❌ API Error (Teams):', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      console.error('❌ Error Headers:', error.response?.headers);
      throw error;
    }
  },

  // Get specific team by ID
  getTeam: async (teamId) => {
    try {
      console.log(`🌐 API Call: GET /teams/${teamId}`);
      console.log(`📡 Request URL (via proxy): ${API_BASE_URL}/teams/${teamId}`);
      console.log(`🔄 Proxied to: https://api.football-data.org/v4/teams/${teamId}`);
      
      const response = await apiClient.get(`/teams/${teamId}`);
      
      console.log(`📡 Raw API Response (Team ${teamId}):`, response);
      console.log(`📊 Team ${teamId} Data:`, response.data);
      
      const team = response.data;
      if (team) {
        console.log(`🏟️ Team ${teamId} Details:`, {
          id: team.id,
          name: team.name,
          shortName: team.shortName,
          tla: team.tla,
          crest: team.crest,
          address: team.address,
          website: team.website,
          founded: team.founded,
          clubColors: team.clubColors,
          venue: team.venue,
          lastUpdated: team.lastUpdated,
          squadSize: team.squad?.length || 0
        });
        
        if (team.squad && team.squad.length > 0) {
          console.log(`👥 Team ${teamId} Squad Analysis:`, {
            totalPlayers: team.squad.length,
            positions: [...new Set(team.squad.map(p => p.position))],
            nationalities: [...new Set(team.squad.map(p => p.nationality))],
            samplePlayers: team.squad.slice(0, 3).map(p => ({
              id: p.id,
              name: p.name,
              position: p.position,
              nationality: p.nationality,
              dateOfBirth: p.dateOfBirth,
              shirtNumber: p.shirtNumber
            }))
          });
        }
      }
      
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (Team ${teamId}):`, error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      throw error;
    }
  },

  // Get team matches
  getTeamMatches: async (teamId) => {
    try {
      console.log(`🌐 API Call: GET /teams/${teamId}/matches`);
      console.log(`📡 Request URL (via proxy): ${API_BASE_URL}/teams/${teamId}/matches`);
      console.log(`🔄 Proxied to: https://api.football-data.org/v4/teams/${teamId}/matches`);
      
      const response = await apiClient.get(`/teams/${teamId}/matches`);
      
      console.log(`📡 Raw API Response (Team ${teamId} Matches):`, response);
      console.log(`📊 Team ${teamId} Matches Data:`, response.data);
      
      const matches = response.data.matches || [];
      if (matches.length > 0) {
        console.log(`⚽ Team ${teamId} Matches Analysis:`, {
          totalMatches: matches.length,
          homeMatches: matches.filter(m => m.homeTeam?.id === parseInt(teamId)).length,
          awayMatches: matches.filter(m => m.awayTeam?.id === parseInt(teamId)).length,
          competitions: [...new Set(matches.map(m => m.competition?.name))],
          sampleMatches: matches.slice(0, 3).map(m => ({
            id: m.id,
            homeTeam: m.homeTeam?.name,
            awayTeam: m.awayTeam?.name,
            score: `${m.score?.fullTime?.home || '?'} - ${m.score?.fullTime?.away || '?'}`,
            date: m.utcDate,
            status: m.status,
            competition: m.competition?.name
          }))
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (Team ${teamId} Matches):`, error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      throw error;
    }
  },

  // Get all competitions/leagues
  getCompetitions: async () => {
    try {
      console.log('🌐 API Call: GET /competitions');
      console.log('🔑 Using API Key:', API_KEY.substring(0, 8) + '...');
      console.log('📡 Request URL (via proxy):', `${API_BASE_URL}/competitions`);
      console.log('🔄 Proxied to: https://api.football-data.org/v4/competitions');
      
      const response = await apiClient.get('/competitions');
      
      console.log('📡 Raw API Response (Competitions):', response);
      console.log('📊 Competitions Response Data:', response.data);
      console.log('📈 Competitions Response Metadata:', {
        status: response.status,
        statusText: response.statusText,
        totalCompetitions: response.data.count,
        filters: response.data.filters,
        competitionsCount: response.data.competitions?.length
      });
      
      // Enhanced competitions data analysis
      const competitions = response.data.competitions || [];
      console.log('🏆 Competitions Data Analysis:', {
        totalCompetitions: competitions.length,
        competitionsWithEmblems: competitions.filter(comp => comp.emblem).length,
        competitionsWithWebsites: competitions.filter(comp => comp.website).length,
        competitionsWithCurrentSeason: competitions.filter(comp => comp.currentSeason).length,
        competitionsWithPlan: competitions.filter(comp => comp.plan).length,
        competitionsWithArea: competitions.filter(comp => comp.area).length
      });
      
      // Sample competition structure
      if (competitions.length > 0) {
        const sampleCompetition = competitions[0];
        console.log('🏆 Sample Competition Structure:', {
          id: sampleCompetition.id,
          name: sampleCompetition.name,
          code: sampleCompetition.code,
          type: sampleCompetition.type,
          emblem: sampleCompetition.emblem,
          area: sampleCompetition.area,
          website: sampleCompetition.website,
          plan: sampleCompetition.plan,
          currentSeason: sampleCompetition.currentSeason,
          numberOfAvailableSeasons: sampleCompetition.numberOfAvailableSeasons,
          lastUpdated: sampleCompetition.lastUpdated
        });
        
        // Log area information if available
        if (sampleCompetition.area) {
          console.log('🌍 Sample Competition Area:', {
            areaId: sampleCompetition.area.id,
            areaName: sampleCompetition.area.name,
            areaCode: sampleCompetition.area.code,
            hasFlag: !!sampleCompetition.area.flag
          });
        }
        
        // Log current season information if available
        if (sampleCompetition.currentSeason) {
          console.log('📅 Sample Competition Current Season:', {
            competitionName: sampleCompetition.name,
            seasonId: sampleCompetition.currentSeason.id,
            startDate: sampleCompetition.currentSeason.startDate,
            endDate: sampleCompetition.currentSeason.endDate,
            currentMatchday: sampleCompetition.currentSeason.currentMatchday,
            winner: sampleCompetition.currentSeason.winner?.name
          });
        }
      }
      
      // Competitions by type analysis
      const competitionsByType = competitions.reduce((acc, comp) => {
        acc[comp.type] = (acc[comp.type] || 0) + 1;
        return acc;
      }, {});
      
      console.log('🏆 Competitions by Type:', competitionsByType);
      
      // Competitions by plan analysis
      const competitionsByPlan = competitions.reduce((acc, comp) => {
        acc[comp.plan] = (acc[comp.plan] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📋 Competitions by Plan:', competitionsByPlan);
      
      // Competitions by area analysis
      const competitionsByArea = competitions.reduce((acc, comp) => {
        if (comp.area) {
          acc[comp.area.name] = (acc[comp.area.name] || 0) + 1;
        }
        return acc;
      }, {});
      
      console.log('🌍 Competitions by Area:', competitionsByArea);
      
      // Competitions with emblems
      const competitionsWithEmblems = competitions.filter(comp => comp.emblem);
      console.log('🖼️ Competitions with Emblems:', competitionsWithEmblems.length);
      console.log('🖼️ Sample Competition Emblems:', competitionsWithEmblems.slice(0, 5).map(comp => ({
        name: comp.name,
        emblem: comp.emblem
      })));
      
      // Competitions with websites
      const competitionsWithWebsites = competitions.filter(comp => comp.website);
      console.log('🌐 Competitions with Websites:', competitionsWithWebsites.length);
      console.log('🔗 Sample Competition Websites:', competitionsWithWebsites.slice(0, 5).map(comp => ({
        name: comp.name,
        website: comp.website
      })));
      
      // Log all competitions with their key information
      console.log('📋 Complete Competitions List:', competitions.map(comp => ({
        id: comp.id,
        name: comp.name,
        code: comp.code,
        type: comp.type,
        plan: comp.plan,
        emblem: comp.emblem,
        area: comp.area?.name,
        website: comp.website,
        hasCurrentSeason: !!comp.currentSeason,
        numberOfSeasons: comp.numberOfAvailableSeasons,
        lastUpdated: comp.lastUpdated
      })));
      
      return response.data;
    } catch (error) {
      console.error('❌ API Error (Competitions):', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      console.error('❌ Error Headers:', error.response?.headers);
      throw error;
    }
  },

  // Get specific competition by ID
  getCompetition: async (competitionId) => {
    try {
      console.log(`🌐 API Call: GET /competitions/${competitionId}`);
      console.log(`📡 Request URL (via proxy): ${API_BASE_URL}/competitions/${competitionId}`);
      console.log(`🔄 Proxied to: https://api.football-data.org/v4/competitions/${competitionId}`);
      
      const response = await apiClient.get(`/competitions/${competitionId}`);
      
      console.log(`📡 Raw API Response (Competition ${competitionId}):`, response);
      console.log(`📊 Competition ${competitionId} Data:`, response.data);
      
      const competition = response.data;
      if (competition) {
        console.log(`🏆 Competition ${competitionId} Details:`, {
          id: competition.id,
          name: competition.name,
          code: competition.code,
          type: competition.type,
          emblemUrl: competition.emblemUrl,
          website: competition.website,
          plan: competition.plan,
          currentSeason: competition.currentSeason,
          numberOfAvailableSeasons: competition.numberOfAvailableSeasons,
          lastUpdated: competition.lastUpdated
        });
        
        if (competition.currentSeason) {
          console.log(`📅 Competition ${competitionId} Current Season:`, {
            seasonId: competition.currentSeason.id,
            startDate: competition.currentSeason.startDate,
            endDate: competition.currentSeason.endDate,
            currentMatchday: competition.currentSeason.currentMatchday,
            winner: competition.currentSeason.winner?.name,
            stages: competition.currentSeason.stages
          });
        }
      }
      
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (Competition ${competitionId}):`, error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      throw error;
    }
  },

  // Get competition standings/table
  getCompetitionStandings: async (competitionId) => {
    try {
      console.log(`🌐 API Call: GET /competitions/${competitionId}/standings`);
      console.log(`📡 Request URL (via proxy): ${API_BASE_URL}/competitions/${competitionId}/standings`);
      console.log(`🔄 Proxied to: https://api.football-data.org/v4/competitions/${competitionId}/standings`);
      
      const response = await apiClient.get(`/competitions/${competitionId}/standings`);
      
      console.log(`📡 Raw API Response (Competition ${competitionId} Standings):`, response);
      console.log(`📊 Competition ${competitionId} Standings Data:`, response.data);
      
      const standings = response.data.standings || [];
      if (standings.length > 0) {
        console.log(`📊 Competition ${competitionId} Standings Analysis:`, {
          totalStandings: standings.length,
          standingsTypes: standings.map(s => s.type),
          sampleStanding: standings[0],
          totalTeams: standings[0]?.table?.length || 0
        });
        
        // Log top teams from first standings group
        if (standings[0]?.table) {
          console.log(`🏆 Top Teams in ${competitionId}:`, standings[0].table.slice(0, 5).map(team => ({
            position: team.position,
            name: team.team.name,
            points: team.points,
            playedGames: team.playedGames,
            won: team.won,
            drawn: team.drawn,
            lost: team.lost,
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst,
            goalDifference: team.goalDifference
          })));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (Competition ${competitionId} Standings):`, error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      throw error;
    }
  },

  // Get competition matches
  getCompetitionMatches: async (competitionId, filters = {}) => {
    try {
      console.log(`🌐 API Call: GET /competitions/${competitionId}/matches`);
      console.log(`📡 Request URL (via proxy): ${API_BASE_URL}/competitions/${competitionId}/matches`);
      console.log(`🔄 Proxied to: https://api.football-data.org/v4/competitions/${competitionId}/matches`);
      console.log(`🔍 Filters applied:`, filters);
      
      const response = await apiClient.get(`/competitions/${competitionId}/matches`, { params: filters });
      
      console.log(`📡 Raw API Response (Competition ${competitionId} Matches):`, response);
      console.log(`📊 Competition ${competitionId} Matches Data:`, response.data);
      
      const matches = response.data.matches || [];
      if (matches.length > 0) {
        console.log(`⚽ Competition ${competitionId} Matches Analysis:`, {
          totalMatches: matches.length,
          homeWins: matches.filter(m => m.score?.winner === 'HOME_TEAM').length,
          awayWins: matches.filter(m => m.score?.winner === 'AWAY_TEAM').length,
          draws: matches.filter(m => m.score?.winner === 'DRAW').length,
          competitions: [...new Set(matches.map(m => m.competition?.name))],
          sampleMatches: matches.slice(0, 3).map(m => ({
            id: m.id,
            homeTeam: m.homeTeam?.name,
            awayTeam: m.awayTeam?.name,
            score: `${m.score?.fullTime?.home || '?'} - ${m.score?.fullTime?.away || '?'}`,
            date: m.utcDate,
            status: m.status,
            matchday: m.matchday
          }))
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (Competition ${competitionId} Matches):`, error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      throw error;
    }
  },

  // Get teams in a competition
  getCompetitionTeams: async (competitionId) => {
    try {
      console.log(`🌐 API Call: GET /competitions/${competitionId}/teams`);
      console.log(`📡 Request URL (via proxy): ${API_BASE_URL}/competitions/${competitionId}/teams`);
      console.log(`🔄 Proxied to: https://api.football-data.org/v4/competitions/${competitionId}/teams`);
      
      const response = await apiClient.get(`/competitions/${competitionId}/teams`);
      
      console.log(`📡 Raw API Response (Competition ${competitionId} Teams):`, response);
      console.log(`📊 Competition ${competitionId} Teams Data:`, response.data);
      
      const teams = response.data.teams || [];
      if (teams.length > 0) {
        console.log(`🏟️ Competition ${competitionId} Teams Analysis:`, {
          totalTeams: teams.length,
          teamsWithCrests: teams.filter(team => team.crest).length,
          teamsWithWebsites: teams.filter(team => team.website).length,
          teamsWithVenues: teams.filter(team => team.venue).length,
          sampleTeams: teams.slice(0, 3).map(team => ({
            id: team.id,
            name: team.name,
            shortName: team.shortName,
            tla: team.tla,
            crest: team.crest,
            venue: team.venue
          }))
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (Competition ${competitionId} Teams):`, error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      throw error;
    }
  },

  // Get competition seasons
  getCompetitionSeasons: async (competitionId) => {
    try {
      console.log(`🌐 API Call: GET /competitions/${competitionId}/seasons`);
      console.log(`📡 Request URL (via proxy): ${API_BASE_URL}/competitions/${competitionId}/seasons`);
      console.log(`🔄 Proxied to: https://api.football-data.org/v4/competitions/${competitionId}/seasons`);
      
      const response = await apiClient.get(`/competitions/${competitionId}/seasons`);
      
      console.log(`📡 Raw API Response (Competition ${competitionId} Seasons):`, response);
      console.log(`📊 Competition ${competitionId} Seasons Data:`, response.data);
      
      const seasons = response.data.seasons || [];
      if (seasons.length > 0) {
        console.log(`📅 Competition ${competitionId} Seasons Analysis:`, {
          totalSeasons: seasons.length,
          currentSeason: seasons.find(s => s.current),
          seasonsByYear: seasons.map(s => ({
            id: s.id,
            startDate: s.startDate,
            endDate: s.endDate,
            currentMatchday: s.currentMatchday,
            winner: s.winner?.name,
            isCurrent: s.current
          }))
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (Competition ${competitionId} Seasons):`, error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      throw error;
    }
  },

  // Get competition scorers (top scorers)
  getCompetitionScorers: async (competitionId, filters = {}) => {
    try {
      console.log(`🌐 API Call: GET /competitions/${competitionId}/scorers`);
      console.log(`📡 Request URL (via proxy): ${API_BASE_URL}/competitions/${competitionId}/scorers`);
      console.log(`🔄 Proxied to: https://api.football-data.org/v4/competitions/${competitionId}/scorers`);
      console.log(`🔍 Filters applied:`, filters);
      
      const response = await apiClient.get(`/competitions/${competitionId}/scorers`, { params: filters });
      
      console.log(`📡 Raw API Response (Competition ${competitionId} Scorers):`, response);
      console.log(`📊 Competition ${competitionId} Scorers Data:`, response.data);
      
      const scorers = response.data.scorers || [];
      if (scorers.length > 0) {
        console.log(`⚽ Competition ${competitionId} Scorers Analysis:`, {
          totalScorers: scorers.length,
          topScorer: scorers[0],
          topScorers: scorers.slice(0, 5).map(scorer => ({
            position: scorer.position,
            name: scorer.player.name,
            nationality: scorer.player.nationality,
            team: scorer.team.name,
            goals: scorer.goals,
            assists: scorer.assists,
            penalties: scorer.penalties
          }))
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (Competition ${competitionId} Scorers):`, error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      throw error;
    }
  },

  // Get competition matches by date range
  getCompetitionMatchesByDate: async (competitionId, dateFrom, dateTo) => {
    try {
      console.log(`🌐 API Call: GET /competitions/${competitionId}/matches with date range`);
      console.log(`📡 Request URL (via proxy): ${API_BASE_URL}/competitions/${competitionId}/matches`);
      console.log(`🔄 Proxied to: https://api.football-data.org/v4/competitions/${competitionId}/matches`);
      console.log(`📅 Date range: ${dateFrom} to ${dateTo}`);
      
      const filters = {
        dateFrom: dateFrom,
        dateTo: dateTo
      };
      
      const response = await apiClient.get(`/competitions/${competitionId}/matches`, { params: filters });
      
      console.log(`📡 Raw API Response (Competition ${competitionId} Matches by Date):`, response);
      console.log(`📊 Competition ${competitionId} Matches by Date Data:`, response.data);
      
      const matches = response.data.matches || [];
      console.log(`📅 Competition ${competitionId} Matches in Date Range:`, {
        dateFrom: dateFrom,
        dateTo: dateTo,
        totalMatches: matches.length,
        matchesByDate: matches.reduce((acc, match) => {
          const date = match.utcDate.split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {})
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (Competition ${competitionId} Matches by Date):`, error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      throw error;
    }
  },

  // Get all matches
  getAllMatches: async (filters = {}) => {
    try {
      console.log('🌐 API Call: GET /matches');
      console.log('🔑 Using API Key:', API_KEY.substring(0, 8) + '...');
      console.log('📡 Request URL (via proxy):', `${API_BASE_URL}/matches`);
      console.log('🔄 Proxied to: https://api.football-data.org/v4/matches');
      console.log('🔍 Filters applied:', filters);
      
      const response = await apiClient.get('/matches', { params: filters });
      
      console.log('📡 Raw API Response (All Matches):', response);
      console.log('📊 All Matches Response Data:', response.data);
      console.log('📈 All Matches Response Metadata:', {
        status: response.status,
        statusText: response.statusText,
        totalMatches: response.data.resultSet?.count,
        filters: response.data.filters,
        matchesCount: response.data.matches?.length
      });
      
      // Enhanced matches data analysis
      const matches = response.data.matches || [];
      console.log('⚽ All Matches Data Analysis:', {
        totalMatches: matches.length,
        matchesWithScores: matches.filter(match => match.score?.fullTime?.home !== null).length,
        matchesWithVenues: matches.filter(match => match.venue).length,
        matchesWithAttendance: matches.filter(match => match.attendance).length,
        matchesWithReferees: matches.filter(match => match.referees && match.referees.length > 0).length,
        matchesWithOdds: matches.filter(match => match.odds?.homeWin).length
      });
      
      // Sample match structure
      if (matches.length > 0) {
        const sampleMatch = matches[0];
        console.log('⚽ Sample Match Structure:', {
          id: sampleMatch.id,
          homeTeam: sampleMatch.homeTeam?.name,
          awayTeam: sampleMatch.awayTeam?.name,
          score: sampleMatch.score?.fullTime,
          status: sampleMatch.status,
          date: sampleMatch.utcDate,
          competition: sampleMatch.competition?.name,
          area: sampleMatch.area?.name,
          venue: sampleMatch.venue,
          attendance: sampleMatch.attendance,
          matchday: sampleMatch.matchday,
          stage: sampleMatch.stage
        });
        
        // Log competition information if available
        if (sampleMatch.competition) {
          console.log('🏆 Sample Match Competition:', {
            competitionId: sampleMatch.competition.id,
            competitionName: sampleMatch.competition.name,
            competitionCode: sampleMatch.competition.code,
            competitionType: sampleMatch.competition.type,
            hasEmblem: !!sampleMatch.competition.emblem
          });
        }
        
        // Log area information if available
        if (sampleMatch.area) {
          console.log('🌍 Sample Match Area:', {
            areaId: sampleMatch.area.id,
            areaName: sampleMatch.area.name,
            areaCode: sampleMatch.area.code,
            hasFlag: !!sampleMatch.area.flag
          });
        }
      }
      
      // Matches by status analysis
      const matchesByStatus = matches.reduce((acc, match) => {
        acc[match.status] = (acc[match.status] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Matches by Status:', matchesByStatus);
      
      // Matches by competition analysis
      const matchesByCompetition = matches.reduce((acc, match) => {
        if (match.competition) {
          acc[match.competition.name] = (acc[match.competition.name] || 0) + 1;
        }
        return acc;
      }, {});
      
      console.log('🏆 Matches by Competition:', matchesByCompetition);
      
      // Matches by area analysis
      const matchesByArea = matches.reduce((acc, match) => {
        if (match.area) {
          acc[match.area.name] = (acc[match.area.name] || 0) + 1;
        }
        return acc;
      }, {});
      
      console.log('🌍 Matches by Area:', matchesByArea);
      
      // Matches with scores
      const matchesWithScores = matches.filter(match => match.score?.fullTime?.home !== null);
      console.log('⚽ Matches with Scores:', matchesWithScores.length);
      console.log('⚽ Sample Matches with Scores:', matchesWithScores.slice(0, 3).map(match => ({
        homeTeam: match.homeTeam?.name,
        awayTeam: match.awayTeam?.name,
        score: `${match.score?.fullTime?.home || '?'} - ${match.score?.fullTime?.away || '?'}`,
        status: match.status,
        competition: match.competition?.name
      })));
      
      // Log all matches with their key information
      console.log('📋 Complete All Matches List:', matches.map(match => ({
        id: match.id,
        homeTeam: match.homeTeam?.name,
        awayTeam: match.awayTeam?.name,
        score: match.score?.fullTime,
        status: match.status,
        date: match.utcDate,
        competition: match.competition?.name,
        area: match.area?.name,
        venue: match.venue,
        attendance: match.attendance,
        matchday: match.matchday,
        stage: match.stage,
        hasLineup: !!(match.homeTeam?.lineup && match.homeTeam.lineup.length > 0),
        hasBench: !!(match.homeTeam?.bench && match.homeTeam.bench.length > 0)
      })));
      
      return response.data;
    } catch (error) {
      console.error('❌ API Error (All Matches):', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      console.error('❌ Error Headers:', error.response?.headers);
      throw error;
    }
  },




};

export default footballApi; 