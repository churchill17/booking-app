import React, { useState } from "react";
import "./BookingsPage.css";
import BookingDetailPanel from "./BookingDetailPanel";

// ── Icons ─────────────────────────────────────────────────────
const Icon = {
  Bookings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Pending: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Paid: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Revenue: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

// ── Helpers ───────────────────────────────────────────────────
const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' rx='12' fill='%23ede9e1'/><path d='M15 67l18-19 12 12 18-22 18 29H15z' fill='%23b3aca9'/><circle cx='33' cy='30' r='7' fill='%23d5cfc0'/></svg>";

const formatDateRange = (checkIn, checkOut) => {
  const fmt = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  return `${fmt(checkIn)} → ${fmt(checkOut)}`;
};

const formatBookedOn = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const toTitleCase = (val) =>
  String(val || "").split(" ").filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");

// ── Status badge ──────────────────────────────────────────────
function PayStatusBadge({ status, kind }) {
  const normalized = String(status || "").toLowerCase();
  const bookingMap = {
    pending:   { bg: "#fff8e6",             color: "#c97d10",          label: "Pending" },
    confirmed: { bg: "var(--successLight)", color: "#0a8c6b",          label: "Confirmed" },
    cancelled: { bg: "var(--errorLight)",   color: "var(--errorRed)",  label: "Cancelled" },
    completed: { bg: "#e8f1ff",             color: "#2563eb",          label: "Completed" },
  };
  const paymentMap = {
    unpaid:   { bg: "var(--errorLight)",   color: "var(--errorRed)", label: "Unpaid" },
    paid:     { bg: "var(--successLight)", color: "#0a8c6b",         label: "Paid" },
    refunded: { bg: "#fff8e6",             color: "#c97d10",         label: "Refunded" },
  };
  const s = (kind === "payment" ? paymentMap : bookingMap)[normalized] || {
    bg: "var(--blueWhite)", color: "var(--textMid)", label: toTitleCase(normalized),
  };
  return (
    <span className="pay-status" style={{ background: s.bg, color: s.color }}>
      <span className="pay-status-dot" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────
export default function BookingsPage({
  bookings = [],
  isLoading = false,
  error = "",
  onRefresh,
  onConfirmCheckIn,
}) {
  const [filter, setFilter]               = useState("All");
  const [search, setSearch]               = useState("");
  const [selectedBooking, setSelected]    = useState(null);

  const summaries = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: <Icon.Bookings />,
      color: "var(--darkNavyBlue)",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: <Icon.Pending />,
      color: "#c97d10",
    },
    {
      label: "Paid",
      value: bookings.filter((b) => b.paymentStatus === "paid").length,
      icon: <Icon.Paid />,
      color: "#0a8c6b",
    },
    {
      label: "Total Revenue",
      value: currencyFormatter.format(
        bookings.reduce((s, b) => s + Number(b.totalPrice || 0), 0)
      ),
      icon: <Icon.Revenue />,
      color: "var(--steelBlue)",
      wide: true,
    },
  ];

  const filtered = bookings.filter((b) => {
    const matchFilter = filter === "All" || toTitleCase(b.status) === filter;
    const matchSearch =
      `${b.guestFirstName} ${b.guestLastName}`.toLowerCase().includes(search.toLowerCase()) ||
      (b.propertyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.reference_number || "").toLowerCase().includes(search.toLowerCase()) ||
      String(b.id || "").includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <div className="payment-page">

      {/* ── Header ── */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">Track and manage all reservations</p>
        </div>
        <button className="btn-primary" type="button" onClick={onRefresh}>
          <Icon.Refresh /> Refresh
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="payment-summary">
        {summaries.map((s) => (
          <div className={`pay-summary-card ${s.wide ? "pay-summary-card--wide" : ""}`} key={s.label}>
            <div className="pay-icon" style={{ background: `${s.color}18`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="pay-label">{s.label}</p>
              <p className="pay-value" style={{ color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="payment-card">
        <div className="payment-toolbar">
          <div className="search-box">
            <Icon.Search />
            <input
              placeholder="Search by guest, property or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {["All", "Pending", "Confirmed", "Cancelled", "Completed"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="empty-state">{error}</div>}

        <table className="payment-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Property</th>
              <th>Stay</th>
              <th>Ref</th>
              <th>Amount</th>
              <th>Booked on</th>
              <th>Status</th>
              <th>Payment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => (
              <tr
                key={booking.booking_id || booking.id}
                className={`bp-row ${selectedBooking?.booking_id === booking.booking_id ? "bp-row--active" : ""}`}
                onClick={() => setSelected(booking)}
              >
                <td>
                  <div className="tenant-cell">
                    <div className="tenant-avatar">
                      {(booking.guestFirstName || booking.guestEmail || "G")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="tenant-name">
                        {`${booking.guestFirstName} ${booking.guestLastName}`.trim() || "Guest"}
                      </div>
                      <div className="text-muted">{booking.guestEmail}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="property-booking-cell">
                    <img
                      className="property-booking-image"
                      src={booking.propertyImage || booking.property_image || PLACEHOLDER_IMAGE}
                      alt={booking.propertyName}
                    />
                    <div>
                      <div className="property-booking-name">{booking.propertyName}</div>
                      <div className="text-muted">
                        {toTitleCase(booking.propertyType)}
                        {booking.propertyCity ? `, ${booking.propertyCity}` : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-muted">
                  {formatDateRange(booking.checkIn || booking.check_in, booking.checkOut || booking.check_out)}
                  {booking.nights > 0 && (
                    <div style={{ fontSize: 11, marginTop: 2 }}>
                      {booking.nights} night{booking.nights !== 1 ? "s" : ""}
                    </div>
                  )}
                </td>
                <td>
                  <span className="bp-ref">
                    {booking.reference_number || `STV-${String(booking.booking_id || booking.id).padStart(6, "0")}`}
                  </span>
                </td>
                <td className="amount-cell">
                  {currencyFormatter.format(booking.totalPrice)}
                </td>
                <td className="text-muted">{formatBookedOn(booking.bookingDate || booking.booking_date)}</td>
                <td><PayStatusBadge kind="booking" status={booking.status} /></td>
                <td><PayStatusBadge kind="payment" status={booking.paymentStatus || booking.payment_status} /></td>
                <td>
                  <button
                    className="bp-view-btn"
                    onClick={(e) => { e.stopPropagation(); setSelected(booking); }}
                  >
                    <Icon.ChevronRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isLoading && <div className="empty-state">Loading bookings...</div>}
        {!isLoading && filtered.length === 0 && !error && (
          <div className="empty-state">No bookings found.</div>
        )}
      </div>

      {/* ── Detail panel ── */}
      {selectedBooking && (
        <BookingDetailPanel
          booking={selectedBooking}
          onClose={() => setSelected(null)}
          onConfirmCheckIn={onConfirmCheckIn}
        />
      )}
    </div>
  );
}