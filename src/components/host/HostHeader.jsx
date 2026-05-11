import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, logoutUser } from "../../utils/authUser";
import "./HostHeader.css";

export default function HostHeader({ activePage }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const user = getStoredUser("host");

  const pageTitle = {
    dashboard: "Dashboard",
    property: "Property",
    analytics: "Analytics",
    bookings: "Bookings",
    customer: "Customer",
}[activePage] || "Dashboard";

  const handleLogout = () => {
    logoutUser();
    navigate("/list-property/login", { replace: true });
  };

  const initials = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "H";

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Host";

  return (
    <header className="host-header">
      <h1 className="header-page-title">{pageTitle}</h1>
      <div className="header-actions">
        <button className="header-icon-btn" title="Messages">
          <span>✉️</span>
        </button>
        <button className="header-icon-btn" title="Notifications">
          <span>🔔</span>
        </button>
        <div className="header-user" onClick={() => setShowDropdown((v) => !v)} style={{ position: "relative", cursor: "pointer" }}>
          <div className="user-avatar">{initials}</div>
          <span className="user-name">{fullName}</span>
          <span className="user-chevron">▾</span>
          {showDropdown && (
            <div style={{
              position: "absolute", top: "110%", right: 0,
              background: "#fff", border: "1px solid #eee",
              borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              minWidth: 160, zIndex: 100, padding: "8px 0"
            }}>
              <div style={{ padding: "8px 16px", fontSize: 13, color: "#888", borderBottom: "1px solid #f0f0f0" }}>
                {user?.email || ""}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%", textAlign: "left", padding: "10px 16px",
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, color: "#e25c5c"
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}