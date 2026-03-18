import React, { useState } from "react";
import ListersHeader from "../../components/listers/ListersHeader";
import ListersMain from "../../components/listers/ListersMain";
import ListersFooter from "../../components/listers/ListersFooter";
import "./Listers.css";

export default function Listers() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="listers-app">
      <aside className="listers-sidebar">
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
            label="Payment"
            page="payment"
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
      <div className="listers-content">
        <ListersHeader activePage={activePage} />
        <ListersMain activePage={activePage} setActivePage={setActivePage} />
        <ListersFooter />
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
