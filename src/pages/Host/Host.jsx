import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HostHeader from "../../components/host/HostHeader";
import HostMain from "../../components/host/HostMain";
import HostFooter from "../../components/host/HostFooter";
import { getStoredUser, isTokenExpired, logoutUser } from "../../utils/authUser";
import "./Host.css";

export default function Host() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser("host");
    const tokenExpired = isTokenExpired();

    if (!user || tokenExpired) {
      logoutUser();
      navigate("/list-property/login", { replace: true });
    }
  }, [navigate]);

  const user = getStoredUser("host");
  if (!user || isTokenExpired()) return null;

  return (
    <div className="host-app">
      <aside className="host-sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">
            iBookNova<span className="logo-dot">.</span>
          </span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item nav-item--home">
            <span className="nav-icon">🏡</span>
            <span className="nav-label">Home Page</span>
          </Link>
          <NavItem icon="⊞" label="Dashboard" page="dashboard" activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="🏠" label="Property" page="property" activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="📈" label="Analytics" page="analytics" activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="💳" label="Bookings" page="bookings" activePage={activePage} setActivePage={setActivePage} />
          <NavItem icon="👥" label="Guest" page="guest" activePage={activePage} setActivePage={setActivePage} />
        </nav>
        <div className="sidebar-bottom">
          <button
            className="nav-item nav-item--logout"
            onClick={() => { logoutUser(); navigate("/list-property/login", { replace: true }); }}
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
      <div className="host-content">
        <HostHeader activePage={activePage} />
        <HostMain activePage={activePage} setActivePage={setActivePage} />
        <HostFooter />
      </div>
    </div>
  );
}

function NavItem({ icon, label, page, activePage, setActivePage }) {
  const isActive = activePage === page;
  return (
    <button
      className={`nav-item ${isActive ? "nav-item--active" : ""}`}
      onClick={() => setActivePage(page)}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </button>
  );
}