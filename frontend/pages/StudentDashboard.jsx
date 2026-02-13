import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { StudentSidebar } from "../components/StudentSidebar";
import "./StudentDashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("profileInfo");

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
    } catch (err) {
      setError("Failed to fetch student data: " + err.message);
      setLoading(false);
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
                  {/* <div className="metric-icon">📚</div> */}
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
                  {/* <div className="metric-icon">📝</div> */}
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
                  {/* <div className="metric-icon">✅</div> */}
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
        </div>
      </div>
    </div>
  );
}
