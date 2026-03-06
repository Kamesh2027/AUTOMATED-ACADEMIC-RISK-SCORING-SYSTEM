const Faculty = require("../models/Faculty");

// Get all faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty", error: error.message });
  }
};

// Get a single faculty by ID
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty", error: error.message });
  }
};

// Create a new faculty
exports.createFaculty = async (req, res) => {
  try {
    const { name, facultyRegNo, email } = req.body;
    const faculty = await Faculty.create({ name, facultyRegNo, email });
    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error creating faculty", error: error.message });
  }
};

// Update a faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { name, facultyRegNo, email } = req.body;
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { name, facultyRegNo, email },
      { new: true }
    );
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error updating faculty", error: error.message });
  }
};

// Delete a faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting faculty", error: error.message });
  }
};
