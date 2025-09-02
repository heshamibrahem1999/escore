#!/bin/bash

echo "🚀 Deploying Football API Proxy..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to API directory
cd api

echo "📦 Installing dependencies..."
npm install

echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Update your React app with the new proxy URL"
echo "📝 Check DEPLOYMENT.md for detailed instructions"
