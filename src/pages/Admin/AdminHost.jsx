import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminHostHeader from "../../components/admin/AdminHostHeader";
import AdminHostMain from "../../components/admin/AdminHostMain";
import AdminHostFooter from "../../components/admin/AdminHostFooter";
import "./AdminHost.css";
import { isTokenExpired, logoutUser } from "../../utils/authUser";

function getAdminUser() {
  try { return JSON.parse(localStorage.getItem("adminUser")); } catch { return null; }
}
function isAdminTokenExpired() {
  const token = localStorage.getItem("adminToken");
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch { return true; }
}
function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}



export default function AdminHost() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

useEffect(() => {
  const user = getAdminUser();
  if (!user || isAdminTokenExpired()) {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  }
}, [navigate]);

const user = getAdminUser();
if (!user || isAdminTokenExpired()) return null;

  return (
    <div className="admin-host-app">
      <aside className="admin-host-sidebar">
        <div className="admin-sidebar-logo">
          <span className="admin-logo-text">
            iBookNova<span className="admin-logo-dot">.</span>
          </span>
        </div>
        <nav className="admin-sidebar-nav">
          <Link to="/" className="admin-nav-item admin-nav-item--home">
            <span className="admin-nav-icon">🏡</span>
            <span className="admin-nav-label">Home Page</span>
          </Link>
          <NavItem icon="⊞" label="Dashboard" page="dashboard" activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="🏠" label="Property" page="property" activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="📈" label="Analytics" page="analytics" activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="💳" label="Bookings" page="bookings" activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="👥" label="Customer" page="customer" activePage={activePage} setActivePage={setActivePage} />
        </nav>
        <div className="admin-sidebar-bottom">
          <button
            className="admin-nav-item admin-nav-item--logout"
            onClick={() => { logoutAdmin(); navigate("/admin/login", { replace: true }); }}
          >
            <span className="admin-nav-icon">🚪</span>
            <span className="admin-nav-label">Logout</span>
          </button>
        </div>
      </aside>
      <div className="admin-host-content">
        <AdminHostHeader activePage={activePage} />
        <AdminHostMain activePage={activePage} setActivePage={setActivePage} />
        <AdminHostFooter />
      </div>
    </div>
  );
}

function NavItem({ icon, label, page, activePage, setActivePage }) {
  const isActive = activePage === page;
  return (
    <button
      className={`admin-nav-item ${isActive ? "admin-nav-item--active" : ""}`}
      onClick={() => setActivePage(page)}
    >
      <span className="admin-nav-icon">{icon}</span>
      <span className="admin-nav-label">{label}</span>
    </button>
  );
}