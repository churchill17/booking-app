import React, { useState } from "react";
import "./AdminCustomerPage.css";

const customers = [
  {
    id: "C-001",
    name: "Alex Morrison",
    email: "alex@email.com",
    property: "Saints Lawrence",
    lease: "Jan 2023 – Dec 2023",
    rent: "$2,334",
    status: "Active",
    rating: 5,
  },
  {
    id: "C-002",
    name: "Jamie Liu",
    email: "jamie@email.com",
    property: "Sanbruto Saburo",
    lease: "Mar 2022 – Mar 2023",
    rent: "$5,699",
    status: "Inactive",
    rating: 3,
  },
  {
    id: "C-003",
    name: "Chris Park",
    email: "chris@email.com",
    property: "Homexyde",
    lease: "Jun 2023 – Jun 2024",
    rent: "$7,334",
    status: "Active",
    rating: 4,
  },
  {
    id: "C-004",
    name: "Dana Rivera",
    email: "dana@email.com",
    property: "Gundi Mani",
    lease: "Feb 2023 – Feb 2024",
    rent: "$10,334",
    status: "Active",
    rating: 5,
  },
  {
    id: "C-005",
    name: "Sam Kim",
    email: "sam@email.com",
    property: "Homexyde",
    lease: "Aug 2022 – Aug 2023",
    rent: "$454",
    status: "Pending",
    rating: 3,
  },
  {
    id: "C-006",
    name: "Jordan Blake",
    email: "jordan@email.com",
    property: "Plaza Verde",
    lease: "Sep 2023 – Sep 2024",
    rent: "$3,210",
    status: "Active",
    rating: 4,
  },
  {
    id: "C-007",
    name: "Taylor West",
    email: "taylor@email.com",
    property: "Westridge Flats",
    lease: "Oct 2022 – Oct 2023",
    rent: "$6,780",
    status: "Active",
    rating: 5,
  },
];

export default function AdminCustomerPage() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-customer-page">
      <div className="admin-page-header-row">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-subtitle">
            {customers.length} total tenants across all properties
          </p>
        </div>
        <button className="admin-btn-primary">+ Add Tenant</button>
      </div>

      <div className="admin-customer-stats">
        {[
          {
            label: "Active Tenants",
            value: customers.filter((c) => c.status === "Active").length,
            icon: "✅",
          },
          {
            label: "Inactive",
            value: customers.filter((c) => c.status === "Inactive").length,
            icon: "⛔",
          },
          {
            label: "Pending",
            value: customers.filter((c) => c.status === "Pending").length,
            icon: "⏳",
          },
          {
            label: "Avg. Rating",
            value:
              (
                customers.reduce((acc, c) => acc + c.rating, 0) /
                customers.length
              ).toFixed(1) + " ★",
            icon: "⭐",
          },
        ].map((s, i) => (
          <div className="admin-cust-stat-card" key={s.label + "-" + i}>
            <span className="admin-cust-stat-icon">{s.icon}</span>
            <div>
              <p className="admin-cust-stat-label">{s.label}</p>
              <p className="admin-cust-stat-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-customer-toolbar">
        <div className="admin-search-box">
          <span>🔍</span>
          <input
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-tabs">
          {["All", "Active", "Inactive", "Pending"].map((f, i) => (
            <button
              key={f + "-" + i}
              className={`admin-filter-tab ${statusFilter === f ? "active" : ""}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        {/* Removed duplicate filter-tabs */}
        <div className="admin-view-toggle">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
          >
            ⊞
          </button>
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            ≡
          </button>
        </div>
      </div>
      {view === "grid" ? (
        <div className="admin-customer-grid">
          {filtered.map((c, i) => (
            <div className="admin-customer-card" key={c.id || c.email || i}>
              <div className="admin-customer-card-top">
                <div className="admin-cust-avatar">{c.name[0]}</div>
                <AdminCustStatusBadge status={c.status} />
              </div>
              <h3 className="admin-cust-name">{c.name}</h3>
              <p className="admin-cust-email">{c.email}</p>
              <div className="admin-cust-divider" />
              <div className="admin-cust-detail">
                <span>🏠</span> {c.property}
              </div>
              <div className="admin-cust-detail">
                <span>📅</span> {c.lease}
              </div>
              <div className="admin-cust-detail">
                <span>💳</span> {c.rent}/mo
              </div>
              <div className="admin-cust-rating">
                {"★".repeat(c.rating)}
                {"☆".repeat(5 - c.rating)}
              </div>
              <div className="admin-cust-actions">
                <button className="admin-cust-btn">Message</button>
                <button className="admin-cust-btn admin-cust-btn--ghost">View</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-customer-list-card">
          <table className="admin-customer-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Property</th>
                <th>Lease Period</th>
                <th>Monthly Rent</th>
                <th>Rating</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id || c.email || i}>
                  <td>
                    <div className="admin-tenant-cell">
                      <div className="admin-tenant-avatar-sm">{c.name[0]}</div>
                      <div>
                        <p className="admin-t-name">{c.name}</p>
                        <p className="admin-t-email">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{c.property}</td>
                  <td className="admin-text-muted">{c.lease}</td>
                  <td className="admin-text-bold">{c.rent}</td>
                  <td className="admin-rating-cell">
                    {"★".repeat(c.rating)}
                    {"☆".repeat(5 - c.rating)}
                  </td>
                  <td>
                    <AdminCustStatusBadge status={c.status} />
                  </td>
                  <td>
                    <button className="admin-row-menu">⋯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="admin-empty-state">No tenants match your search.</div>
      )}
    </div>
  );
}

function AdminCustStatusBadge({ status }) {
  const styles =
    {
      Active: { bg: "var(--successLight)", color: "#0a8c6b" },
      Inactive: { bg: "var(--errorLight)", color: "var(--errorRed)" },
      Pending: { bg: "#fff8e6", color: "#c97d10" },
    }[status] || {};
  return (
    <span
      className="admin-cust-status-badge"
      style={{ background: styles.bg, color: styles.color }}
    >
      ● {status}
    </span>
  );
}
