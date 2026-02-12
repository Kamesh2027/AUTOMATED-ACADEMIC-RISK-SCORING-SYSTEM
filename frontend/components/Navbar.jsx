import "./Navbar.css";

export const Navbar = ({ user, onLogout }) => {
  const getRoleLabel = (role) => {
    const labels = {
      admin: "Administrator",
      faculty: "Faculty Member",
      student: "Student"
    };
    return labels[role] || role;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>AARSS Portal</h1>
        </div>

        {user && (
          <div className="navbar-user">
            <div className="user-info">
              {/* <span className="role-badge">{getRoleLabel(user.role)}</span> */}
              <span className="user-name">{user.name}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
