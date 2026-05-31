import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminHostHeader from "../../components/admin/AdminHostHeader";
import AdminHostMain from "../../components/admin/AdminHostMain";
import AdminHostFooter from "../../components/admin/AdminHostFooter";
import "./AdminHost.css";

function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}

export default function AdminHost() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

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
          <NavItem icon="🏠" label="Property"  page="property"  activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="📈" label="Analytics" page="analytics" activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="💳" label="Bookings"  page="bookings"  activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="👥" label="Customers" page="customer"  activePage={activePage} setActivePage={setActivePage} />
        </nav>
        <div className="admin-sidebar-bottom">
          <button
            className="admin-nav-item admin-nav-item--logout"
            onClick={handleLogout}
          >
            <span className="admin-nav-icon">🚪</span>
            <span className="admin-nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-host-content">
        <AdminHostHeader activePage={activePage} onLogout={handleLogout} />
        <AdminHostMain activePage={activePage} setActivePage={setActivePage} />
        <AdminHostFooter />
      </div>
    </div>
  );
}

function NavItem({ icon, label, page, activePage, setActivePage }) {
  return (
    <button
      className={`admin-nav-item ${activePage === page ? "admin-nav-item--active" : ""}`}
      onClick={() => setActivePage(page)}
    >
      <span className="admin-nav-icon">{icon}</span>
      <span className="admin-nav-label">{label}</span>
    </button>
  );
}