# NextAuth SSO Setup Guide for Dashdig

This guide provides step-by-step instructions for setting up OAuth authentication with Google, Apple, and Facebook for the Dashdig frontend.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Google OAuth Setup](#google-oauth-setup)
- [Apple OAuth Setup](#apple-oauth-setup)
- [Facebook OAuth Setup](#facebook-oauth-setup)
- [MongoDB Collections](#mongodb-collections)
- [Testing](#testing)
- [Deployment](#deployment)

## Prerequisites

1. MongoDB Atlas account with connection string
2. Google Cloud Platform account
3. Apple Developer account ($99/year)
4. Facebook Developer account
5. Node.js 18+ installed

## Environment Variables

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: Dashdig
   - User support email: your-email@example.com
   - Authorized domains: dashdig.com
   - Developer contact: your-email@example.com

### 2. Configure OAuth Client ID

1. Application type: **Web application**
2. Name: Dashdig Production
3. Authorized JavaScript origins:
   - `https://dashdig.com`
   - `http://localhost:3000` (for local development)
4. Authorized redirect URIs:
   - `https://dashdig.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local development)
5. Click **Create**
6. Copy **Client ID** and **Client Secret**

### 3. Add to Environment Variables

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
```

## Apple OAuth Setup

### 1. Create App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list)
2. Click **+** to create new identifier
3. Select **App IDs** > Continue
4. Select **App** > Continue
5. Description: Dashdig
6. Bundle ID: com.dashdig.app
7. Check **Sign in with Apple**
8. Click **Continue** > **Register**

### 2. Create Services ID

1. Click **+** to create new identifier
2. Select **Services IDs** > Continue
3. Description: Dashdig Web
4. Identifier: com.dashdig.web
5. Check **Sign in with Apple**
6. Click **Configure**:
   - Primary App ID: com.dashdig.app
   - Domains: dashdig.com
   - Return URLs: `https://dashdig.com/api/auth/callback/apple`
7. Click **Continue** > **Register**

### 3. Create Private Key

1. Go to **Keys** section
2. Click **+** to create new key
3. Key Name: Dashdig Sign in with Apple
4. Check **Sign in with Apple**
5. Configure > Select Primary App ID > Save
6. Click **Continue** > **Register**
7. **Download** the key file (.p8) - you can only download once!
8. Note the **Key ID**

### 4. Get Team ID

1. Go to [Membership](https://developer.apple.com/account/#/membership/)
2. Copy your **Team ID**

### 5. Format Private Key

Open the downloaded .p8 file and copy the contents:

```env
APPLE_CLIENT_ID=com.dashdig.web
APPLE_TEAM_ID=YOUR10DIGIT
APPLE_KEY_ID=YOUR10KEYID
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
...your key content...
-----END PRIVATE KEY-----"
```

**Important:** Use literal `\n` in the environment variable, our code handles the conversion.

## Facebook OAuth Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select **Consumer** > Continue
4. Display Name: Dashdig
5. App Contact Email: your-email@example.com
6. Click **Create App**

### 2. Add Facebook Login

1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** > Click **Set Up**
3. Select **Web** platform
4. Site URL: `https://dashdig.com`
5. Click **Save** > **Continue**

### 3. Configure OAuth Settings

1. Go to **Facebook Login** > **Settings**
2. Valid OAuth Redirect URIs:
   - `https://dashdig.com/api/auth/callback/facebook`
   - `http://localhost:3000/api/auth/callback/facebook` (for local development)
3. Click **Save Changes**

### 4. Get App Credentials

1. Go to **Settings** > **Basic**
2. Copy **App ID** and **App Secret**

### 5. Add to Environment Variables

```env
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

### 6. Switch to Live Mode (Production)

1. Complete all required App Review items
2. Toggle app from Development to Live mode
3. Add Privacy Policy URL
4. Add Terms of Service URL

## MongoDB Collections

NextAuth will automatically create these collections:

- **users**: User profile data
  - `_id`, `name`, `email`, `emailVerified`, `image`, `provider`
- **accounts**: OAuth account linkage
  - `userId`, `provider`, `providerAccountId`, `access_token`, `refresh_token`
- **sessions**: Session data (if using database sessions)
- **verification_tokens**: Email verification tokens

No manual setup required - collections are auto-created on first use.

## Testing

### Local Testing

1. Start the development server:
```bash
cd frontend
npm run dev
```

2. Navigate to `http://localhost:3000/auth/signin`

3. Test each OAuth provider:
   - Click "Continue with Google"
   - Click "Continue with Apple"
   - Click "Continue with Facebook"

4. Verify:
   - Successful redirect to `/dashboard`
   - User data stored in MongoDB
   - Session persists on refresh

### Test Cases

- [x] Sign in with Google
- [x] Sign in with Apple
- [x] Sign in with Facebook
- [x] Sign out and sign back in
- [x] Account merging (same email, different provider)
- [x] Error handling (cancelled auth, network errors)
- [x] Session persistence across page refresh
- [x] Cross-device session (sign in on different devices)

### Verify MongoDB Data

```javascript
// Connect to MongoDB and check users collection
db.users.find().pretty()
db.accounts.find().pretty()
```

## Deployment

### Railway Deployment

Add all environment variables to Railway dashboard:

1. Go to your Railway project
2. Navigate to **Variables** tab
3. Add each variable from `.env.local`
4. Click **Deploy**

### Vercel Deployment

Add environment variables to Vercel:

1. Go to your Vercel project
2. Navigate to **Settings** > **Environment Variables**
3. Add each variable:
   - `NEXTAUTH_URL`: `https://dashdig.com`
   - `NEXTAUTH_SECRET`: (your generated secret)
   - `MONGODB_URI`: (your connection string)
   - All OAuth credentials
4. Redeploy the application

## Security Checklist

- [x] NEXTAUTH_SECRET is a strong random string (32+ characters)
- [x] MongoDB connection string uses strong password
- [x] OAuth redirect URIs only include production domains
- [x] CSRF protection enabled (default in NextAuth)
- [x] Secure cookies enabled in production (sameSite: 'lax')
- [x] Email verification recommended for production
- [x] Rate limiting on auth endpoints (implement if needed)

## Troubleshooting

### "Email already in use" Error
- This happens when trying to sign in with a different provider using the same email
- Solution: Account linking is handled automatically in callbacks

### "Authentication cancelled" Error
- User closed OAuth popup or denied permissions
- Solution: This is expected behavior, user can retry

### "Network error" Error
- Check internet connection
- Verify OAuth credentials are correct
- Check Railway/Vercel logs for backend errors

### OAuth Callback Errors
- Verify redirect URIs match exactly (https vs http, trailing slash)
- Check that OAuth app is in production mode (not development)
- Verify environment variables are set correctly

## Support

For issues or questions:
- Check NextAuth.js docs: https://next-auth.js.org/
- Review provider-specific docs
- Open an issue in the repository

---

**Last Updated:** November 2025
**NextAuth Version:** 4.x
**Next.js Version:** 15.x
