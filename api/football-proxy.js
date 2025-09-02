const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Auth-Token');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { path, ...queryParams } = req.query;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    // Construct the full URL
    const baseUrl = 'https://api.football-data.org/v4';
    const url = `${baseUrl}/${path}`;
    
    // Get API key from environment variable or use a default one
    const apiKey = process.env.FOOTBALL_DATA_API_KEY || 'f0feb9b1c09c4788931d390d46c8bd8d';
    
    console.log(`🔄 Proxying request to: ${url}`);
    console.log(`🔑 Using API Key: ${apiKey.substring(0, 8)}...`);
    
    // Make the request to the football API
    const response = await axios({
      method: req.method,
      url: url,
      params: queryParams,
      headers: {
        'X-Auth-Token': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 25000, // 25 second timeout
    });

    console.log(`✅ Success: ${response.status} - ${response.statusText}`);
    
    // Return the response data
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('❌ Proxy Error:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('❌ Error Response:', error.response.data);
      console.error('❌ Error Status:', error.response.status);
      
      res.status(error.response.status).json({
        error: 'API Error',
        message: error.response.data?.message || error.message,
        status: error.response.status
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('❌ No Response Received');
      
      res.status(504).json({
        error: 'Gateway Timeout',
        message: 'No response received from the football API',
        status: 504
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('❌ Request Setup Error:', error.message);
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error setting up the request',
        status: 500
      });
    }
  }
};
