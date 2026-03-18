import React, { useState } from "react";
import "./Navbar.css";
import DefaultProfileImage from "./DefaultProfileImage";
import Modal from "./Modal";

export const Navbar = ({ user, onLogout }) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const getRoleLabel = (role) => {
    const labels = {
      admin: "Administrator",
      faculty: "Faculty",
      student: "Student"
    };
    return labels[role] || role;
  };

  const handleProfileClick = () => {
    setProfileModalOpen((open) => !open);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
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
              {user?.role === "student" && (
              <div className="profile-image-wrapper" style={{ position: "relative" }}>
              <button className="profile-image-btn" onClick={handleProfileClick} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                <DefaultProfileImage />
              </button>
              {profileModalOpen && (
                <div className="profile-modal-dropdown">
                  <Modal isOpen={true} onClose={handleCloseProfileModal}>
                    <div className="profile-modal-content">
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <DefaultProfileImage />
                        <div style={{ marginTop: "1rem", textAlign: "left" }}>
                          <div style={{ marginBottom: "0.5rem" }}><strong>Name  :</strong> {user.name}</div>
                          <div style={{ marginBottom: "0.5rem" }}><strong>Reg No:</strong> {user.regNo || user.regno}</div>
                          <div style={{ marginBottom: "0.5rem" }}><strong>Email  :</strong> {user.email}</div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>
              )}
            </div>
            )}
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
