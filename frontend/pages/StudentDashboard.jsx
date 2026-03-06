import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { StudentSidebar } from "../components/StudentSidebar";
import "./StudentDashboard.css";
import { API_BASE_URL } from "../config";
import Modal from "../components/Modal";

export default function StudentDashboard() {
    const handleDeleteClick = (feedbackId) => {
      setDeleteTargetId(feedbackId);
      setDeleteConfirmOpen(true);
    };
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("profileInfo");
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const handleViewFeedback = (item) => {
    setSelectedFeedback(item);
    setModalOpen(true);
    if (!item.isRead) {
      markFeedbackAsRead(item._id);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFeedback(null);
  };

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/students/email/${user.email}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Student record not found");
        setLoading(false);
        return;
      }

      setStudent(data);
      setLoading(false);
      
      // Fetch feedback after student data is loaded
      fetchFeedback(user.email);
    } catch (err) {
      setError("Failed to fetch student data: " + err.message);
      setLoading(false);
    }
  };

  const fetchFeedback = async (email) => {
    setFeedbackLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/student/${email}`);
      const data = await response.json();

      if (response.ok) {
        setFeedback(data);
      }
      setFeedbackLoading(false);
    } catch (err) {
      console.error("Failed to fetch feedback:", err.message);
      setFeedbackLoading(false);
    }
  };

  const markFeedbackAsRead = async (feedbackId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        // Update local feedback state
        setFeedback(feedback.map(f => 
          f._id === feedbackId ? { ...f, isRead: true } : f
        ));
      }
    } catch (err) {
      console.error("Failed to mark feedback as read:", err.message);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setFeedback(feedback.filter(f => f._id !== feedbackId));
      }
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Failed to delete feedback:", err.message);
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "Low":
        return "#4caf50";
      case "Medium":
        return "#ff9800";
      case "High":
        return "#f44336";
      default:
        return "#607d8b";
    }
  };

  if (loading) {
    return (
      <div className="student-dashboard">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-dashboard">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="dashboard-container">
          <div className="alert alert-error">{error}</div>
          <button className="btn btn-primary" onClick={fetchStudentData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-dashboard">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="dashboard-container">
          <div className="alert alert-info">
            Your profile is being set up. Please contact the administrator.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <Navbar user={user} onLogout={handleLogout} />
      <StudentSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="dashboard-container">
        {/* Automated Risk Alert Notification */}
        {student.riskAlert && (
          <div className="alert alert-warning" style={{marginBottom: '1rem'}}>
            <strong><i className="bi bi-exclamation-triangle"></i> Risk Alert:</strong> Your risk score is below the safe threshold.
          </div>
        )}
        <div className="header">
          <h1>Welcome, {student.name}!</h1>
          <p>Student ID: {student.regNo}</p>
        </div>

        <div className="content">
          {/* Profile Information Section */}
          {activeSection === "profileInfo" && (
            <div className="info-section">
              <h2>Profile Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{student.name}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{student.email}</p>
                </div>
                <div className="info-item">
                  <label>Registration Number</label>
                  <p>{student.regNo}</p>
                </div>
                <div className="info-item">
                  <label>Last Updated</label>
                  <p>
                    {student.lastUpdatedAt
                      ? new Date(student.lastUpdatedAt).toLocaleDateString()
                      : "Not yet updated"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="main-card risk-card">
              <div className="risk-header">
                <h2>Your Risk Level</h2>
              </div>
              <div className="risk-display">
                <div
                  className="risk-badge"
                  style={{ backgroundColor: getRiskColor(student.riskLevel) }}
                >
                  {student.riskLevel}
                </div>
                <div className="score-display">
                  <p className="score-label">Overall Score</p>
                  <p className="score-value">{student.score}</p>
                </div>
              </div>
              <div className="risk-explanation">
                {student.riskLevel === "Low" && (
                  <p>✓ Excellent! You're performing well. Keep up the great work!</p>
                )}
                {student.riskLevel === "Medium" && (
                  <p>
                    ⚠ Your performance shows room for improvement. Consider reaching
                    out to your faculty for guidance.
                  </p>
                )}
                {student.riskLevel === "High" && (
                  <p>
                    ⚠ Your performance needs immediate attention. Please contact your
                    faculty member for support.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Analytics Section */}
          {activeSection === "analytics" && (
            <div className="metrics-section">
              <h2>Your Performance Metrics</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-content">
                    <h3>Attendance</h3>
                    <div className="metric-value">{student.attendance}%</div>
                    <div className="meter">
                      <div
                        className="meter-fill"
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-content">
                    <h3>Obtained Marks</h3>
                    <div className="metric-value">{student.marks}%</div>
                    <div className="meter">
                      <div
                        className="meter-fill"
                        style={{ width: `${student.marks}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-content">
                    <h3>Assignments</h3>
                    <div className="metric-value">{student.assignments}%</div>
                    <div className="meter">
                      <div
                        className="meter-fill"
                        style={{ width: `${student.assignments}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {activeSection === "feedback" && (
            <div className="feedback-section">
              <div className="feedback-header">
                <h2>Feedback from Faculty</h2>
                <span className="feedback-count">{feedback.length} message{feedback.length !== 1 ? 's' : ''}</span>
              </div>

              {feedbackLoading ? (
                <div className="loading-text">Loading feedback...</div>
              ) : feedback.length === 0 ? (
                <div className="no-feedback">
                  <p>No feedback yet. Keep up the good work!</p>
                </div>
              ) : (
                <div className="feedback-list">
                  {feedback.map((item) => (
                    <div key={item._id} className={`feedback-card ${item.isRead ? 'read' : 'unread'}`}>
                      <div className="feedback-header-row">
                        <div className="feedback-info">
                          <p className="faculty-name">From: {item.facultyName}</p>
                          <p className="faculty-id">Faculty Reg No: {item.facultyRegNo}</p>
                          <h3>{item.title}</h3>
                        </div>
                        <div className="feedback-badges">
                          <span className={`badge-category badge-${item.category.toLowerCase()}`}>
                            {item.category}
                          </span>
                          <span className={`badge-priority badge-priority-${item.priority.toLowerCase()}`}>
                            {item.priority}
                          </span>
                          {!item.isRead && <span className="badge-unread">New</span>}
                        </div>
                      </div>



                      <div className="feedback-footer">
                        <span className="feedback-date">
                          <br />
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <div className="feedback-actions">
                          <button
                            className="btn-small btn-view"
                            onClick={() => handleViewFeedback(item)}
                          >
                            View
                          </button>
                          <button
                            className="btn-small btn-delete"
                            onClick={() => handleDeleteClick(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                            {/* Feedback Modal */}
                            <Modal isOpen={modalOpen} onClose={handleCloseModal}>
                              {selectedFeedback && (
                                <div className="modal-feedback-details">
                                  <div className="modal-header-row">
                                    <span className="modal-from"><strong>From:</strong> {selectedFeedback.facultyName}</span>
                                    <button className="modal-close" onClick={handleCloseModal}>×</button>
                                  </div>
                                  <div style={{margin: '0.5rem 0'}}>
                                    <span><strong>Faculty Reg No:</strong> {selectedFeedback.facultyRegNo}</span>
                                  </div>
                                  <div style={{margin: '1rem 0'}}>
                                    <span className={`badge-category badge-${selectedFeedback.category.toLowerCase()}`}>{selectedFeedback.category}</span>
                                    <span className={`badge-priority badge-priority-${selectedFeedback.priority.toLowerCase()}`}>{selectedFeedback.priority}</span>
                                  </div>
                                  <div>Feedback:</div>
                                  <div className="modal-feedback-message">
                                    {selectedFeedback.message}
                                  </div>
                                  <div className="modal-feedback-date">
                                    <small>
                                      {new Date(selectedFeedback.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </small>
                                  </div>
                                </div>
                              )}
                            </Modal>
                      {/* Delete Confirmation Modal */}
                      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                        <div className="modal-delete-confirm">
                          <h3>Delete Feedback</h3>
                          <p>Are you sure you want to delete this feedback?</p>
                          <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setDeleteConfirmOpen(false)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDeleteFeedback(deleteTargetId)}>Delete</button>
                          </div>
                        </div>
                      </Modal>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
