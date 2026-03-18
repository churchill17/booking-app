import React from "react";
import "./DashboardPage.css";

const stats = [
  {
    label: "Total Revenue",
    value: "$284,540",
    change: "+12.5%",
    up: true,
    icon: "💰",
  },
  {
    label: "Total Properties",
    value: "1,284",
    change: "+3.2%",
    up: true,
    icon: "🏠",
  },
  {
    label: "Active Tenants",
    value: "847",
    change: "-1.4%",
    up: false,
    icon: "�",
  },
  {
    label: "Occupancy Rate",
    value: "89.4%",
    change: "+0.8%",
    up: true,
    icon: "📊",
  },
];

const recentActivity = [
  {
    id: "#95103",
    property: "Saints Lawrence",
    tenant: "Alex M.",
    date: "23/07/2022",
    amount: "$2,334",
    status: "Success",
  },
  {
    id: "#37423",
    property: "Sanbruto Saburo",
    tenant: "Jamie L.",
    date: "02/11/2022",
    amount: "$5,699",
    status: "Canceled",
  },
  {
    id: "#86543",
    property: "Homexyde",
    tenant: "Chris P.",
    date: "12/12/2022",
    amount: "$7,334",
    status: "Success",
  },
  {
    id: "#16343",
    property: "Gundi Mani",
    tenant: "Dana R.",
    date: "10/12/2022",
    amount: "$10,334",
    status: "Success",
  },
  {
    id: "#63443",
    property: "Homexyde",
    tenant: "Sam K.",
    date: "08/12/2022",
    amount: "$454",
    status: "Pending",
  },
];

const topProperties = [
  {
    name: "Saints Lawrence",
    location: "248 Lawrence Hargrave Dr.",
    revenue: "$28,400",
    occupancy: 95,
  },
  {
    name: "Gundi Mani",
    location: "Intermedience, Gorontalo",
    revenue: "$21,200",
    occupancy: 88,
  },
  {
    name: "Homexyde",
    location: "Pajamasa, Kristio, 332",
    revenue: "$17,800",
    occupancy: 76,
  },
  {
    name: "Sanbruto Saburo",
    location: "775 Rolling Green Rd.",
    revenue: "$14,600",
    occupancy: 65,
  },
];

export default function DashboardPage({
  setActivePage,
  listings = [],
  isLoading = false,
  error = "",
  onRefresh,
}) {
  const totalProperties = listings.length;
  const pendingCount = listings.filter(
    (item) => item.status === "Pending",
  ).length;
  const successCount = listings.filter(
    (item) => item.status === "Success",
  ).length;

  const dynamicTopProperties = listings.slice(0, 4).map((item) => ({
    name: item.propertyName,
    location: [item.address, item.city, item.country]
      .filter(Boolean)
      .join(", "),
    revenue: item.price ? `$${item.price}` : "$0",
    occupancy:
      item.status === "Success" ? 92 : item.status === "Pending" ? 58 : 35,
  }));

  const topPropertyRows = dynamicTopProperties.length
    ? dynamicTopProperties
    : topProperties;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, Banrisk 👋 Here's what's happening today.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setActivePage("property")}
        >
          + Add Property
        </button>
      </div>

      {error ? (
        <div className="dashboard-card" role="alert">
          <div className="card-header">
            <h2 className="card-title">Could not sync listings</h2>
            <button className="btn-ghost" onClick={onRefresh}>
              Retry →
            </button>
          </div>
          <p className="text-muted">{error}</p>
        </div>
      ) : null}

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
            </div>
            <span
              className={`stat-change ${s.up ? "stat-change--up" : "stat-change--down"}`}
            >
              {s.up ? "↑" : "↓"} {s.change}
            </span>
          </div>
        ))}
        <div className="stat-card">
          <div className="stat-icon">🗂</div>
          <div className="stat-info">
            <p className="stat-label">Synced Listings</p>
            <p className="stat-value">{isLoading ? "..." : totalProperties}</p>
          </div>
          <span className="stat-change stat-change--up">Live</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <p className="stat-label">Pending Listings</p>
            <p className="stat-value">{isLoading ? "..." : pendingCount}</p>
          </div>
          <span className="stat-change stat-change--down">Review</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p className="stat-label">Successful Listings</p>
            <p className="stat-value">{isLoading ? "..." : successCount}</p>
          </div>
          <span className="stat-change stat-change--up">Done</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-card--wide">
          <div className="card-header">
            <h2 className="card-title">Recent Transactions</h2>
            <button
              className="btn-ghost"
              onClick={() => setActivePage("payment")}
            >
              View All →
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Property</th>
                <th>Tenant</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((row, i) => (
                <tr key={i}>
                  <td className="order-id">{row.id}</td>
                  <td>{row.property}</td>
                  <td>{row.tenant}</td>
                  <td className="text-muted">{row.date}</td>
                  <td className="text-bold">{row.amount}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Top Properties</h2>
            <button
              className="btn-ghost"
              onClick={() => setActivePage("property")}
            >
              View All →
            </button>
          </div>
          <div className="property-list">
            {topPropertyRows.map((p, i) => (
              <div className="property-item" key={i}>
                <div className="property-rank">#{i + 1}</div>
                <div className="property-info">
                  <p className="property-name">{p.name}</p>
                  <p className="property-loc">{p.location}</p>
                  <div className="occupancy-bar">
                    <div
                      className="occupancy-fill"
                      style={{ width: `${p.occupancy}%` }}
                    />
                  </div>
                </div>
                <div className="property-rev">
                  <p className="rev-value">{p.revenue}</p>
                  <p className="rev-occ">{p.occupancy}% occ.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const cls =
    {
      Success: "badge-success",
      Canceled: "badge-error",
      Pending: "badge-warning",
    }[status] || "badge-default";
  return <span className={`status-badge ${cls}`}>● {status}</span>;
}
