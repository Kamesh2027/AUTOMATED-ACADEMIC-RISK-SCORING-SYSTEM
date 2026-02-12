const router = require("express").Router();
const {
  getStudents,
  getStudentByEmail,
  updateMarks,
  addStudent,
  deleteStudent
} = require("../controllers/studentController");

router.get("/", getStudents);
router.get("/email/:email", getStudentByEmail);
router.post("/", addStudent);
router.put("/:id", updateMarks);
router.delete("/:id", deleteStudent);

module.exports = router;
