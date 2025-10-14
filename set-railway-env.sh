#!/bin/bash

echo "🚀 Setting up Railway environment variables for Dashdig backend..."

# Navigate to backend directory
cd /Users/narendra/AI-ML/Business-Ideas/Dashdig/backend || { echo "Failed to navigate to backend directory"; exit 1; }

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Login to Railway (if not already logged in)
echo "🔐 Logging into Railway..."
railway login --browserless || { echo "Railway login failed. Please ensure you are authenticated."; exit 1; }

# Link to the Railway project
echo "🔗 Linking to Railway project..."
# Prompt user for project ID
read -p "Enter your Railway Project ID (e.g., 3dfec1e9-8bad-46be-ac4c-76cde6332f95): " RAILWAY_PROJECT_ID

if [ -z "$RAILWAY_PROJECT_ID" ]; then
    echo "Project ID cannot be empty. Exiting."
    exit 1
fi

# Use railway link with the provided project ID
railway link --project "$RAILWAY_PROJECT_ID" || { echo "Railway link failed. Ensure the Project ID is correct and you have access."; exit 1; }

echo "📝 Setting environment variables..."

# Set MongoDB URI
echo "Setting MONGODB_URI..."
railway variables set MONGODB_URI="mongodb+srv://dashdig:2acSHrtrjM5it3V2@dashdig-cluster.n8pizvn.mongodb.net/dashdig?retryWrites=true&w=majority&appName=dashdig-cluster"

# Set JWT Secret
echo "Setting JWT_SECRET..."
railway variables set JWT_SECRET="dashdig-super-secret-jwt-key-2024"

# Set Frontend URL
echo "Setting FRONTEND_URL..."
railway variables set FRONTEND_URL="https://dashdig.com"

# Set Base URL
echo "Setting BASE_URL..."
railway variables set BASE_URL="https://dashdig.com"

# Set Resend API Key (for email)
echo "Setting RESEND_API_KEY..."
railway variables set RESEND_API_KEY="re_1234567890abcdef"

# Set OpenAI API Key (for AI slug generation)
echo "Setting OPENAI_API_KEY..."
railway variables set OPENAI_API_KEY="sk-1234567890abcdef"

# Set Twilio credentials (optional - for SMS)
echo "Setting Twilio credentials..."
railway variables set TWILIO_ACCOUNT_SID="AC1234567890abcdef"
railway variables set TWILIO_AUTH_TOKEN="1234567890abcdef"
railway variables set TWILIO_PHONE_NUMBER="+1234567890"

# Set Stripe credentials (optional - for payments)
echo "Setting Stripe credentials..."
railway variables set STRIPE_SECRET_KEY="sk_test_1234567890abcdef"
railway variables set STRIPE_PUBLISHABLE_KEY="pk_test_1234567890abcdef"
railway variables set STRIPE_WEBHOOK_SECRET="whsec_1234567890abcdef"

# Set Redis URL (optional - for caching)
echo "Setting REDIS_URL..."
railway variables set REDIS_URL="redis://localhost:6379"

# Set Node Environment
echo "Setting NODE_ENV..."
railway variables set NODE_ENV="production"

echo "✅ Environment variables set successfully!"
echo ""
echo "📋 Summary of variables set:"
echo "  - MONGODB_URI: MongoDB connection string"
echo "  - JWT_SECRET: JWT signing secret"
echo "  - FRONTEND_URL: Frontend URL (https://dashdig.com)"
echo "  - BASE_URL: Base URL (https://dashdig.com)"
echo "  - RESEND_API_KEY: Email service API key"
echo "  - OPENAI_API_KEY: AI service API key"
echo "  - TWILIO_*: SMS service credentials"
echo "  - STRIPE_*: Payment service credentials"
echo "  - REDIS_URL: Redis connection string"
echo "  - NODE_ENV: production"
echo ""
echo "🚀 Now you can deploy with: railway up --detach"
echo "Or the deployment will automatically restart with the new variables."

