const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

// Get all faculty
router.get("/", facultyController.getAllFaculty);

// Get a single faculty by ID
router.get("/:id", facultyController.getFacultyById);

// Create a new faculty
router.post("/", facultyController.createFaculty);

// Update a faculty
router.put("/:id", facultyController.updateFaculty);

// Delete a faculty
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;
