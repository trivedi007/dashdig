const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? 'https://dashdig-production.up.railway.app/api/auth/google/callback'
      : 'http://localhost:5002/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Check if email exists (link accounts)
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Link Google to existing account
          user.googleId = profile.id;
          user.provider = 'google';
          if (profile.photos && profile.photos[0]) {
            user.profile.avatar = profile.photos[0].value;
          }
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            identifier: profile.emails[0].value,
            profile: {
              name: profile.displayName,
              avatar: profile.photos[0]?.value
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
        }
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
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
