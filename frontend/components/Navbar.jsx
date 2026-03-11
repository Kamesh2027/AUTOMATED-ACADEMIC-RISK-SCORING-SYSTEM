import "./Navbar.css";

export const Navbar = ({ user, onLogout }) => {
  const getRoleLabel = (role) => {
    const labels = {
      admin: "Administrator",
      faculty: "Faculty",
      student: "Student"
    };
    return labels[role] || role;
  };

  return (
    <nav className={`navbar ${user?.role === "faculty" ? "faculty-navbar" : ""}`}>
      {user?.role === "faculty" && (
        <div className="navbar-brand">
          <h1>AARSS Portal</h1>
        </div>
      )}
      <div className="navbar-container">
        {user && (
          <div className="navbar-user">
            <div className="user-info">
              <span className="role-badge">{getRoleLabel(user.role)}</span>
              <span className="user-name">{user.name}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              <i className="bi bi-box-arrow-right"></i>Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
