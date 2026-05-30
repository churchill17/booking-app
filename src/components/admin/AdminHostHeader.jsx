import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, logoutUser } from "../../utils/authUser";
import "./AdminHostHeader.css";

export default function AdminHostHeader({ activePage }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const user = (() => { try { return JSON.parse(localStorage.getItem("adminUser")); } catch { return null; } })();

  const pageTitle =
    {
      dashboard: "Admin Dashboard",
      property: "Admin Property",
      analytics: "Admin Analytics",
      bookings: "Admin Bookings",
      customer: "Admin Customer",
    }[activePage] || "Admin Dashboard";

const handleLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  navigate("/admin/login", { replace: true });
};

  const initials = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "H";

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Host";

  return (
    <header className="admin-host-header">
      <h1 className="admin-header-page-title">{pageTitle}</h1>
      <div className="admin-header-actions">
<div
          className="admin-header-user"
          onClick={() => setShowDropdown((v) => !v)}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <div className="admin-user-avatar">{initials}</div>
          <span className="admin-user-name">{fullName}</span>
          <span className="admin-user-chevron">▾</span>
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                right: 0,
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                minWidth: 160,
                zIndex: 100,
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  color: "#888",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {user?.email || ""}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#e25c5c",
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
