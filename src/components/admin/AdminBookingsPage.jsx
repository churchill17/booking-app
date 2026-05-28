import React, { useState } from "react";

const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

function fmtDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function fmtRange(a, b) {
  if (!a || !b) return "—";
  const da = new Date(a), db = new Date(b);
  if (isNaN(da) || isNaN(db)) return "—";
  const opts = { day: "numeric", month: "short" };
  return `${da.toLocaleDateString("en-GB", opts)} – ${db.toLocaleDateString("en-GB", opts)}`;
}

function StatusBadge({ status, kind = "booking" }) {
  const s = String(status || "").toLowerCase();
  const bookingMap = {
    pending:   "ap-badge--pending",
    confirmed: "ap-badge--confirmed",
    cancelled: "ap-badge--cancelled",
    completed: "ap-badge--completed",
  };
  const payMap = {
    paid:     "ap-badge--paid",
    unpaid:   "ap-badge--unpaid",
    refunded: "ap-badge--refunded",
  };
  const map = kind === "payment" ? payMap : bookingMap;
  const cls = map[s] || "ap-badge--pending";
  const label = s.charAt(0).toUpperCase() + s.slice(1) || "—";
  return <span className={`ap-badge ${cls}`}>{label}</span>;
}

const PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><rect width='44' height='44' rx='8' fill='%23f0ede8'/><path d='M8 32l8-9 6 6 8-10 8 13H8z' fill='%23c8c4bc'/></svg>";

const FILTERS = ["All", "Pending", "Confirmed", "Cancelled", "Completed"];

export default function AdminBookingsPage({ bookings = [], isLoading = false, error = "", onRefresh }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const totalAmount = bookings.reduce((s, b) => s + Number(b.totalPrice || 0), 0);
  const paidCount = bookings.filter((b) => b.paymentStatus === "paid").length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  const statCards = [
    { label: "Total bookings", value: String(bookings.length), icon: "ti-calendar-event", color: "#e8f0fe", iconColor: "#1a3a5c" },
    { label: "Confirmed",      value: String(confirmedCount),  icon: "ti-circle-check",   color: "#f0fdf4", iconColor: "#15803d" },
    { label: "Pending",        value: String(pendingCount),    icon: "ti-clock",           color: "#fff8e6", iconColor: "#b45309" },
    { label: "Total value",    value: ngn.format(totalAmount), icon: "ti-currency-naira",  color: "#fefce8", iconColor: "#b45309" },
  ];

  const filtered = bookings.filter((b) => {
    const s = String(b.status || "").toLowerCase();
    const fNorm = filter.toLowerCase();
    const matchFilter = filter === "All" || s === fNorm;
    const q = search.toLowerCase();
    const matchSearch =
      `${b.guestFirstName} ${b.guestLastName}`.toLowerCase().includes(q) ||
      (b.propertyName || "").toLowerCase().includes(q) ||
      String(b.id || "").includes(q) ||
      (b.guestEmail || "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      <div className="ap-header">
        <div>
          <h1 className="ap-title">Bookings</h1>
          <p className="ap-subtitle">All platform bookings across every host</p>
        </div>
        <button className="ap-btn ap-btn--ghost" onClick={onRefresh}>
          <i className="ti ti-refresh" aria-hidden="true" /> Refresh
        </button>
      </div>

      {error && <div className="ap-error"><i className="ti ti-alert-circle" style={{ marginRight: 6 }} />{error}</div>}

      <div className="ap-stat-grid ap-stat-grid--4">
        {statCards.map((s) => (
          <div className="ap-stat-card" key={s.label}>
            <div className="ap-stat-icon" style={{ background: s.color }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.iconColor }} aria-hidden="true" />
            </div>
            <div>
              <p className="ap-stat-label">{s.label}</p>
              <p className="ap-stat-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-card">
        <div className="ap-toolbar">
          <div className="ap-search">
            <i className="ti ti-search" aria-hidden="true" />
            <input placeholder="Search by guest, property, ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="ap-filter-tabs">
            {FILTERS.map((f) => (
              <button key={f} className={`ap-filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="ap-loading"><i className="ti ti-loader-2" style={{ marginRight: 6 }} />Loading bookings…</div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty"><i className="ti ti-calendar-off" />No bookings found.</div>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table" style={{ minWidth: 860 }}>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Property</th>
                  <th>Stay</th>
                  <th>Nights</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Booked</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="ap-avatar">
                          {(b.guestFirstName || b.guestEmail || "G")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="ap-name">
                            {`${b.guestFirstName || ""} ${b.guestLastName || ""}`.trim() || "Guest"}
                          </div>
                          <div className="ap-muted">{b.guestEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <img
                          src={b.propertyImage || PLACEHOLDER}
                          alt=""
                          style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                        />
                        <div>
                          <div className="ap-name">{b.propertyName || "—"}</div>
                          <div className="ap-muted">
                            {[b.propertyType, b.propertyCity].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="ap-muted" style={{ whiteSpace: "nowrap" }}>{fmtRange(b.checkIn, b.checkOut)}</td>
                    <td style={{ textAlign: "center" }}>{b.nights || 1}</td>
                    <td style={{ textAlign: "center" }}>{b.guests}</td>
                    <td className="ap-bold">{ngn.format(Number(b.totalPrice) || 0)}</td>
                    <td className="ap-muted" style={{ whiteSpace: "nowrap" }}>{fmtDate(b.bookingDate)}</td>
                    <td><StatusBadge status={b.status} kind="booking" /></td>
                    <td><StatusBadge status={b.paymentStatus} kind="payment" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}