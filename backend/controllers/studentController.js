const Student = require("../models/Student");
const User = require("../models/User");
const Feedback = require("../models/Feedback"); // Add Feedback model
const { calculateRisk } = require("../utils/riskCalculator");

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("userId lastUpdatedBy");

    const updated = await Promise.all(
      students.map(async (s) => {
        const { score, riskLevel } = await calculateRisk(
          s.attendance,
          s.marks,
          s.assignments
        );

        s.score = score;
        s.riskLevel = riskLevel;
        // Automated risk alert logic
        const riskThreshold = 70;
        s.riskAlert = score < riskThreshold;
        await s.save();

        return s;
      })
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};

exports.getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await Student.findOne({ email }).populate("userId lastUpdatedBy");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { score, riskLevel } = await calculateRisk(
      student.attendance,
      student.marks,
      student.assignments
    );

    student.score = score;
    student.riskLevel = riskLevel;
    // Automated risk alert logic
    const riskThreshold = 70;
    student.riskAlert = score < riskThreshold;
    await student.save();

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error: error.message });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const { name, email, regNo, attendance, marks, assignments } = req.body;

    if (!name || !email || !regNo) {
      return res.status(400).json({ message: "Name, email, and regNo are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingStudent = await Student.findOne({ $or: [{ email }, { regNo }] });
    if (existingStudent) {
      return res.status(400).json({ message: "Student with this email or regNo already exists" });
    }

    // Ensure there is a corresponding User account; create one if missing
    let user = await User.findOne({ email });
    let createdPassword = null;
    if (user) {
      if (user.role !== "student") {
        return res.status(400).json({ message: "A non-student user already exists with this email" });
      }
    } else {
      // Create a default password for the student; admin should change it later
      createdPassword = "password";
      user = await User.create({ name, email, password: createdPassword, role: "student" });
    }

    const { score, riskLevel } = await calculateRisk(
      attendance || 0,
      marks || 0,
      assignments || 0
    );

    const student = await Student.create({
      name,
      email,
      regNo,
      userId: user._id,
      attendance: attendance || 0,
      marks: marks || 0,
      assignments: assignments || 0,
      score,
      riskLevel
    });

    const responsePayload = { student };
    if (createdPassword) responsePayload.createdUser = { email: user.email, password: createdPassword };

    res.status(201).json(responsePayload);
  } catch (error) {
    res.status(500).json({ message: "Error adding student", error: error.message });
  }
};

exports.updateMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { attendance, marks, assignments, updatedBy } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.attendance = attendance !== undefined ? attendance : student.attendance;
    student.marks = marks !== undefined ? marks : student.marks;
    student.assignments = assignments !== undefined ? assignments : student.assignments;
    student.lastUpdatedBy = updatedBy;
    student.lastUpdatedAt = new Date();

    const { score, riskLevel } = await calculateRisk(
      student.attendance,
      student.marks,
      student.assignments
    );

    student.score = score;
    student.riskLevel = riskLevel;

    await student.save();

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error updating marks", error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, regNo, password } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Store old email for user lookup
    const oldEmail = student.email;
    // Update student fields
    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email;
    if (regNo !== undefined) student.regNo = regNo;
    let marksChanged = false;
    if (req.body.marks !== undefined) {
      student.marks = req.body.marks;
      marksChanged = true;
    }
    if (req.body.attendance !== undefined) {
      student.attendance = req.body.attendance;
      marksChanged = true;
    }
    if (req.body.assignments !== undefined) {
      student.assignments = req.body.assignments;
      marksChanged = true;
    }
    // If marks/attendance/assignments changed, recalculate score/risk
    let riskLevelChangedToHigh = false;
    if (marksChanged) {
      const prevRiskLevel = student.riskLevel;
      const { score, riskLevel } = await calculateRisk(
        student.attendance,
        student.marks,
        student.assignments
      );
      student.score = score;
      student.riskLevel = riskLevel;
      const riskThreshold = 70;
      student.riskAlert = score < riskThreshold;
      // If risk level changed to High, create notification
      if (prevRiskLevel !== "High" && riskLevel === "High") {
        await Notification.create({
          studentId: student._id,
          message: "Your risk level is now HIGH. Please contact your faculty for support.",
        });
        riskLevelChangedToHigh = true;
      }
    }
    await student.save();
    // Also update User if email or name changed
    const user = await User.findOne({ email: oldEmail });
    if (user) {
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (password) user.password = password;
      await user.save();
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Remove all feedbacks related to this student
    await Feedback.deleteMany({ studentId: id });
    // Remove user account if exists (if students are also users)
    await User.deleteOne({ email: student.email, role: "student" });
    res.json({ message: "Student and related data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
};
