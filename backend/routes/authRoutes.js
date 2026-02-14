const router = require("express").Router();
const { login, register, getFaculty, deleteFaculty } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/faculty", getFaculty);
// remove a faculty member (admin only)
router.delete("/faculty/:id", deleteFaculty);

module.exports = router;
