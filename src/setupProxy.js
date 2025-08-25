const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.football-data.org',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding to target
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔄 Proxying request:', req.method, req.url);
        console.log('🎯 Target:', 'https://api.football-data.org' + req.url.replace('/api', ''));
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ Proxy response status:', proxyRes.statusCode);
        console.log('📡 Response headers:', proxyRes.headers);
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy error:', err.message);
      }
    })
  );
}; 