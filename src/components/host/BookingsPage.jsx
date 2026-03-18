import React, { useState } from "react";
import "./BookingsPage.css";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' rx='12' fill='%23ede9e1'/><path d='M15 67l18-19 12 12 18-22 18 29H15z' fill='%23b3aca9'/><circle cx='33' cy='30' r='7' fill='%23d5cfc0'/></svg>";

const formatDateRange = (checkIn, checkOut) => {
  const format = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return `${format(checkIn)} to ${format(checkOut)}`;
};

const formatBookedOn = (value) => {
  if (!value) return "Booked on -";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Booked on -";
  return `Booked on ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const toTitleCase = (value) =>
  String(value || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export default function BookingsPage({
  bookings = [],
  isLoading = false,
  error = "",
  onRefresh,
}) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const summaries = [
    {
      label: "Total Bookings",
      value: String(bookings.length),
      icon: "📘",
      color: "var(--midnightBlue)",
    },
    {
      label: "Pending",
      value: String(
        bookings.filter((item) => item.status === "pending").length,
      ),
      icon: "⏳",
      color: "#c97d10",
    },
    {
      label: "Paid",
      value: String(
        bookings.filter((item) => item.paymentStatus === "paid").length,
      ),
      icon: "✅",
      color: "var(--teal)",
    },
    {
      label: "Total Amount",
      value: currencyFormatter.format(
        bookings.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0),
      ),
      icon: "💵",
      color: "var(--teal)",
    },
  ];

  const filtered = bookings.filter((booking) => {
    const normalizedStatus = toTitleCase(booking.status);
    const matchFilter = filter === "All" || normalizedStatus === filter;
    const matchSearch =
      `${booking.guestFirstName} ${booking.guestLastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(search.toLowerCase()) ||
      String(booking.id || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="payment-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">Track and manage all host bookings</p>
        </div>
        <button className="btn-primary" type="button" onClick={onRefresh}>
          Refresh bookings
        </button>
      </div>

      <div className="payment-summary">
        {summaries.map((s, i) => (
          <div className="pay-summary-card" key={i}>
            <div className="pay-icon" style={{ background: `${s.color}18` }}>
              <span>{s.icon}</span>
            </div>
            <div>
              <p className="pay-label">{s.label}</p>
              <p className="pay-value" style={{ color: s.color }}>
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-card">
        <div className="payment-toolbar">
          <div className="search-box">
            <span>🔍</span>
            <input
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {["All", "Pending", "Confirmed", "Cancelled", "Completed"].map(
              (f) => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ),
            )}
          </div>
        </div>

        {error ? <div className="empty-state">{error}</div> : null}

        <table className="payment-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Property</th>
              <th>Stay</th>
              <th>Guests</th>
              <th>Amount</th>
              <th>Booked On</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => (
              <tr key={booking.id}>
                <td className="tenant-cell">
                  <div className="tenant-avatar">
                    {(booking.guestFirstName || booking.guestEmail || "G")[0]}
                  </div>
                  <div>
                    <div className="tenant-name">
                      {`${booking.guestFirstName} ${booking.guestLastName}`.trim() ||
                        "Guest"}
                    </div>
                    <div className="text-muted">{booking.guestEmail}</div>
                  </div>
                </td>
                <td>
                  <div className="property-booking-cell">
                    <img
                      className="property-booking-image"
                      src={booking.propertyImage || PLACEHOLDER_IMAGE}
                      alt={booking.propertyName}
                    />
                    <div>
                      <div className="property-booking-name">
                        {booking.propertyName}
                      </div>
                      <div className="text-muted">
                        {toTitleCase(booking.propertyType)}
                        {booking.propertyCity
                          ? `, ${booking.propertyCity}`
                          : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-muted">
                  {formatDateRange(booking.checkIn, booking.checkOut)}
                </td>
                <td>{`${booking.guests} guests`}</td>
                <td className="amount-cell">
                  {currencyFormatter.format(booking.totalPrice)}
                </td>
                <td className="text-muted">
                  {formatBookedOn(booking.bookingDate)}
                </td>
                <td>
                  <PayStatusBadge kind="booking" status={booking.status} />
                </td>
                <td>
                  <PayStatusBadge
                    kind="payment"
                    status={booking.paymentStatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading ? (
          <div className="empty-state">Loading bookings...</div>
        ) : null}
        {!isLoading && filtered.length === 0 ? (
          <div className="empty-state">No bookings found.</div>
        ) : null}
      </div>
    </div>
  );
}

function PayStatusBadge({ status, kind }) {
  const normalized = String(status || "").toLowerCase();
  const bookingStyles = {
    pending: { bg: "#fff8e6", color: "#c97d10", label: "Pending" },
    confirmed: {
      bg: "var(--successLight)",
      color: "#0a8c6b",
      label: "Confirmed",
    },
    cancelled: {
      bg: "var(--errorLight)",
      color: "var(--errorRed)",
      label: "Cancelled",
    },
    completed: { bg: "#e8f1ff", color: "#2563eb", label: "Completed" },
  };
  const paymentStyles = {
    unpaid: {
      bg: "var(--errorLight)",
      color: "var(--errorRed)",
      label: "Unpaid",
    },
    paid: { bg: "var(--successLight)", color: "#0a8c6b", label: "Paid" },
    refunded: { bg: "#fff8e6", color: "#c97d10", label: "Refunded" },
  };

  const styles = (kind === "payment" ? paymentStyles : bookingStyles)[
    normalized
  ] || {
    bg: "var(--softBeige)",
    color: "var(--textMid)",
    label: toTitleCase(normalized),
  };

  return (
    <span
      className="pay-status"
      style={{ background: styles.bg, color: styles.color }}
    >
      ● {styles.label}
    </span>
  );
}
