# Environment Variables Template for Google SSO

## Create .env.local file with these variables:

```bash
# ==============================================
# GOOGLE OAUTH CREDENTIALS (REQUIRED FOR SSO)
# ==============================================
# Get these from: https://console.cloud.google.com/

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ==============================================
# NEXTAUTH CONFIGURATION
# ==============================================
# Generate with: openssl rand -base64 32

NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# ==============================================
# MONGODB CONNECTION
# ==============================================

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dashdig?retryWrites=true&w=majority

# ==============================================
# BACKEND API URL
# ==============================================

NEXT_PUBLIC_API_URL=https://dashdig-production.up.railway.app

# ==============================================
# GEMINI AI (OPTIONAL)
# ==============================================

NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

## Quick Setup Commands

```bash
# 1. Generate NextAuth secret
openssl rand -base64 32

# 2. Create .env.local
cd frontend
touch .env.local

# 3. Copy template above into .env.local
# 4. Replace placeholders with actual values
# 5. Restart dev server
npm run dev
```

## Authorized Redirect URIs for Google OAuth

Add these in Google Cloud Console:

**Development:**
```
http://localhost:3000/api/auth/callback/google
```

**Production:**
```
https://dashdig.com/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google
```

---

**See GOOGLE_SSO_SETUP_GUIDE.md for complete setup instructions**

