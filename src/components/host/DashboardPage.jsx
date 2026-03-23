import React from "react";
import "./DashboardPage.css";

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

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
  error = "",
  onRefresh,
  dashboardHost = null,
  dashboardStats = null,
  dashboardLoading = false,
  dashboardError = "",
}) {
  const totalProperties = dashboardStats?.totalProperties ?? listings.length;
  const pendingCount = dashboardStats?.pendingBookings ?? 0;
  const cancelledCount = dashboardStats?.cancelledBookings ?? 0;
  const totalBookings = dashboardStats?.totalBookings ?? 0;
  const averageRating = dashboardStats?.averageRating ?? 0;
  const totalEarnings = dashboardStats?.totalEarnings ?? 0;
  const fullName = [dashboardHost?.firstName, dashboardHost?.lastName]
    .filter(Boolean)
    .join(" ");
  const welcomeName = fullName || dashboardHost?.firstName || "Host";

  const stats = [
    {
      label: "Properties",
      value: dashboardLoading
        ? "..."
        : `${numberFormatter.format(totalProperties)} Properties`,
      change: "Listed",
      up: true,
      icon: "🏠",
    },
    {
      label: "Bookings",
      value: dashboardLoading
        ? "..."
        : `${numberFormatter.format(totalBookings)} Bookings`,
      change: "All time",
      up: true,
      icon: "📘",
    },
    {
      label: "Earnings",
      value: dashboardLoading
        ? "..."
        : currencyFormatter.format(Number(totalEarnings) || 0),
      change: "Paid",
      up: true,
      icon: "💰",
    },
    {
      label: "Rating",
      value: dashboardLoading ? "..." : `${averageRating} / 5 stars`,
      change: "Reviews",
      up: true,
      icon: "⭐",
    },
  ];

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
          <p className="page-subtitle">Welcome back, {welcomeName}</p>
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

      {dashboardError ? (
        <div className="dashboard-card" role="alert">
          <div className="card-header">
            <h2 className="card-title">Could not load dashboard stats</h2>
            <button className="btn-ghost" onClick={onRefresh}>
              Retry →
            </button>
          </div>
          <p className="text-muted">{dashboardError}</p>
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
        <div className="stat-card stat-card--pending">
          <div className="stat-icon stat-icon--pending">⏳</div>
          <div className="stat-info">
            <p className="stat-label">Pending</p>
            <p className="stat-value">
              {dashboardLoading
                ? "..."
                : `${numberFormatter.format(pendingCount)} Pending`}
            </p>
          </div>
          <span className="stat-change stat-change--pending">Attention</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <p className="stat-label">Cancelled</p>
            <p className="stat-value">
              {dashboardLoading ? "..." : cancelledCount}
            </p>
          </div>
          <span className="stat-change stat-change--down">Closed</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-card--wide">
          <div className="card-header">
            <h2 className="card-title">Recent Bookings</h2>
            <button
              className="btn-ghost"
              onClick={() => setActivePage("bookings")}
            >
              View All →
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Property</th>
                <th>Guest</th>
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
