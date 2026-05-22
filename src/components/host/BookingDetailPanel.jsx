import React, { useRef, useState } from "react";
import "./BookingDetailPanel.css";

// ── Icons ─────────────────────────────────────────────────────
const Icon = {
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  User: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Mail: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Phone: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.53 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 6 6l1.06-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Home: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Receipt: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z"/>
      <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Note: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// ── Helpers ───────────────────────────────────────────────────
const fmtDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d) ? val : d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const fmtCurrency = (amount, currency = "NGN") => {
  const n = Number(amount);
  if (!n && n !== 0) return "—";
  return `${currency} ${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const initials = (first, last) => {
  const f = (first || "")[0] || "";
  const l = (last  || "")[0] || "";
  return (f + l).toUpperCase() || "?";
};

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status, kind = "booking" }) {
  const bookingMap = {
    confirmed: { bg: "var(--successLight)", color: "#0a8c6b", label: "Confirmed" },
    pending:   { bg: "#fff8e6",             color: "#c97d10", label: "Pending" },
    cancelled: { bg: "var(--errorLight)",   color: "var(--errorRed)", label: "Cancelled" },
    completed: { bg: "#e8f1ff",             color: "#2563eb", label: "Completed" },
  };
  const paymentMap = {
    paid:      { bg: "var(--successLight)", color: "#0a8c6b", label: "Paid" },
    unpaid:    { bg: "var(--errorLight)",   color: "var(--errorRed)", label: "Unpaid" },
    refunded:  { bg: "#fff8e6",             color: "#c97d10", label: "Refunded" },
  };
  const map  = kind === "payment" ? paymentMap : bookingMap;
  const s    = map[String(status).toLowerCase()] || {
    bg: "var(--softBeige)", color: "var(--slateGray)", label: status,
  };
  return (
    <span className="bdp-badge" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ── Main Panel ────────────────────────────────────────────────
export default function BookingDetailPanel({ booking, onClose, onConfirmCheckIn }) {
  const overlayRef = useRef(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!booking) return null;

  const currency    = booking.currency || "NGN";
  const guestName   = [booking.guest_first_name, booking.guest_last_name].filter(Boolean).join(" ") || "Guest";
  const checkInTime = [booking.check_in_from, booking.check_in_until].filter(Boolean).join(" – ");
  const checkOutTime= [booking.check_out_from, booking.check_out_until].filter(Boolean).join(" – ");

  const isCheckInToday = (() => {
    if (!booking.check_in) return false;
    const today = new Date().toISOString().split("T")[0];
    return booking.check_in.substring(0, 10) === today;
  })();

  const canConfirmCheckIn =
    booking.status === "confirmed" &&
    !confirmed &&
    (isCheckInToday || new Date(booking.check_in) <= new Date());

  const handleConfirmCheckIn = async () => {
    setConfirming(true);
    try {
      if (onConfirmCheckIn) await onConfirmCheckIn(booking.booking_id);
      setConfirmed(true);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div
      className="bdp-overlay"
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bdp-panel">

        {/* ── Header ── */}
        <div className="bdp-header">
          <div className="bdp-header-left">
            <span className="bdp-ref">{booking.reference_number}</span>
            <div className="bdp-header-badges">
              <StatusBadge status={booking.status} kind="booking" />
              <StatusBadge status={booking.payment_status} kind="payment" />
            </div>
          </div>
          <button className="bdp-close" onClick={onClose}><Icon.Close /></button>
        </div>

        {/* ── Property ── */}
        <div className="bdp-property-strip">
          {booking.property_image ? (
            <img src={booking.property_image} alt={booking.property_name} className="bdp-property-img" />
          ) : (
            <div className="bdp-property-img-placeholder">🏨</div>
          )}
          <div>
            <div className="bdp-property-name">{booking.property_name}</div>
            <div className="bdp-property-meta">
              {[booking.property_address, booking.property_city, booking.property_country].filter(Boolean).join(", ")}
            </div>
            {booking.room_name && (
              <div className="bdp-property-room">
                <Icon.Home /> {booking.room_name}
              </div>
            )}
          </div>
        </div>

        {/* ── Check-in confirmation banner ── */}
        {canConfirmCheckIn && (
          <div className="bdp-checkin-banner">
            <div className="bdp-checkin-banner-text">
              <strong>Guest checking in {isCheckInToday ? "today" : "now"}</strong>
              <span>Confirm their arrival to mark this booking active</span>
            </div>
            <button
              className="bdp-checkin-btn"
              onClick={handleConfirmCheckIn}
              disabled={confirming}
            >
              <Icon.Check /> {confirming ? "Confirming…" : "Confirm check-in"}
            </button>
          </div>
        )}

        {confirmed && (
          <div className="bdp-confirmed-banner">
            <Icon.Check /> Check-in confirmed
          </div>
        )}

        {/* ── Stay dates ── */}
        <div className="bdp-section">
          <div className="bdp-section-label">Stay Details</div>
          <div className="bdp-dates-grid">
            <div className="bdp-date-block">
              <div className="bdp-date-label">Check-in</div>
              <div className="bdp-date-value">{fmtDate(booking.check_in)}</div>
              {checkInTime && <div className="bdp-date-time"><Icon.Clock /> {checkInTime}</div>}
            </div>
            <div className="bdp-date-arrow">→</div>
            <div className="bdp-date-block">
              <div className="bdp-date-label">Check-out</div>
              <div className="bdp-date-value">{fmtDate(booking.check_out)}</div>
              {checkOutTime && <div className="bdp-date-time"><Icon.Clock /> {checkOutTime}</div>}
            </div>
          </div>
          <div className="bdp-meta-row">
            <div className="bdp-meta-item">
              <Icon.Calendar />
              <span>{booking.nights} night{booking.nights !== 1 ? "s" : ""}</span>
            </div>
            <div className="bdp-meta-item">
              <Icon.User />
              <span>{booking.guests} guest{booking.guests !== 1 ? "s" : ""}</span>
            </div>
            {booking.arrival_time && (
              <div className="bdp-meta-item">
                <Icon.Clock />
                <span>Arriving {booking.arrival_time}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Guest details ── */}
        <div className="bdp-section">
          <div className="bdp-section-label">Guest</div>
          <div className="bdp-guest-row">
            <div className="bdp-guest-avatar">
              {initials(booking.guest_first_name, booking.guest_last_name)}
            </div>
            <div className="bdp-guest-info">
              <div className="bdp-guest-name">{guestName}</div>
              {booking.booking_for === "someone_else" && (
                <div className="bdp-guest-for">Booking for someone else</div>
              )}
            </div>
          </div>
          <div className="bdp-contact-list">
            {booking.guest_email && (
              <div className="bdp-contact-row">
                <Icon.Mail /><span>{booking.guest_email}</span>
              </div>
            )}
            {booking.guest_phone && (
              <div className="bdp-contact-row">
                <Icon.Phone /><span>{booking.guest_phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Special requests ── */}
        {booking.special_requests && (
          <div className="bdp-section">
            <div className="bdp-section-label">Special Requests</div>
            <div className="bdp-note-box">
              <Icon.Note />
              <span>{booking.special_requests}</span>
            </div>
          </div>
        )}

        {/* ── Price breakdown ── */}
        <div className="bdp-section">
          <div className="bdp-section-label">Price Breakdown</div>
          <div className="bdp-pricing">
            {booking.base_price > 0 && (
              <div className="bdp-price-row">
                <span>
                  {fmtCurrency(booking.base_price, currency)} × {booking.nights} night{booking.nights !== 1 ? "s" : ""}
                </span>
                <span>{fmtCurrency(booking.base_total, currency)}</span>
              </div>
            )}
            {booking.platform_fee > 0 && (
              <div className="bdp-price-row bdp-price-row--fee">
                <span>Platform service fee (12%)</span>
                <span>{fmtCurrency(booking.platform_fee, currency)}</span>
              </div>
            )}
            <div className="bdp-price-total">
              <span>Total paid</span>
              <span>{fmtCurrency(booking.total_price, currency)}</span>
            </div>
          </div>
        </div>

        {/* ── Booking meta ── */}
        <div className="bdp-section">
          <div className="bdp-section-label">Booking Info</div>
          <div className="bdp-info-grid">
            <div className="bdp-info-item">
              <span className="bdp-info-label">Reference</span>
              <span className="bdp-info-value bdp-info-value--ref">{booking.reference_number}</span>
            </div>
            <div className="bdp-info-item">
              <span className="bdp-info-label">Booked on</span>
              <span className="bdp-info-value">{fmtDate(booking.booking_date)}</span>
            </div>
            <div className="bdp-info-item">
              <span className="bdp-info-label">Payment</span>
              <StatusBadge status={booking.payment_status} kind="payment" />
            </div>
            <div className="bdp-info-item">
              <span className="bdp-info-label">Status</span>
              <StatusBadge status={booking.status} kind="booking" />
            </div>
          </div>
        </div>

        {/* ── Notes ── */}
        {booking.notes && (
          <div className="bdp-section">
            <div className="bdp-section-label">Internal Notes</div>
            <div className="bdp-note-box">
              <Icon.Note /><span>{booking.notes}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}