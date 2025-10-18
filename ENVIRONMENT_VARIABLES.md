# Environment Variables Configuration

## Railway Backend Environment Variables

Set these variables in your Railway dashboard (Project → Variables):

### Required Variables
```bash
# Database
MONGODB_URI=mongodb+srv://dashdig:2acSHrtrjM5it3V2@dashdig-cluster.n8pizvn.mongodb.net/?retryWrites=true&w=majority&appName=dashdig-cluster

# Frontend URL (CRITICAL for proper URL generation)
FRONTEND_URL=https://dashdig.com

# Base URL (CRITICAL for shortened URLs)
BASE_URL=https://dashdig.com

# Environment
NODE_ENV=production

# Redis (Optional - for caching)
REDIS_URL=redis://default:JvSfYTBvHdFaaqtcSPfUGodMduYVFoQM@maglev.proxy.rlwy.net:21309

# Port (Auto-assigned by Railway)
PORT=<auto-assigned-by-railway>
```

### Optional Variables
```bash
# Email Service (Optional)
RESEND_API_KEY=<your-resend-api-key>

# SMS Service (Optional)
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-token>
TWILIO_PHONE_NUMBER=<your-twilio-number>

# Payment Processing (Optional)
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```

## Vercel Frontend Environment Variables

Set these in your Vercel dashboard (Project → Settings → Environment Variables):

### Required Variables
```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://dashdig-backend-production.up.railway.app
```

## Critical Notes

1. **BASE_URL is ESSENTIAL**: Without this, shortened URLs will use the Railway backend domain instead of dashdig.com
2. **FRONTEND_URL**: Used for CORS configuration and frontend-backend communication
3. **MONGODB_URI**: Must point to your production MongoDB Atlas cluster
4. **NODE_ENV=production**: Ensures proper error handling and optimization

## Verification Steps

After setting environment variables:

1. **Check Railway Logs**: Look for "✅ MongoDB connected" and "✅ Redis Connected"
2. **Test URL Creation**: Create a short URL and verify it uses dashdig.com domain
3. **Test URL Resolution**: Visit the short URL and ensure it redirects properly
4. **Check CORS**: Verify frontend can communicate with backend without CORS errors

## Troubleshooting

### "URL not found" Error
- Verify BASE_URL is set to https://dashdig.com
- Check MONGODB_URI is correct
- Ensure database contains the URL records

### CORS Errors
- Verify FRONTEND_URL includes https://dashdig.com
- Check NEXT_PUBLIC_API_URL points to correct Railway backend

### Redis Connection Issues
- Redis is optional - app will work without it
- Check REDIS_URL format if using Redis
- Look for "⚠️ Redis connection failed" in logs (non-fatal)
