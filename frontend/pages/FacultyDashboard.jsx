import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import "./FacultyDashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    attendance: 0,
    marks: 0,
    assignments: 0
  });

  useEffect(() => {
    fetchStudents();
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

  const filtered =
    filter === "All"
      ? students
      : students.filter((s) => s.riskLevel === filter);

  const handleUpdateMarks = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/students/${editingStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendance: Number(editForm.attendance),
          marks: Number(editForm.marks),
          assignments: Number(editForm.assignments),
          updatedBy: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update marks");
        setLoading(false);
        return;
      }

      setSuccessMessage("Marks updated successfully!");
      setEditingStudent(null);
      fetchStudents();
      setLoading(false);
    } catch (err) {
      setError("Connection error: " + err.message);
      setLoading(false);
    }
  };

  const startEditing = (student) => {
    setEditingStudent(student);
    setEditForm({
      attendance: student.attendance,
      marks: student.marks,
      assignments: student.assignments
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="faculty-dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="dashboard-container">
        <div className="header">
          <h1>Faculty Dashboard</h1>
          <p>Manage and update student performance metrics</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="filter-section">
          <label>Filter by Risk Level:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Students</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
          <span className="student-count">
            Showing {filtered.length} of {students.length} students
          </span>
        </div>

        {editingStudent && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Update Marks - {editingStudent.name}</h2>
                <button
                  className="close-btn"
                  onClick={() => setEditingStudent(null)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateMarks} className="form">
                <div className="form-group">
                  <label>Attendance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.attendance}
                    onChange={(e) =>
                      setEditForm({ ...editForm, attendance: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Marks (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.marks}
                    onChange={(e) =>
                      setEditForm({ ...editForm, marks: e.target.value })
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
                    value={editForm.assignments}
                    onChange={(e) =>
                      setEditForm({ ...editForm, assignments: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Marks"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingStudent(null)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="students-grid">
          {filtered.length > 0 ? (
            filtered.map((student) => (
              <div key={student._id} className="student-card">
                <div className="card-header">
                  <h3>{student.name}</h3>
                  <span className={`badge badge-${student.riskLevel.toLowerCase()}`}>
                    {student.riskLevel} Risk
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span>Email:</span>
                    <strong>{student.email}</strong>
                  </div>
                  <div className="info-row">
                    <span>Reg No:</span>
                    <strong>{student.regNo}</strong>
                  </div>

                  <div className="metrics">
                    <div className="metric">
                      <label>Attendance</label>
                      <div className="value">{student.attendance}%</div>
                    </div>
                    <div className="metric">
                      <label>Marks</label>
                      <div className="value">{student.marks}%</div>
                    </div>
                    <div className="metric">
                      <label>Assignments</label>
                      <div className="value">{student.assignments}%</div>
                    </div>
                    <div className="metric">
                      <label>Overall Score</label>
                      <div className="value score">{student.score}</div>
                    </div>
                  </div>

                  <div className="risk-info">
                    <strong>Risk Level:</strong> {student.riskLevel}
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    className="btn btn-primary"
                    onClick={() => startEditing(student)}
                  >
                    Update Marks
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-students">
              <p>No students found with the selected risk level</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
