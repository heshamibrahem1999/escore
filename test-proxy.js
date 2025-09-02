const axios = require('axios');

// Test the proxy endpoint
async function testProxy() {
  try {
    console.log('🧪 Testing Football API Proxy...');
    
    // Replace with your actual proxy URL
    const proxyUrl = 'https://your-vercel-app.vercel.app/api/football-proxy';
    
    console.log(`📡 Testing endpoint: ${proxyUrl}`);
    
    // Test getting teams
    const response = await axios.get(`${proxyUrl}?path=teams`);
    
    console.log('✅ Proxy test successful!');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📈 Response data keys: ${Object.keys(response.data)}`);
    console.log(`🏟️ Total teams: ${response.data.teams?.length || 'N/A'}`);
    
    if (response.data.teams && response.data.teams.length > 0) {
      const firstTeam = response.data.teams[0];
      console.log(`⚽ First team: ${firstTeam.name} (${firstTeam.tla})`);
    }
    
  } catch (error) {
    console.error('❌ Proxy test failed:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testProxy();
