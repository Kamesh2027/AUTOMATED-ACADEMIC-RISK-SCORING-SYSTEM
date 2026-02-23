const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

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

// Google OAuth Strategy - only configure if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // User exists, return the user
            return done(null, user);
          }

          // Create new user if doesn't exist
          // Default role for new OAuth users is 'student'
          // You can customize this logic based on email domain or other criteria
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "oauth_" + Math.random().toString(36).substring(7), // Random password for OAuth users
            role: "student", // Default role
            googleId: profile.id
          });

          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  console.log("✓ Google OAuth strategy configured");
} else {
  console.log("⚠ Google OAuth credentials not found - OAuth login disabled");
}

module.exports = passport;
