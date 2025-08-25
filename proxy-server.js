const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['https://heshamibrahem1999.github.io', 'http://localhost:3000'],
  credentials: true
}));

// Proxy middleware
app.use('/api', async (req, res) => {
  try {
    const targetUrl = `https://api.football-data.org${req.url}`;
    
    console.log(`🔄 Proxying request to: ${targetUrl}`);
    
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        'X-Auth-Token': 'f0feb9b1c09c4788931d390d46c8bd8d',
        'Content-Type': 'application/json',
        ...req.headers
      },
      data: req.body,
      params: req.query
    });
    
    console.log(`✅ Proxy response status: ${response.status}`);
    
    // Forward the response
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: https://heshamibrahem1999.github.io`);
});
