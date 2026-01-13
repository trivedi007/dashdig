const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? 'https://dashdig-production.up.railway.app/api/auth/google/callback'
      : 'http://localhost:5002/api/auth/google/callback',
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Debug: Log what Google returns
      console.log('[GOOGLE OAUTH] Profile received:', JSON.stringify({
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
        photos: profile.photos,
        _json: profile._json
      }, null, 2));

      // Get email with fallback logic
      const userEmail = profile.emails?.[0]?.value || 
                        profile._json?.email || 
                        profile.email;
      
      console.log('[GOOGLE OAUTH] Extracted email:', userEmail);

      // Validate email exists
      if (!userEmail) {
        console.error('[GOOGLE OAUTH] No email found in profile!');
        return done(new Error('No email provided by Google. Please ensure your Google account has a verified email.'), null);
      }

      // Check if user exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Check if email exists (link accounts)
        user = await User.findOne({ email: userEmail });
        
        if (user) {
          // Link Google to existing account
          console.log('[GOOGLE OAUTH] Linking Google to existing account:', userEmail);
          user.googleId = profile.id;
          user.provider = 'google';
          if (profile.photos && profile.photos[0]) {
            user.profile.avatar = profile.photos[0].value;
          }
          user.emailVerified = true;
          user.isVerified = true;
          
          // Ensure identifier exists (for users created before this field was required)
          if (!user.identifier) {
            console.log('[GOOGLE OAUTH] Setting identifier for existing user:', userEmail);
            user.identifier = userEmail;
          }
          
          await user.save();
        } else {
          // Create new user
          console.log('[GOOGLE OAUTH] Creating new user:', userEmail);
          user = await User.create({
            googleId: profile.id,
            email: userEmail,
            identifier: userEmail,
            profile: {
              name: profile.displayName || 'Google User',
              avatar: profile.photos?.[0]?.value
            },
            provider: 'google',
            subscription: {
              plan: 'free',
              status: 'active'
            },
            emailVerified: true, // Google accounts are pre-verified
            isVerified: true,
            isActive: true
          });
          console.log('[GOOGLE OAUTH] User created successfully:', user._id);
        }
      } else {
        console.log('[GOOGLE OAUTH] Existing user found:', user.email);
      }
      
      return done(null, user);
    } catch (error) {
      console.error('[GOOGLE OAUTH] Error:', error.message);
      console.error('[GOOGLE OAUTH] Stack:', error.stack);
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
