import React, { useMemo, useState } from "react";

/**
 * Derives real users from bookings data.
 * Groups bookings by guest email and shows meaningful info from what we have.
 */
function deriveCustomers(bookings) {
  const map = {};

  bookings.forEach((b) => {
    const key = b.guestEmail || `guest-${b.id}`;
    if (!map[key]) {
      map[key] = {
        email: b.guestEmail || "",
        firstName: b.guestFirstName || "",
        lastName: b.guestLastName || "",
        phone: b.guestPhone || "",
        bookings: [],
      };
    }
    map[key].bookings.push(b);
  });

  return Object.values(map).map((c) => {
    const totalSpent = c.bookings.reduce((s, b) => s + Number(b.totalPrice || 0), 0);
    const lastBooking = c.bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))[0];
    const statuses = c.bookings.map((b) => b.status);
    const hasActive = statuses.some((s) => s === "confirmed");
    const hasPending = statuses.some((s) => s === "pending");
    const userStatus = hasActive ? "active" : hasPending ? "pending" : "inactive";

    return {
      email: c.email,
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone,
      totalBookings: c.bookings.length,
      totalSpent,
      lastProperty: lastBooking?.propertyName || "",
      lastStay: lastBooking?.checkIn || "",
      status: userStatus,
    };
  });
}

const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

function fmtDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }) {
  const cls = { active: "ap-badge--confirmed", pending: "ap-badge--pending", inactive: "ap-badge--unpaid" }[status] || "ap-badge--pending";
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`ap-badge ${cls}`}>{label}</span>;
}

const FILTERS = ["All", "Active", "Pending", "Inactive"];

export default function AdminCustomerPage({ bookings = [], isLoading = false }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("list");

  const customers = useMemo(() => deriveCustomers(bookings), [bookings]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.lastProperty || "").toLowerCase().includes(q);
    const matchFilter = filter === "All" || c.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const totalActive   = customers.filter((c) => c.status === "active").length;
  const totalPending  = customers.filter((c) => c.status === "pending").length;
  const totalInactive = customers.filter((c) => c.status === "inactive").length;
  const totalSpend    = customers.reduce((s, c) => s + c.totalSpent, 0);

  const statCards = [
    { label: "Total guests",   value: String(customers.length), icon: "ti-users",          color: "#e8f0fe", iconColor: "#1a3a5c" },
    { label: "Active",         value: String(totalActive),      icon: "ti-circle-check",   color: "#f0fdf4", iconColor: "#15803d" },
    { label: "Pending",        value: String(totalPending),     icon: "ti-clock",           color: "#fff8e6", iconColor: "#b45309" },
    { label: "Total spend",    value: ngn.format(totalSpend),   icon: "ti-currency-naira",  color: "#fefce8", iconColor: "#b45309" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      <div className="ap-header">
        <div>
          <h1 className="ap-title">Customers</h1>
          <p className="ap-subtitle">{customers.length} guests derived from booking records</p>
        </div>
        <div style={{ display: "flex", gap: 6, background: "#fff", border: "1px solid #e0ddd6", borderRadius: 8, overflow: "hidden", padding: 2 }}>
          <button
            onClick={() => setView("list")}
            style={{ padding: "6px 12px", border: "none", borderRadius: 6, background: view === "list" ? "#1a3a5c" : "transparent", color: view === "list" ? "#fff" : "#7a7a72", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
          >
            <i className="ti ti-list" style={{ marginRight: 4 }} />List
          </button>
          <button
            onClick={() => setView("grid")}
            style={{ padding: "6px 12px", border: "none", borderRadius: 6, background: view === "grid" ? "#1a3a5c" : "transparent", color: view === "grid" ? "#fff" : "#7a7a72", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
          >
            <i className="ti ti-layout-grid" style={{ marginRight: 4 }} />Grid
          </button>
        </div>
      </div>

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
            <input placeholder="Search by name, email, property…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="ap-filter-tabs">
            {FILTERS.map((f) => (
              <button key={f} className={`ap-filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="ap-loading"><i className="ti ti-loader-2" style={{ marginRight: 6 }} />Loading guests…</div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty"><i className="ti ti-user-off" />No guests found.</div>
        ) : view === "list" ? (
          <div className="ap-table-wrap">
            <table className="ap-table" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Phone</th>
                  <th>Last property</th>
                  <th>Last stay</th>
                  <th>Bookings</th>
                  <th>Total spent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const initials = [c.firstName, c.lastName].filter(Boolean).map((n) => n[0].toUpperCase()).join("") || (c.email[0] || "G").toUpperCase();
                  const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Guest";
                  return (
                    <tr key={c.email}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="ap-avatar">{initials}</div>
                          <div>
                            <div className="ap-name">{fullName}</div>
                            <div className="ap-muted">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="ap-muted">{c.phone || "—"}</td>
                      <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastProperty || "—"}</td>
                      <td className="ap-muted">{fmtDate(c.lastStay)}</td>
                      <td style={{ textAlign: "center", fontWeight: 600 }}>{c.totalBookings}</td>
                      <td className="ap-bold">{ngn.format(c.totalSpent)}</td>
                      <td><StatusBadge status={c.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, padding: 20 }}>
            {filtered.map((c) => {
              const initials = [c.firstName, c.lastName].filter(Boolean).map((n) => n[0].toUpperCase()).join("") || (c.email[0] || "G").toUpperCase();
              const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Guest";
              return (
                <div key={c.email} style={{ background: "#faf9f6", border: "1px solid #e8e5de", borderRadius: 12, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div className="ap-avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{initials}</div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="ap-name" style={{ marginBottom: 2 }}>{fullName}</div>
                  <div className="ap-muted" style={{ marginBottom: 12 }}>{c.email}</div>
                  <div style={{ height: 1, background: "#e8e5de", marginBottom: 12 }} />
                  <div style={{ fontSize: 12, color: "#5a5a52", display: "flex", flexDirection: "column", gap: 5 }}>
                    {c.phone && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="ti ti-phone" style={{ fontSize: 13 }} aria-hidden="true" />
                        {c.phone}
                      </div>
                    )}
                    {c.lastProperty && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="ti ti-building" style={{ fontSize: 13 }} aria-hidden="true" />
                        {c.lastProperty}
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <i className="ti ti-calendar-event" style={{ fontSize: 13 }} aria-hidden="true" />
                      {c.totalBookings} booking{c.totalBookings !== 1 ? "s" : ""}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <i className="ti ti-currency-naira" style={{ fontSize: 13 }} aria-hidden="true" />
                      {ngn.format(c.totalSpent)} spent
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}