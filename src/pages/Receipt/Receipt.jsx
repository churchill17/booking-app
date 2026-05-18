import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Receipt.css";

const fmt = (n, currency = "NGN") =>
  `${currency} ${Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Stars = ({ count }) => {
  const n = Math.min(Math.max(Number(count) || 0, 0), 5);
  if (!n) return null;
  return (
    <span className="rcp__stars">
      {"★".repeat(n)}
      {"☆".repeat(5 - n)}
    </span>
  );
};

const InfoRow = ({ label, value, highlight }) => (
  <div className="rcp__info-row">
    <span className="rcp__info-label">{label}</span>
    <span className={`rcp__info-value${highlight ? " rcp__info-value--green" : ""}`}>
      {value || "—"}
    </span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="rcp__section-title">{children}</h3>
);

const Divider = () => <div className="rcp__divider" />;

export default function ReceiptMain() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state?.receiptData;

  if (!data) {
    return (
      <div className="rcp__empty">
        <div className="rcp__empty-icon">📄</div>
        <h2>No receipt found</h2>
        <p>This page is only accessible right after completing a booking.</p>
        <button className="rcp__back-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const {
    propertyName,
    propertyImage,
    propertyAddress,
    propertyStars,
    propertyRating,
    propertyRatingLabel,
    propertyReviewCount,
    refNumber,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
    nights,
    roomType,
    guests,
    breakfast,
    cancelDeadline,
    amenities = [],
    guestFirstName,
    guestLastName,
    guestEmail,
    guestPhone,
    arrivalTime,
    specialRequests,
    currency,
    basePrice,
    totalPrice,
    taxesIncluded,
    issuedAt,
  } = data;

  const guestName = [guestFirstName, guestLastName].filter(Boolean).join(" ") || "Guest";
  const displayBasePrice = basePrice > 0 ? fmt(basePrice, currency) : null;
  const displayTotal = totalPrice > 0 ? fmt(totalPrice, currency) : null;

  const perks = [
    breakfast,
    ...amenities.map(String),
  ].filter(Boolean).slice(0, 8);

  return (
    <div className="rcp__page">
      {/* ── Top bar ── */}
      <div className="rcp__topbar no-print">
        <button className="rcp__topbar-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button className="rcp__topbar-back" onClick={() => navigate("/")}>
          🏠 Home
        </button>
        <div className="rcp__topbar-actions">
          <button className="rcp__topbar-btn" onClick={() => window.print()}>
            🖨 Print
          </button>
        </div>
      </div>

      {/* ── Receipt card ── */}
      <div className="rcp__card">

        {/* ─── Header ─────────────────────────────────────────── */}
        <div className="rcp__header">
          <div className="rcp__brand">
            <span className="rcp__brand-logo">iBookNova</span>
            <span className="rcp__brand-tag">Booking Receipt</span>
          </div>
          <div className="rcp__ref-block">
            <span className="rcp__ref-label">Reference</span>
            <span className="rcp__ref-num">{refNumber || "—"}</span>
          </div>
        </div>

        {/* ─── Success banner ─────────────────────────────────── */}
        <div className="rcp__success">
          <div className="rcp__success-check">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M8 14l4 4 8-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="rcp__success-title">Booking Confirmed</p>
            <p className="rcp__success-sub">
              {guestEmail
                ? `A copy of this receipt was sent to ${guestEmail}`
                : "Your booking is confirmed"}
            </p>
          </div>
        </div>

        <Divider />

        {/* ─── Property ───────────────────────────────────────── */}
        <div className="rcp__property">
          {propertyImage && (
            <img
              src={propertyImage}
              alt={propertyName}
              className="rcp__property-img"
            />
          )}
          <div className="rcp__property-info">
            <h2 className="rcp__property-name">{propertyName}</h2>
            <Stars count={propertyStars} />
            {propertyAddress && (
              <p className="rcp__property-address">📍 {propertyAddress}</p>
            )}
            {(propertyRating > 0 || propertyRatingLabel) && (
              <div className="rcp__property-rating">
                {propertyRating > 0 && (
                  <span className="rcp__rating-score">
                    {Number(propertyRating).toFixed(1)}
                  </span>
                )}
                {propertyRatingLabel && (
                  <span className="rcp__rating-label">{propertyRatingLabel}</span>
                )}
                {propertyReviewCount > 0 && (
                  <span className="rcp__rating-reviews">
                    {propertyReviewCount.toLocaleString()} reviews
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* ─── Booking details ────────────────────────────────── */}
        <SectionTitle>Booking Details</SectionTitle>
        <div className="rcp__details-grid">
          <div className="rcp__detail-card">
            <span className="rcp__detail-icon">📅</span>
            <div>
              <p className="rcp__detail-label">Check-in</p>
              <p className="rcp__detail-value">{checkInDate || "—"}</p>
              {checkInTime && (
                <p className="rcp__detail-meta">From {checkInTime}</p>
              )}
            </div>
          </div>
          <div className="rcp__detail-card">
            <span className="rcp__detail-icon">📅</span>
            <div>
              <p className="rcp__detail-label">Check-out</p>
              <p className="rcp__detail-value">{checkOutDate || "—"}</p>
              {checkOutTime && (
                <p className="rcp__detail-meta">Until {checkOutTime}</p>
              )}
            </div>
          </div>
          <div className="rcp__detail-card">
            <span className="rcp__detail-icon">🌙</span>
            <div>
              <p className="rcp__detail-label">Duration</p>
              <p className="rcp__detail-value">
                {nights} night{nights !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="rcp__detail-card">
            <span className="rcp__detail-icon">🛏</span>
            <div>
              <p className="rcp__detail-label">Room</p>
              <p className="rcp__detail-value">{roomType || "—"}</p>
            </div>
          </div>
          <div className="rcp__detail-card">
            <span className="rcp__detail-icon">👤</span>
            <div>
              <p className="rcp__detail-label">Guests</p>
              <p className="rcp__detail-value">{guests || "—"}</p>
            </div>
          </div>
          {arrivalTime && (
            <div className="rcp__detail-card">
              <span className="rcp__detail-icon">🕐</span>
              <div>
                <p className="rcp__detail-label">Expected Arrival</p>
                <p className="rcp__detail-value">{arrivalTime}</p>
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* ─── Guest info ─────────────────────────────────────── */}
        <SectionTitle>Guest Information</SectionTitle>
        <div className="rcp__info-table">
          <InfoRow label="Name" value={guestName} />
          <InfoRow label="Email" value={guestEmail} />
          {guestPhone && <InfoRow label="Phone" value={guestPhone} />}
          {specialRequests && (
            <InfoRow label="Special Requests" value={specialRequests} />
          )}
        </div>

        <Divider />

        {/* ─── Price breakdown ────────────────────────────────── */}
        <SectionTitle>Price Breakdown</SectionTitle>
        <div className="rcp__price-table">
          {displayBasePrice && nights > 0 && (
            <div className="rcp__price-row">
              <span>
                {displayBasePrice} &times; {nights} night{nights !== 1 ? "s" : ""}
              </span>
              <span>
                {fmt(basePrice * nights, currency)}
              </span>
            </div>
          )}
          <div className="rcp__price-row">
            <span>Taxes &amp; Charges</span>
            <span className="rcp__price-note">
              {taxesIncluded ? "Included" : "Charged at property"}
            </span>
          </div>
          <div className="rcp__price-row rcp__price-row--total">
            <span>Total</span>
            <span className="rcp__price-total">{displayTotal || "—"}</span>
          </div>
          <p className="rcp__price-footnote">
            💳 No payment collected now — you pay when you arrive at the property.
          </p>
        </div>

        <Divider />

        {/* ─── What's included ────────────────────────────────── */}
        {perks.length > 0 && (
          <>
            <SectionTitle>What's Included</SectionTitle>
            <div className="rcp__perks">
              {perks.map((p, i) => (
                <span key={i} className="rcp__perk">✓ {p}</span>
              ))}
            </div>
            <Divider />
          </>
        )}

        {/* ─── Policies ───────────────────────────────────────── */}
        <SectionTitle>Important Information</SectionTitle>
        <div className="rcp__policies">
          <div className="rcp__policy-card">
            <span className="rcp__policy-icon">🔓</span>
            <div>
              <p className="rcp__policy-title">Free Cancellation</p>
              <p className="rcp__policy-body">
                Cancel for free before{" "}
                <strong>{cancelDeadline || checkInDate || "check-in"}</strong>.
                After that, the full stay amount applies.
              </p>
            </div>
          </div>
          <div className="rcp__policy-card">
            <span className="rcp__policy-icon">💳</span>
            <div>
              <p className="rcp__policy-title">Payment at Property</p>
              <p className="rcp__policy-body">
                No charge is made today. You'll settle the balance directly with
                the property on arrival.
              </p>
            </div>
          </div>
          <div className="rcp__policy-card">
            <span className="rcp__policy-icon">📞</span>
            <div>
              <p className="rcp__policy-title">Need Help?</p>
              <p className="rcp__policy-body">
                Contact our support team any time — we're available 24/7 to
                assist with your booking.
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* ─── Footer ─────────────────────────────────────────── */}
        <div className="rcp__footer">
          <p className="rcp__footer-brand">iBookNova</p>
          <p className="rcp__footer-note">
            Thank you for booking with us. Have a wonderful stay!
          </p>
          {issuedAt && (
            <p className="rcp__footer-date">Issued: {issuedAt}</p>
          )}
          <button
            className="rcp__print-btn no-print"
            onClick={() => window.print()}
          >
            🖨 Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
