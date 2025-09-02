const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Development proxy for local development
  app.use(
    '/api/v4',
    createProxyMiddleware({
      target: 'https://api.football-data.org',
      changeOrigin: true,
      pathRewrite: {
        '^/api/v4': '/v4',
      },
      onProxyReq: (proxyReq, req, res) => {
        // Add the API key to the proxied request
        proxyReq.setHeader('X-Auth-Token', 'f0feb9b1c09c4788931d390d46c8bd8d');
        console.log(`🔄 Proxying ${req.method} ${req.url} to football API`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ Received response: ${proxyRes.statusCode} for ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ Proxy error for ${req.url}:`, err.message);
      }
    })
  );

  // Proxy for the serverless function during development (optional)
  app.use(
    '/api/football-proxy',
    createProxyMiddleware({
      target: 'http://localhost:3001', // Local serverless function
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Proxying to local serverless function: ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ Local proxy error:`, err.message);
        // Fallback to direct API call if local proxy fails
        console.log('🔄 Falling back to direct API call...');
      }
    })
  );
};
