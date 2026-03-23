import React, { useState } from "react";
import "./HostHeader.css";

export default function HostHeader({ activePage }) {
  const [searchVal, setSearchVal] = useState("");

  const pageTitle =
    {
      dashboard: "Dashboard",
      property: "Property",
      analytics: "Analytics",
      bookings: "Bookings",
      customer: "Customer",
      settings: "Settings",
      getapp: "Get App",
    }[activePage] || "Dashboard";

  return (
    <header className="host-header">
      <h1 className="header-page-title">{pageTitle}</h1>
      <div className="header-search">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Search something..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>
      <div className="header-actions">
        <button className="header-icon-btn" title="Messages">
          <span>✉️</span>
          <span className="badge">3</span>
        </button>
        <button className="header-icon-btn" title="Notifications">
          <span>🔔</span>
          <span className="badge badge--alert">7</span>
        </button>
        <div className="header-user">
          <div className="user-avatar">B</div>
          <span className="user-name">Banrisk</span>
          <span className="user-chevron">▾</span>
        </div>
      </div>
    </header>
  );
}
