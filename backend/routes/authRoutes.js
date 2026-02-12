const router = require("express").Router();
const { login, register, getFaculty } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/faculty", getFaculty);

module.exports = router;
