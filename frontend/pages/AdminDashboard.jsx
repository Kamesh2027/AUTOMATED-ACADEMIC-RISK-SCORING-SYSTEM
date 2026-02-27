import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { AdminSidebar } from "../components/AdminSidebar";
import "./AdminDashboard.css";
import { API_BASE_URL } from "../config";

//const API_BASE_URL = "http://localhost:5000/api";

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
  // faculty delete states
  const [showFacultyDeleteModal, setShowFacultyDeleteModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [regNoError, setRegNoError] = useState("");
  const [facultyEmailError, setFacultyEmailError] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [facultySearch, setFacultySearch] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editFacultyModalOpen, setEditFacultyModalOpen] = useState(false);
  const [editFaculty, setEditFaculty] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchFaculty();
    fetchRiskSettings();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
      // refresh faculty list and dashboard counts
      fetchFaculty();
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

  const handleDeleteFaculty = (facultyId) => {
    setFacultyToDelete(facultyId);
    setShowFacultyDeleteModal(true);
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

  const confirmDeleteFaculty = async () => {
    if (!facultyToDelete) return;
    setShowFacultyDeleteModal(false);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/faculty/${facultyToDelete}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        setError("Failed to delete faculty member");
        setFacultyToDelete(null);
        return;
      }

      setSuccessMessage("Faculty member deleted successfully!");
      setFacultyToDelete(null);
      fetchFaculty();
    } catch (err) {
      setError("Connection error: " + err.message);
      setFacultyToDelete(null);
    }
  };

  const cancelDeleteStudent = () => {
    setStudentToDelete(null);
    setShowDeleteModal(false);
  };

  const cancelDeleteFaculty = () => {
    setFacultyToDelete(null);
    setShowFacultyDeleteModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openEditStudentModal = (student) => {
    setEditStudent({ ...student, password: "" });
    setEditModalOpen(true);
  };

  const closeEditStudentModal = () => {
    setEditModalOpen(false);
    setEditStudent(null);
  };

  const handleEditStudentChange = (field, value) => {
    setEditStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEditStudent = async () => {
    if (!editStudent) return;
    try {
      const body = {
        name: editStudent.name,
        email: editStudent.email,
        regNo: editStudent.regNo
      };
      if (editStudent.password) body.password = editStudent.password;
      const response = await fetch(`${API_BASE_URL}/students/${editStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        // Refetch students from the backend to ensure DB is updated and UI is in sync
        await fetchStudents();
        closeEditStudentModal();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update student");
      }
    } catch (err) {
      alert("Error updating student: " + err.message);
    }
  };

  const openEditFacultyModal = (faculty) => {
    setEditFaculty({ ...faculty, password: "" });
    setEditFacultyModalOpen(true);
  };

  const closeEditFacultyModal = () => {
    setEditFacultyModalOpen(false);
    setEditFaculty(null);
  };

  const handleEditFacultyChange = (field, value) => {
    setEditFaculty(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEditFaculty = async () => {
    if (!editFaculty) return;
    try {
      const body = {
        name: editFaculty.name,
        email: editFaculty.email
      };
      if (editFaculty.password) body.password = editFaculty.password;
      const response = await fetch(`${API_BASE_URL}/auth/faculty/${editFaculty._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        await fetchFaculty();
        closeEditFacultyModal();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update faculty");
      }
    } catch (err) {
      alert("Error updating faculty: " + err.message);
    }
  };

  {editModalOpen && editStudent && (
    <div className="modal-overlay">
      <div className="modal edit-modal">
        <div className="modal-header">
          <h2>Edit Student</h2>
          <button className="close-btn" onClick={closeEditStudentModal}>×</button>
        </div>
        <form className="form" onSubmit={e => { e.preventDefault(); handleSaveEditStudent(); }}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={editStudent.name}
              onChange={e => handleEditStudentChange('name', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={editStudent.email}
              onChange={e => handleEditStudentChange('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              value={editStudent.regNo}
              onChange={e => handleEditStudentChange('regNo', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={editStudent.password}
              onChange={e => handleEditStudentChange('password', e.target.value)}
              placeholder="Leave blank to keep unchanged"
            />
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  )}

  {editFacultyModalOpen && editFaculty && (
    <div className="modal-overlay">
      <div className="modal edit-modal">
        <div className="modal-header">
          <h2>Edit Faculty</h2>
          <button className="close-btn" onClick={closeEditFacultyModal}>×</button>
        </div>
        <form className="form" onSubmit={e => { e.preventDefault(); handleSaveEditFaculty(); }}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={editFaculty.name}
              onChange={e => handleEditFacultyChange('name', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={editFaculty.email}
              onChange={e => handleEditFacultyChange('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={editFaculty.password}
              onChange={e => handleEditFacultyChange('password', e.target.value)}
              placeholder="Leave blank to keep unchanged"
            />
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  )}

  return (
    <div className="admin-dashboard">
      <Navbar user={user} onLogout={handleLogout} />
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {editModalOpen && editStudent && (
        <div className="modal-overlay">
          <div className="modal edit-modal">
            <div className="modal-header">
              <h2>Edit Student</h2>
              <button className="close-btn" onClick={closeEditStudentModal}>×</button>
            </div>
            <form className="form" onSubmit={e => { e.preventDefault(); handleSaveEditStudent(); }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editStudent.name}
                  onChange={e => handleEditStudentChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editStudent.email}
                  onChange={e => handleEditStudentChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={editStudent.regNo}
                  onChange={e => handleEditStudentChange('regNo', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={editStudent.password}
                  onChange={e => handleEditStudentChange('password', e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {editFacultyModalOpen && editFaculty && (
        <div className="modal-overlay">
          <div className="modal edit-modal">
            <div className="modal-header">
              <h2>Edit Faculty</h2>
              <button className="close-btn" onClick={closeEditFacultyModal}>×</button>
            </div>
            <form className="form" onSubmit={e => { e.preventDefault(); handleSaveEditFaculty(); }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editFaculty.name}
                  onChange={e => handleEditFacultyChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editFaculty.email}
                  onChange={e => handleEditFacultyChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={editFaculty.password}
                  onChange={e => handleEditFacultyChange('password', e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      )}

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
        {showFacultyDeleteModal && (
          <div className="modal-overlay">
            <div className="confirm-modal">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this faculty member?</p>
              <div className="modal-actions">
                <button className="btn btn-danger" onClick={confirmDeleteFaculty}>
                  Delete
                </button>
                <button className="btn" onClick={cancelDeleteFaculty}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="dashboard-overview">
            <h2 className="do">Dashboard Overview</h2>

            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Students</h4>
                <p className="stat-number">{students.length}</p>
              </div>

              <div className="stat-card">
                <h4>Total Faculty</h4>
                <p className="stat-number">{faculty.length}</p>
              </div>

              <div className="stat-card danger">
                <h4>At Risk Students</h4>
                <p className="stat-number">
                  {students.filter(s => s.riskLevel === "High").length}
                </p>
              </div>

              
            </div>

            {/* Bottom Section */}
            <div className="dashboard-bottom">
              {/* Risk Summary */}
              <div className="card">
                <h3 className="rds">Risk Distribution Summary</h3>
                <ul className="risk-list">
                  <li>
                    Low Risk <span>{students.filter(s => s.riskLevel === "Low").length}</span>
                  </li>
                  <li>
                    Medium Risk <span>{students.filter(s => s.riskLevel === "Medium").length}</span>
                  </li>
                  <li className="critical">
                    High Risk <span>{students.filter(s => s.riskLevel === "High").length}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}


        {/* Student List Section */}
        {activeSection === "studentList" && (
          <div className="section-content">
            <h2>Student List</h2>
            
            {students.length === 0 ? (
              <div className="no-data-message">No students found.</div>
            ) : (
            <>
              <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name, email, or registration number..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="search-input"
              />
            </div>
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
                    {students
                      .filter((student) =>
                        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        student.regNo.toLowerCase().includes(studentSearch.toLowerCase())
                      )
                      .map((student) => (
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
                            <div className="action-cell">
                              <div className="action-buttons">
                                <button
                                  className="btn btn-edit btn-sm"
                                  onClick={() => openEditStudentModal(student)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteStudent(student._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
            )}
          </div>
        )}

        {activeSection === "facultyList" && (
          <div className="section-content">
            <h2>Faculty List</h2>
            {faculty.length === 0 ? (
              <div className="no-data-message">No faculty found.</div>
            ) : (
              <>
              <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                className="search-input"
              />
            </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty
                      .filter((f) =>
                        f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
                        f.email.toLowerCase().includes(facultySearch.toLowerCase())
                      )
                      .map((f) => (
                        <tr key={f._id}>
                          <td>{f.name}</td>
                          <td>{f.email}</td>
                          <td>
                            <div className="action-button">
                              <button
                                className="btn btn-edit btn-sm"
                                onClick={() => openEditFacultyModal(f)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteFaculty(f._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
            )}
          </div>
        )}

        {/* Add Student Section */}
        {activeSection === "addStudent" && (
          <div className="section-content">
            <h2 className="addnewstudent">Add New Student</h2>
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
            <h2 className="addnewfaculty">Add New Faculty Member</h2>
            <form onSubmit={handleAddFaculty} className="form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
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
                  placeholder="Enter mail id"
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
                  placeholder="Enter Password"
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
            <h2 className="risklevel">Risk Level Settings</h2>
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
