import React, { useState } from "react";
import HostHeader from "../../components/host/HostHeader";
import HostMain from "../../components/host/HostMain";
import HostFooter from "../../components/host/HostFooter";
import "./Host.css";

export default function Host() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="host-app">
      <aside className="host-sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">
            Vinjham<span className="logo-dot">.</span>
          </span>
        </div>
        <nav className="sidebar-nav">
          <NavItem
            icon="⊞"
            label="Dashboard"
            page="dashboard"
            activePage={activePage}
            setActivePage={setActivePage}
          />
          <NavItem
            icon="🏠"
            label="Property"
            page="property"
            activePage={activePage}
            setActivePage={setActivePage}
          />
          <NavItem
            icon="📈"
            label="Analytics"
            page="analytics"
            activePage={activePage}
            setActivePage={setActivePage}
          />
          <NavItem
            icon="💳"
            label="Bookings"
            page="bookings"
            activePage={activePage}
            setActivePage={setActivePage}
          />
          <NavItem
            icon="👥"
            label="Customer"
            page="customer"
            activePage={activePage}
            setActivePage={setActivePage}
          />
        </nav>
        <div className="sidebar-bottom">
          <NavItem
            icon="⚙️"
            label="Settings"
            page="settings"
            activePage={activePage}
            setActivePage={setActivePage}
          />
          <NavItem
            icon="📱"
            label="Get App"
            page="getapp"
            activePage={activePage}
            setActivePage={setActivePage}
          />
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
