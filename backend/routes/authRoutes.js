const router = require("express").Router();
const { login, register, getFaculty, deleteFaculty, updateFaculty } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/faculty", getFaculty);
// update a faculty member (admin only)
router.put("/faculty/:id", updateFaculty);
// remove a faculty member (admin only)
router.delete("/faculty/:id", deleteFaculty);

module.exports = router;
