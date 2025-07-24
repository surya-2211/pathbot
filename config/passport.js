const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User'); // adjust path as needed

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const existing = await User.findOne({ googleId: profile.id });

  if (existing) return done(null, existing);

  const newUser = await User.create({
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    // optionally assign default role or XP
  });

  done(null, newUser);
}));
