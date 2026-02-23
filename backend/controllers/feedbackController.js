const Feedback = require("../models/Feedback");
const Student = require("../models/Student");
const User = require("../models/User");

// Get all feedback for a specific student
exports.getFeedbackByStudent = async (req, res) => {
  try {
    const { studentEmail } = req.params;

    const feedback = await Feedback.find({ studentEmail })
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error: error.message });
  }
};

// Create feedback for a student
exports.createFeedback = async (req, res) => {
  try {
    console.log("Creating feedback with body:", req.body);
    
    const { studentEmail, title, message, category, priority, facultyName } = req.body;
    const facultyId = req.body.facultyId || req.user?.id;

    // Validate required fields
    if (!studentEmail) {
      console.log("Missing studentEmail");
      return res.status(400).json({ message: "Student email is required" });
    }
    if (!title || !title.trim()) {
      console.log("Missing title");
      return res.status(400).json({ message: "Title is required" });
    }
    if (!message || !message.trim()) {
      console.log("Missing message");
      return res.status(400).json({ message: "Message is required" });
    }

    console.log("Looking for student with email:", studentEmail);
    
    // Verify student exists
    const student = await Student.findOne({ email: studentEmail });
    console.log("Student found:", student ? student._id : "NOT FOUND");
    
    if (!student) {
      console.log("Student not found with email:", studentEmail);
      // List all students for debugging
      const allStudents = await Student.find({}, { email: 1, name: 1 });
      console.log("Available students:", allStudents);
      return res.status(404).json({ message: "Student not found", providedEmail: studentEmail });
    }

    const feedback = await Feedback.create({
      studentId: student._id,
      studentEmail,
      facultyId,
      facultyName: facultyName || "Faculty Member",
      title: title.trim(),
      message: message.trim(),
      category: category || "General",
      priority: priority || "Medium"
    });

    console.log("Feedback created successfully:", feedback._id);
    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Error creating feedback", error: error.message, stack: error.stack });
  }
};

// Mark feedback as read
exports.markFeedbackAsRead = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { isRead: true, updatedAt: Date.now() },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error updating feedback", error: error.message });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feedback", error: error.message });
  }
};

// Get unread feedback count for a student
exports.getUnreadFeedbackCount = async (req, res) => {
  try {
    const { studentEmail } = req.params;

    const count = await Feedback.countDocuments({ studentEmail, isRead: false });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: "Error counting feedback", error: error.message });
  }
};

// Get all feedback (for admin/faculty to manage)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error: error.message });
  }
};
