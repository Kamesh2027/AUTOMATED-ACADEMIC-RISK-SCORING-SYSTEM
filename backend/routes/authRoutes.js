const router = require("express").Router();
const passport = require("passport");
const { login, register, getFaculty, deleteFaculty, oauthCallback } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/faculty", getFaculty);
// remove a faculty member (admin only)
router.delete("/faculty/:id", deleteFaculty);

// Google OAuth routes - only if OAuth is configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false
    }),
    oauthCallback
  );
} else {
  // Return error if OAuth is not configured
  router.get("/google", (req, res) => {
    res.status(503).json({ message: "OAuth is not configured on this server" });
  });
  
  router.get("/google/callback", (req, res) => {
    res.status(503).json({ message: "OAuth is not configured on this server" });
  });
}

module.exports = router;
