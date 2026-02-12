import "./AdminSidebar.css";

export const AdminSidebar = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: "dashboard", label: "Dashboard" },
    { id: "studentList", label: "Student List" },
    { id: "facultyList", label: "Faculty List" },
    { id: "addStudent", label: "Add Student" },
    { id: "addFaculty", label: "Add Faculty" },
    { id: "riskSettings", label: "Change Risk Settings"}
  ];

  return (
    <aside className="admin-sidebar">
      {/* <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div> */}
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`sidebar-item ${activeSection === section.id ? "active" : ""}`}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="sidebar-icon">{section.icon}</span>
            <span className="sidebar-label">{section.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
