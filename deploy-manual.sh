#!/bin/bash

echo "🚀 Manual Railway Deployment Script"
echo "=================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "📁 Changing to backend directory..."
cd backend

echo "🔐 Please login to Railway..."
echo "This will open a browser window for authentication"
railway login

echo "🔗 Linking to Railway project..."
echo "Please select your empty Railway project when prompted"
railway link

echo "🚀 Deploying to Railway..."
railway up --detach

echo "✅ Deployment complete!"
echo "Your backend should now be running with the improved AI code"
echo "Test it with: curl -X POST 'https://your-railway-url/test-slug' -H 'Content-Type: application/json' -d '{\"url\":\"https://delivery.publix.com/landing?product_id=123\"}'"

