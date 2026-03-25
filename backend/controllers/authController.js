const jwt = require('jsonwebtoken');
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let regNo = undefined;
    if (user.role === "student") {
      const Student = require("../models/Student");
      const studentDoc = await Student.findOne({ email: user.email });
      if (studentDoc) regNo = studentDoc.regNo;
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, regNo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(regNo && { regNo })
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, facultyRegNo } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["admin", "faculty", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Only include facultyRegNo if role is faculty
    const userData = { name, email, password, role };
    if (role === "faculty") {
      userData.facultyRegNo = facultyRegNo;
    }
    const user = await User.create(userData);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.role === "faculty" && { facultyRegNo: user.facultyRegNo })
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: "faculty" });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty", error: error.message });
  }
};

// allow admin to remove a faculty member by id
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    // Remove by id only
    const faculty = await User.findOneAndDelete({ _id: id, role: "faculty" });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }
    res.json({ message: "Faculty member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting faculty", error: error.message });
  }
};

// allow admin to update a faculty member by id
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, facultyRegNo } = req.body;
    // Find faculty by id (not by email)
    const faculty = await User.findOne({ _id: id, role: "faculty" });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }
    if (name !== undefined) faculty.name = name;
    if (email !== undefined) faculty.email = email;
    if (facultyRegNo !== undefined) faculty.facultyRegNo = facultyRegNo;
    if (password) faculty.password = password; // Will be hashed by pre-save hook
    await faculty.save();
    res.json({ message: "Faculty member updated successfully", faculty });
  } catch (error) {
    res.status(500).json({ message: "Error updating faculty", error: error.message });
  }
};