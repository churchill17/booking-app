import React from "react";
import "./AdminHost.css";
const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-US");

function fmt(v) { return num.format(Number(v) || 0); }

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  const cls = {
    confirmed: "ap-badge--confirmed",
    pending:   "ap-badge--pending",
    cancelled: "ap-badge--cancelled",
    completed: "ap-badge--completed",
  }[s] || "ap-badge--pending";
  return <span className={`ap-badge ${cls}`}>{status || "—"}</span>;
}

export default function AdminDashboardPage({
  setActivePage,
  listings = [],
  bookings = [],
  dashboardStats = null,
  dashboardLoading = false,
  dashboardError = "",
  error = "",
  onRefresh,
}) {
  const stats = dashboardStats || {};

  const statCards = [
    {
      label: "Total properties",
      value: dashboardLoading ? "…" : fmt(stats.totalProperties ?? listings.length),
      sub: `${fmt(stats.approvedProperties ?? 0)} approved · ${fmt(stats.pendingProperties ?? 0)} pending`,
      icon: "ti-building",
      color: "#e8f0fe",
      iconColor: "#1a3a5c",
    },
    {
      label: "Total bookings",
      value: dashboardLoading ? "…" : fmt(stats.totalBookings ?? bookings.length),
      sub: `${fmt(stats.confirmedBookings ?? 0)} confirmed · ${fmt(stats.pendingBookings ?? 0)} pending`,
      icon: "ti-calendar-event",
      color: "#f0fdf4",
      iconColor: "#15803d",
    },
    {
      label: "Total earnings",
      value: dashboardLoading ? "…" : ngn.format(Number(stats.totalEarnings) || 0),
      sub: "From paid bookings",
      icon: "ti-currency-naira",
      color: "#fefce8",
      iconColor: "#b45309",
    },
    {
      label: "Hosts",
      value: dashboardLoading ? "…" : fmt(stats.totalHosts ?? 0),
      sub: `${fmt(stats.totalGuests ?? 0)} guests registered`,
      icon: "ti-users",
      color: "#f3e8ff",
      iconColor: "#7e22ce",
    },
    {
      label: "Pending bookings",
      value: dashboardLoading ? "…" : fmt(stats.pendingBookings ?? 0),
      sub: "Awaiting confirmation",
      icon: "ti-clock",
      color: "#fff8e6",
      iconColor: "#b45309",
    },
    {
      label: "Cancelled",
      value: dashboardLoading ? "…" : fmt(stats.cancelledBookings ?? 0),
      sub: "Total cancellations",
      icon: "ti-x",
      color: "#fff0f0",
      iconColor: "#c0392b",
    },
  ];

  const recentBookings = bookings.slice(0, 6);

  const topProperties = listings
    .slice()
    .sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0))
    .slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div className="ap-header">
        <div>
          <h1 className="ap-title">Dashboard</h1>
          <p className="ap-subtitle">Platform-wide overview</p>
        </div>
        <button className="ap-btn ap-btn--ghost" onClick={onRefresh}>
          <i className="ti ti-refresh" aria-hidden="true" /> Refresh
        </button>
      </div>

      {(error || dashboardError) && (
        <div className="ap-error">
          <i className="ti ti-alert-circle" style={{ marginRight: 6 }} />
          {error || dashboardError}
        </div>
      )}

      {/* Stat cards */}
      <div className="admin-dash-stat-grid">
        {statCards.map((s) => (
          <div className="ap-stat-card" key={s.label}>
            <div className="ap-stat-icon" style={{ background: s.color }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.iconColor }} aria-hidden="true" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="ap-stat-label">{s.label}</p>
              <p className="ap-stat-value">{s.value}</p>
              <p style={{ fontSize: 11, color: "#9a9890", marginTop: 1 }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid: recent bookings + top properties */}
      <div className="admin-dash-bottom-grid">

        {/* Recent bookings */}
        <div className="ap-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e8e5de" }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: "#1a2b40" }}>Recent bookings</span>
            <button className="ap-btn ap-btn--ghost" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => setActivePage("bookings")}>
              View all <i className="ti ti-arrow-right" style={{ fontSize: 13 }} />
            </button>
          </div>
          {recentBookings.length === 0 ? (
            <div className="ap-empty"><i className="ti ti-calendar-off" />No bookings yet.</div>
          ) : (
            <div className="ap-table-wrap">
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="ap-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                            {(b.guestFirstName || b.guestEmail || "G")[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="ap-name" style={{ fontSize: 13 }}>
                              {`${b.guestFirstName || ""} ${b.guestLastName || ""}`.trim() || "Guest"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {b.propertyName || "—"}
                      </td>
                      <td className="ap-muted">
                        {b.checkIn && b.checkOut
                          ? `${new Date(b.checkIn).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${new Date(b.checkOut).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                          : "—"}
                      </td>
                      <td className="ap-bold">{ngn.format(Number(b.totalPrice) || 0)}</td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top properties by bookings */}
        <div className="ap-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e8e5de" }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: "#1a2b40" }}>Top properties</span>
            <button className="ap-btn ap-btn--ghost" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => setActivePage("property")}>
              View all <i className="ti ti-arrow-right" style={{ fontSize: 13 }} />
            </button>
          </div>
          {topProperties.length === 0 ? (
            <div className="ap-empty"><i className="ti ti-building-off" />No properties yet.</div>
          ) : (
            <div style={{ padding: "8px 0" }}>
              {topProperties.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderBottom: i < topProperties.length - 1 ? "1px solid #f0ede8" : "none" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1a2b40", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  {p.mainImage ? (
                    <img src={p.mainImage} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className="ti ti-building" style={{ fontSize: 18, color: "#9a9890" }} aria-hidden="true" />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ap-name" style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.propertyName}</div>
                    <div className="ap-muted">{p.city || "—"} · {p.totalBookings || 0} bookings</div>
                  </div>
                  <span className={`ap-badge ${p.isApproved ? "ap-badge--approved" : "ap-badge--pending"}`}>
                    {p.isApproved ? "Live" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}