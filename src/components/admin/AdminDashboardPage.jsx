import "./AdminDashboardPage.css";

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

export default function AdminDashboardPage({
  setActivePage,
  listings = [],
  bookings = [],
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
      value: dashboardLoading ? "..." : `${numberFormatter.format(totalProperties)} Properties`,
      change: "Listed",
      up: true,
      icon: "🏠",
    },
    {
      label: "Bookings",
      value: dashboardLoading ? "..." : `${numberFormatter.format(totalBookings)} Bookings`,
      change: "All time",
      up: true,
      icon: "📘",
    },
    {
      label: "Earnings",
      value: dashboardLoading ? "..." : currencyFormatter.format(Number(totalEarnings) || 0),
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

  const topPropertyRows = listings.slice(0, 4).map((item) => ({
    name: item.propertyName,
    location: [item.address, item.city, item.country].filter(Boolean).join(", "),
    revenue: item.originalPrice ? `NGN ${item.originalPrice}` : "—",
    occupancy: 0,
  }));

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back, {welcomeName}</p>
        </div>
        <button className="admin-btn-primary" onClick={() => setActivePage("property")}>
          + Add Property
        </button>
      </div>

      {error && (
        <div className="admin-dashboard-card" role="alert">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Could not sync listings</h2>
            <button className="admin-btn-ghost" onClick={onRefresh}>Retry →</button>
          </div>
          <p className="admin-text-muted">{error}</p>
        </div>
      )}

      {dashboardError && (
        <div className="admin-dashboard-card" role="alert">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Could not load dashboard stats</h2>
            <button className="admin-btn-ghost" onClick={onRefresh}>Retry →</button>
          </div>
          <p className="admin-text-muted">{dashboardError}</p>
        </div>
      )}

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="admin-stat-card" key={i}>
            <div className="admin-stat-icon">{s.icon}</div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">{s.label}</p>
              <p className="admin-stat-value">{s.value}</p>
            </div>
            <span className={`admin-stat-change ${s.up ? "admin-stat-change--up" : "admin-stat-change--down"}`}>
              {s.up ? "↑" : "↓"} {s.change}
            </span>
          </div>
        ))}
        <div className="admin-stat-card admin-stat-card--pending">
          <div className="admin-stat-icon admin-stat-icon--pending">⏳</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Pending</p>
            <p className="admin-stat-value">
              {dashboardLoading ? "..." : `${numberFormatter.format(pendingCount)} Pending`}
            </p>
          </div>
          <span className="admin-stat-change admin-stat-change--pending">Attention</span>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">❌</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Cancelled</p>
            <p className="admin-stat-value">
              {dashboardLoading ? "..." : cancelledCount}
            </p>
          </div>
          <span className="admin-stat-change admin-stat-change--down">Closed</span>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-card admin-dashboard-card--wide">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Bookings</h2>
            <button className="admin-btn-ghost" onClick={() => setActivePage("bookings")}>
              View All →
            </button>
          </div>
          {bookings.length === 0 ? (
            <p className="admin-text-muted" style={{ padding: "1rem" }}>No bookings yet.</p>
          ) : (
            <table className="admin-data-table">
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
                {bookings.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    <td className="order-id">{row.id}</td>
                    <td>{row.propertyName}</td>
                    <td>{row.guestFirstName} {row.guestLastName}</td>
                    <td className="text-muted">{row.checkIn} — {row.checkOut}</td>
                    <td className="text-bold">{currencyFormatter.format(row.totalPrice)}</td>
                    <td><AdminStatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-dashboard-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Top Properties</h2>
            <button className="admin-btn-ghost" onClick={() => setActivePage("property")}>
              View All →
            </button>
          </div>
          {topPropertyRows.length === 0 ? (
            <p className="admin-text-muted" style={{ padding: "1rem" }}>No properties listed yet.</p>
          ) : (
            <div className="admin-property-list">
              {topPropertyRows.map((p, i) => (
                <div className="admin-property-item" key={i}>
                  <div className="admin-property-rank">#{i + 1}</div>
                  <div className="admin-property-info">
                    <p className="admin-property-name">{p.name}</p>
                    <p className="admin-property-loc">{p.location}</p>
                    <div className="admin-occupancy-bar">
                      <div className="admin-occupancy-fill" style={{ width: `${p.occupancy}%` }} />
                    </div>
                  </div>
                  <div className="admin-property-rev">
                    <p className="admin-rev-value">{p.revenue}</p>
                    <p className="admin-rev-occ">{p.occupancy}% occ.</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminStatusBadge({ status }) {
  const cls = {
    success: "badge-success",
    canceled: "badge-error",
    cancelled: "badge-error",
    pending: "badge-warning",
  }[status?.toLowerCase()] || "badge-default";
  return <span className={`status-badge ${cls}`}>● {status}</span>;
}