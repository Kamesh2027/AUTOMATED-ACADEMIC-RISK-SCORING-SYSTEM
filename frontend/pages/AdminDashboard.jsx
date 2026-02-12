import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { AdminSidebar } from "../components/AdminSidebar";
import "./AdminDashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [settings, setSettings] = useState({
    attendanceWeight: 40,
    internalWeight: 30,
    assignmentWeight: 30,
    lowRiskMin: 85,
    mediumRiskMin: 70
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    regNo: "",
    attendance: 0,
    marks: 0,
    assignments: 0
  });

  const [facultyForm, setFacultyForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [settingsForm, setSettingsForm] = useState({
    attendanceWeight: 40,
    internalWeight: 30,
    assignmentWeight: 30,
    lowRiskMin: 85,
    mediumRiskMin: 70
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [regNoError, setRegNoError] = useState("");
  const [facultyEmailError, setFacultyEmailError] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchFaculty();
    fetchRiskSettings();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError("Failed to fetch students");
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/faculty`);
      const data = await response.json();
      setFaculty(data);
    } catch (err) {
      console.error("Failed to fetch faculty");
    }
  };

  const fetchRiskSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/risk`);
      const data = await response.json();
      if (data) {
        setSettings(data);
        setSettingsForm(data);
      }
    } catch (err) {
      console.error("Failed to fetch settings");
    }
  };

  const validateStudentForm = () => {
    let isValid = true;
    
    // Check for duplicate email
    if (studentForm.email && students.some(s => s.email === studentForm.email)) {
      setEmailError("This email is already registered");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    // Check for duplicate regNo
    if (studentForm.regNo && students.some(s => s.regNo === studentForm.regNo)) {
      setRegNoError("This registration number is already registered");
      isValid = false;
    } else {
      setRegNoError("");
    }
    
    return isValid;
  };

  const validateFacultyForm = () => {
    let isValid = true;
    
    // Check for duplicate email in both students and faculty
    if (facultyForm.email && (students.some(s => s.email === facultyForm.email) || faculty.some(f => f.email === facultyForm.email))) {
      setFacultyEmailError("This email is already registered");
      isValid = false;
    } else {
      setFacultyEmailError("");
    }
    
    return isValid;
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    // Validate for duplicates
    if (!validateStudentForm()) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...studentForm,
          attendance: Number(studentForm.attendance),
          marks: Number(studentForm.marks),
          assignments: Number(studentForm.assignments)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add student");
        setLoading(false);
        return;
      }

      setSuccessMessage("Student added successfully!");
      setStudentForm({
        name: "",
        email: "",
        regNo: "",
        attendance: 0,
        marks: 0,
        assignments: 0
      });
      fetchStudents();
      setLoading(false);
    } catch (err) {
      setError("Connection error: " + err.message);
      setLoading(false);
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    // Validate for duplicates
    if (!validateFacultyForm()) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: facultyForm.name,
          email: facultyForm.email,
          password: facultyForm.password,
          role: "faculty"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add faculty");
        setLoading(false);
        return;
      }

      setSuccessMessage("Faculty member added successfully!");
      setFacultyForm({ name: "", email: "", password: "" });
      setLoading(false);
    } catch (err) {
      setError("Connection error: " + err.message);
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const totalWeight =
        Number(settingsForm.attendanceWeight) +
        Number(settingsForm.internalWeight) +
        Number(settingsForm.assignmentWeight);

      if (totalWeight !== 100) {
        setError("Weights must sum to 100%");
        setLoading(false);
        return;
      }

      if (Number(settingsForm.mediumRiskMin) >= Number(settingsForm.lowRiskMin)) {
        setError("Medium risk threshold must be less than low risk threshold");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/risk`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendanceWeight: Number(settingsForm.attendanceWeight),
          internalWeight: Number(settingsForm.internalWeight),
          assignmentWeight: Number(settingsForm.assignmentWeight),
          lowRiskMin: Number(settingsForm.lowRiskMin),
          mediumRiskMin: Number(settingsForm.mediumRiskMin)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update settings");
        setLoading(false);
        return;
      }

      setSettings(data);
      setSuccessMessage("Risk settings updated successfully!");
      setLoading(false);
    } catch (err) {
      setError("Connection error: " + err.message);
      setLoading(false);
    }
  };

  const handleDeleteStudent = (studentId) => {
    setStudentToDelete(studentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    setShowDeleteModal(false);
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentToDelete}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        setError("Failed to delete student");
        setStudentToDelete(null);
        return;
      }

      setSuccessMessage("Student deleted successfully!");
      setStudentToDelete(null);
      fetchStudents();
    } catch (err) {
      setError("Connection error: " + err.message);
      setStudentToDelete(null);
    }
  };

  const cancelDeleteStudent = () => {
    setStudentToDelete(null);
    setShowDeleteModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <Navbar user={user} onLogout={handleLogout} />
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="dashboard-container">
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="confirm-modal">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this student?</p>
              <div className="modal-actions">
                <button className="btn btn-danger" onClick={confirmDeleteStudent}>
                  Delete
                </button>
                <button className="btn" onClick={cancelDeleteStudent}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="section-content">
            <h2>Dashboard Overview</h2>
            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th className="metric">Metric</th>
                    <th className="metric">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="metric-label">Total Students</td>
                    <td className="metric-value">{students.length}</td>
                  </tr>
                  <tr>
                    <td className="metric-label">Total Faculties</td>
                    <td className="metric-value">{faculty.length}</td>
                  </tr>
                  <tr className="risk-row">
                    <td className="metric-label">Low Risk Students</td>
                    <td className="metric-value" style={{ fontWeight: "bold" }}>
                      {students.filter(s => s.riskLevel === "Low").length}
                    </td>
                  </tr>
                  <tr className="risk-row">
                    <td className="metric-label">Medium Risk Students</td>
                    <td className="metric-value" style={{ fontWeight: "bold" }}>
                      {students.filter(s => s.riskLevel === "Medium").length}
                    </td>
                  </tr>
                  <tr className="risk-row">
                    <td className="metric-label">High Risk Students</td>
                    <td className="metric-value" style={{ fontWeight: "bold" }}>
                      {students.filter(s => s.riskLevel === "High").length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student List Section */}
        {activeSection === "studentList" && (
          <div className="section-content">
            <h2>Student List</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Reg No</th>
                    <th>Attendance</th>
                    <th>Marks</th>
                    <th>Assignments</th>
                    <th>Score</th>
                    <th>Risk Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.regNo}</td>
                      <td>{student.attendance}</td>
                      <td>{student.marks}</td>
                      <td>{student.assignments}</td>
                      <td>{student.score}</td>
                      <td>
                        <span className={`badge badge-${student.riskLevel.toLowerCase()}`}>
                          {student.riskLevel}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteStudent(student._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "facultyList" && (
          <div className="section-content">
            <h2>Faculty List</h2>
            <div style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
              <p>Faculty management coming soon</p>
            </div>
          </div>
        )}

        {/* Add Student Section */}
        {activeSection === "addStudent" && (
          <div className="section-content">
            <h2>Add New Student</h2>
            <form onSubmit={handleAddStudent} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, name: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, email: e.target.value })
                    }
                    disabled={loading}
                    style={{ borderColor: emailError ? "#f44336" : "" }}
                  />
                  {emailError && <span className="error-text">{emailError}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    required
                    value={studentForm.regNo}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, regNo: e.target.value })
                    }
                    disabled={loading}
                    style={{ borderColor: regNoError ? "#f44336" : "" }}
                  />
                  {regNoError && <span className="error-text">{regNoError}</span>}
                </div>
                <div className="form-group">
                  <label>Attendance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={studentForm.attendance}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, attendance: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Marks (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={studentForm.marks}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, marks: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Assignments (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={studentForm.assignments}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, assignments: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Adding..." : "Add Student"}
              </button>
            </form>
          </div>
        )}

        {/* Add Faculty Section */}
        {activeSection === "addFaculty" && (
          <div className="section-content">
            <h2>Add New Faculty Member</h2>
            <form onSubmit={handleAddFaculty} className="form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={facultyForm.name}
                  onChange={(e) =>
                    setFacultyForm({ ...facultyForm, name: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={facultyForm.email}
                  onChange={(e) =>
                    setFacultyForm({ ...facultyForm, email: e.target.value })
                  }
                  disabled={loading}
                  style={{ borderColor: facultyEmailError ? "#f44336" : "" }}
                />
                {facultyEmailError && <span className="error-text">{facultyEmailError}</span>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  value={facultyForm.password}
                  onChange={(e) =>
                    setFacultyForm({ ...facultyForm, password: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Adding..." : "Add Faculty"}
              </button>
            </form>
          </div>
        )}

        {/* Risk Settings Section */}
        {activeSection === "riskSettings" && (
          <div className="section-content">
            <h2>Risk Level Settings</h2>
            <form onSubmit={handleUpdateSettings} className="form">
              <div className="settings-section">
                <h3>Weight Distribution (must sum to 100%)</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Attendance Weight (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settingsForm.attendanceWeight}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          attendanceWeight: e.target.value
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Internal Marks Weight (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settingsForm.internalWeight}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          internalWeight: e.target.value
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Assignment Weight (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settingsForm.assignmentWeight}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          assignmentWeight: e.target.value
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Risk Level Thresholds</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Medium Risk Threshold (score ≥)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settingsForm.mediumRiskMin}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          mediumRiskMin: e.target.value
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Low Risk Threshold (score ≥)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settingsForm.lowRiskMin}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          lowRiskMin: e.target.value
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Updating..." : "Update Settings"}
              </button>
            </form>

            <div className="current-settings">
              <h3>Current Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <span>Attendance Weight:</span>
                  <strong>{settings.attendanceWeight}%</strong>
                </div>
                <div className="setting-item">
                  <span>Internal Marks Weight:</span>
                  <strong>{settings.internalWeight}%</strong>
                </div>
                <div className="setting-item">
                  <span>Assignment Weight:</span>
                  <strong>{settings.assignmentWeight}%</strong>
                </div>
                <div className="setting-item">
                  <span>Medium Risk Threshold:</span>
                  <strong>{settings.mediumRiskMin}</strong>
                </div>
                <div className="setting-item">
                  <span>Low Risk Threshold:</span>
                  <strong>{settings.lowRiskMin}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
