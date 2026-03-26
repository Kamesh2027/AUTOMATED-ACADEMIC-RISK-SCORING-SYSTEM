const router = require("express").Router();
const {
  getStudents,
  getStudentByEmail,
  updateMarks,
  addStudent,
  deleteStudent,
  updateStudent // Add updateStudent
  ,exportStudentsExcel
} = require("../controllers/studentController");

router.get("/", getStudents);
router.get("/email/:email", getStudentByEmail);
router.post("/", addStudent);
router.put("/:id", updateStudent); // Use updateStudent for general updates
router.patch("/:id/marks", updateMarks); // Use PATCH for marks only
router.delete("/:id", deleteStudent);

// Admin-only: Export all students to Excel
const authMiddleware = require("../middleware/authMiddleware");
router.get("/export/excel", authMiddleware, exportStudentsExcel);

module.exports = router;
