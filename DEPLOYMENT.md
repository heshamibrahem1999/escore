# Football API Serverless Proxy Deployment Guide

## Overview
This project now includes a serverless proxy to handle CORS issues when calling the football API from your React app.

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy the API:**
   ```bash
   cd api
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Choose your team/account
   - Deploy

4. **Update your React app:**
   - Replace `https://your-vercel-app.vercel.app` in `src/api/footballApi.js` with your actual Vercel URL
   - The URL will look like: `https://your-project-name.vercel.app/api/football-proxy`

### Option 2: Deploy to Netlify Functions

1. **Create `netlify.toml` in the root:**
   ```toml
   [build]
     functions = "api"
     publish = "build"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. **Deploy to Netlify:**
   - Push to GitHub
   - Connect your repo to Netlify
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Update the API URL in your React app to:**
   `https://your-app.netlify.app/api/football-proxy`

### Option 3: Deploy to AWS Lambda

1. **Install Serverless Framework:**
   ```bash
   npm i -g serverless
   ```

2. **Create `serverless.yml`:**
   ```yaml
   service: football-proxy
   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1
   
   functions:
     proxy:
       handler: api/football-proxy.handler
       events:
         - http:
             path: api/football-proxy/{proxy+}
             method: ANY
             cors: true
   ```

3. **Deploy:**
   ```bash
   serverless deploy
   ```

## Environment Variables

Set these in your deployment platform:

- `FOOTBALL_DATA_API_KEY`: Your football-data.org API key (optional, will use default if not set)

## Testing the Proxy

Test your proxy endpoint:
```bash
curl "https://your-domain.com/api/football-proxy?path=teams"
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your proxy is properly deployed and accessible
2. **Timeout Errors**: The proxy has a 25-second timeout
3. **API Key Issues**: Check that your football API key is valid

### Debug Mode:

The proxy logs all requests and responses. Check your deployment platform's logs for debugging information.

## Security Notes

- The proxy is configured to allow all origins (`*`) for CORS
- API keys are handled server-side
- Consider adding rate limiting for production use
- The proxy has a 25-second timeout to prevent hanging requests
