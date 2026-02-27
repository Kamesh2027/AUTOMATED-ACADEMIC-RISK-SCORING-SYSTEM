const router = require("express").Router();
const {
  getStudents,
  getStudentByEmail,
  updateMarks,
  addStudent,
  deleteStudent,
  updateStudent // Add updateStudent
} = require("../controllers/studentController");

router.get("/", getStudents);
router.get("/email/:email", getStudentByEmail);
router.post("/", addStudent);
router.put("/:id", updateStudent); // Use updateStudent for general updates
router.patch("/:id/marks", updateMarks); // Use PATCH for marks only
router.delete("/:id", deleteStudent);

module.exports = router;
