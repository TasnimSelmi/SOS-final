import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import "./UserProfile.css";

function UserProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, deleteAvatar } = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    user?.fullName || user?.firstName || profile.name || "Utilisateur";
  const displayRole = profile.role || user?.role || "";
  const avatarUrl = profile.avatar || null;

  const getRoleLabel = (role) => {
    switch (role) {
      case "1":
        return "Déclarant";
      case "2":
        return "Analyste";
      case "3":
        return "Gouvernance";
      default:
        return "Utilisateur";
    }
  };

  return (
    <div className="user-profile" ref={menuRef}>
      <button
        className="profile-trigger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="profile-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} />
          ) : (
            <div className="avatar-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <span className="profile-name">{displayName}</span>
          <span className="profile-role">{getRoleLabel(displayRole)}</span>
        </div>
        <svg
          className={`profile-chevron ${menuOpen ? "open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
        </svg>
      </button>

      {menuOpen && (
        <div className="profile-menu">
          <div className="profile-menu-header">
            <div className="menu-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} />
              ) : (
                <div className="avatar-placeholder large">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="menu-user-info">
              <span className="menu-name">{displayName}</span>
              <span className="menu-role">{getRoleLabel(displayRole)}</span>
            </div>
          </div>

          <div className="profile-menu-divider"></div>

          <Link
            to="/profile"
            className="profile-menu-item"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Mon Profil
          </Link>

          <Link
            to="/settings"
            className="profile-menu-item"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 17.66l-4.24 4.24M23 12h-6m-6 0H1m20.24 4.24l-4.24-4.24M6.34 6.34L2.1 2.1" />
            </svg>
            Paramètres
          </Link>

          <div className="profile-menu-divider"></div>

          <button className="profile-menu-item logout" onClick={handleLogout}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
