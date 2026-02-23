const router = require("express").Router();
const passport = require("passport");
const { login, register, getFaculty, deleteFaculty, oauthCallback } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/faculty", getFaculty);
// remove a faculty member (admin only)
router.delete("/faculty/:id", deleteFaculty);

// Google OAuth routes
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

module.exports = router;
