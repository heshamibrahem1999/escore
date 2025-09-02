@echo off
echo 🚀 Deploying Football API Proxy...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Navigate to API directory
cd api

echo 📦 Installing dependencies...
npm install

echo 🌐 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🔗 Update your React app with the new proxy URL
echo 📝 Check DEPLOYMENT.md for detailed instructions

pause
