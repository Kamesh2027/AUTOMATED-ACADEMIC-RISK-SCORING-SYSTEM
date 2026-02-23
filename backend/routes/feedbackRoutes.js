const router = require("express").Router();
const {
  getFeedbackByStudent,
  createFeedback,
  markFeedbackAsRead,
  deleteFeedback,
  getUnreadFeedbackCount,
  getAllFeedback
} = require("../controllers/feedbackController");

// Get feedback for a specific student by email
router.get("/student/:studentEmail", getFeedbackByStudent);

// Get unread feedback count for a student
router.get("/count/:studentEmail", getUnreadFeedbackCount);

// Get all feedback
router.get("/", getAllFeedback);

// Create feedback for a student
router.post("/", createFeedback);

// Mark feedback as read
router.put("/:feedbackId/read", markFeedbackAsRead);

// Delete feedback
router.delete("/:feedbackId", deleteFeedback);

module.exports = router;
