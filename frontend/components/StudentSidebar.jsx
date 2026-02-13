import "./StudentSidebar.css";

export const StudentSidebar = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: "profileInfo", label: "Profile Information" },
    { id: "dashboard", label: "Your risk level" },
    { id: "analytics", label: "Analytics" }
  ];

  return (
    <aside className="student-sidebar">
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`sidebar-item ${activeSection === section.id ? "active" : ""}`}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="sidebar-label">{section.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
