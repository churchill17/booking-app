import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const BookingConfirmation = ({ hotel, booking, user, receiptData }) => {
  const navigate = useNavigate();
  const printRef = useRef(null);

  const rd = receiptData || {};
  const currency = rd.currency || "NGN";

  const fmt = (n) =>
    n > 0
      ? `${currency} ${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "";

  const handleViewReceipt = () => {
    navigate("/receipt", { state: { receiptData } });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .bconf-wrap {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 680px;
          margin: 0 auto;
        }

        /* ── Ticket container ── */
        .bconf-ticket {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(24, 36, 53, 0.13);
          border: 1px solid #e8e2d9;
        }

        /* ── Header band ── */
        .bconf-header {
          background: #182435;
          padding: 32px 36px 28px;
          position: relative;
          overflow: hidden;
        }

        .bconf-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(25, 144, 126, 0.12);
        }

        .bconf-header::after {
          content: '';
          position: absolute;
          bottom: -60px; left: 20%;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(232, 184, 75, 0.07);
        }

        .bconf-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .bconf-logo {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
        }

        .bconf-logo span {
          color: #19907e;
        }

        .bconf-status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(25, 144, 126, 0.2);
          border: 1px solid rgba(25, 144, 126, 0.4);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 11.5px;
          font-weight: 600;
          color: #4ecdb4;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .bconf-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #19907e;
          box-shadow: 0 0 0 3px rgba(25,144,126,0.25);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(25,144,126,0.25); }
          50% { box-shadow: 0 0 0 5px rgba(25,144,126,0.1); }
        }

        .bconf-hero-text {
          margin-top: 22px;
          position: relative;
          z-index: 1;
        }

        .bconf-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
          line-height: 1.2;
        }

        .bconf-hero-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          margin: 0;
          font-weight: 300;
        }

        .bconf-hero-sub strong {
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }

        /* ── Ref strip ── */
        .bconf-ref-strip {
          background: #19907e;
          padding: 14px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .bconf-ref-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.7);
        }

        .bconf-ref-value {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.15em;
        }

        .bconf-ref-date {
          font-size: 12px;
          color: rgba(255,255,255,0.65);
          text-align: right;
        }

        /* ── Property section ── */
        .bconf-property {
          padding: 24px 36px;
          border-bottom: 1px solid #f0ebe3;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .bconf-property-img {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
          background: #f0ebe3;
        }

        .bconf-property-img-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          background: linear-gradient(135deg, #f0ebe3, #e8e2d9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
        }

        .bconf-property-info {
          flex: 1;
        }

        .bconf-property-type {
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #19907e;
          margin-bottom: 4px;
        }

        .bconf-property-name {
          font-family: 'Playfair Display', serif;
          font-size: 19px;
          font-weight: 700;
          color: #182435;
          margin: 0 0 4px;
          line-height: 1.3;
        }

        .bconf-property-address {
          font-size: 12.5px;
          color: #7a7264;
          margin: 0;
          line-height: 1.5;
        }

        /* ── Divider with scissors ── */
        .bconf-divider {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 36px;
          margin: 0;
        }

        .bconf-divider::before, .bconf-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          border-top: 1.5px dashed #d9d2c7;
        }

        .bconf-divider-cutout-left {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #f5f2ee;
          border: 1px solid #e8e2d9;
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
        }

        .bconf-divider-cutout-right {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #f5f2ee;
          border: 1px solid #e8e2d9;
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
        }

        .bconf-divider-icon {
          font-size: 14px;
          padding: 0 10px;
          color: #b5ac9e;
        }

        /* ── Stay details grid ── */
        .bconf-details {
          padding: 24px 36px;
          border-bottom: 1px solid #f0ebe3;
        }

        .bconf-section-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #b5ac9e;
          margin-bottom: 16px;
        }

        .bconf-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1px;
          background: #f0ebe3;
          border: 1px solid #f0ebe3;
          border-radius: 10px;
          overflow: hidden;
        }

        .bconf-grid-cell {
          background: #fff;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .bconf-cell-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #b5ac9e;
          font-weight: 600;
        }

        .bconf-cell-value {
          font-size: 14.5px;
          font-weight: 600;
          color: #182435;
          line-height: 1.3;
        }

        .bconf-cell-sub {
          font-size: 11px;
          color: #9a9285;
        }

        /* ── Price breakdown ── */
        .bconf-pricing {
          padding: 20px 36px;
          border-bottom: 1px solid #f0ebe3;
        }

        .bconf-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 13.5px;
          color: #5a5448;
          border-bottom: 1px solid #f7f4f0;
        }

        .bconf-price-row:last-child {
          border-bottom: none;
        }

        .bconf-price-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0 0;
          margin-top: 4px;
          border-top: 2px solid #182435;
        }

        .bconf-price-total-label {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          color: #182435;
        }

        .bconf-price-total-value {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #19907e;
        }

        .bconf-price-tax-note {
          font-size: 11px;
          color: #b5ac9e;
          text-align: right;
          margin-top: 4px;
        }

        /* ── Contact ── */
        .bconf-contact {
          padding: 20px 36px;
          border-bottom: 1px solid #f0ebe3;
          background: #faf8f5;
        }

        .bconf-contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .bconf-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: #fff;
          border: 1px solid #ece7df;
          border-radius: 8px;
        }

        .bconf-contact-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .bconf-contact-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #b5ac9e;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .bconf-contact-value {
          font-size: 13px;
          color: #182435;
          font-weight: 500;
          word-break: break-all;
        }

        /* ── Footer ── */
        .bconf-footer {
          padding: 20px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .bconf-conf-note {
          font-size: 11.5px;
          color: #9a9285;
          line-height: 1.6;
          flex: 1;
        }

        .bconf-conf-note strong {
          color: #182435;
        }

        /* ── Actions ── */
        .bconf-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .bconf-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          border: none;
        }

        .bconf-btn--primary {
          background: #182435;
          color: #fff;
          flex: 1;
          justify-content: center;
        }

        .bconf-btn--primary:hover {
          background: #0f1923;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(24,36,53,0.2);
        }

        .bconf-btn--teal {
          background: #19907e;
          color: #fff;
        }

        .bconf-btn--teal:hover {
          background: #157a6a;
        }

        .bconf-btn--ghost {
          background: transparent;
          color: #182435;
          border: 1.5px solid #d9d2c7;
        }

        .bconf-btn--ghost:hover {
          border-color: #182435;
        }

        @media (max-width: 600px) {
          .bconf-header { padding: 24px 20px 20px; }
          .bconf-ref-strip { padding: 12px 20px; flex-direction: column; align-items: flex-start; gap: 4px; }
          .bconf-property { padding: 18px 20px; }
          .bconf-details { padding: 18px 20px; }
          .bconf-pricing { padding: 16px 20px; }
          .bconf-contact { padding: 16px 20px; }
          .bconf-footer { padding: 16px 20px; }
          .bconf-grid { grid-template-columns: 1fr 1fr; }
          .bconf-contact-grid { grid-template-columns: 1fr; }
          .bconf-hero-title { font-size: 22px; }
          .bconf-actions { flex-direction: column; }
          .bconf-btn { justify-content: center; }
        }
      `}</style>

      <div className="bconf-wrap">
        <div className="bconf-ticket" ref={printRef}>

          {/* ── Header ── */}
          <div className="bconf-header">
            <div className="bconf-header-top">
              <div className="bconf-logo">iBook<span>Nova</span></div>
              <div className="bconf-status-pill">
                <span className="bconf-status-dot" />
                Confirmed
              </div>
            </div>
            <div className="bconf-hero-text">
              <h1 className="bconf-hero-title">Booking Confirmed</h1>
              <p className="bconf-hero-sub">
                Confirmation sent to <strong>{user?.email}</strong>
              </p>
            </div>
          </div>

          {/* ── Reference strip ── */}
          <div className="bconf-ref-strip">
            <div>
              <div className="bconf-ref-label">Booking Reference</div>
              <div className="bconf-ref-value">{booking?.refNumber || "—"}</div>
            </div>
            <div className="bconf-ref-date">
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Issued</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{rd.issuedAt}</div>
            </div>
          </div>

          {/* ── Property ── */}
          <div className="bconf-property">
            {rd.propertyImage ? (
              <img src={rd.propertyImage} alt={rd.propertyName} className="bconf-property-img" />
            ) : (
              <div className="bconf-property-img-placeholder">🏨</div>
            )}
            <div className="bconf-property-info">
              <div className="bconf-property-type">Accommodation</div>
              <h2 className="bconf-property-name">{rd.propertyName || hotel?.name}</h2>
              <p className="bconf-property-address">{rd.propertyAddress || hotel?.address}</p>
            </div>
          </div>

          {/* ── Dashed divider ── */}
          <div className="bconf-divider" style={{ height: 20, position: "relative" }}>
            <div className="bconf-divider-cutout-left" />
            <div style={{ flex: 1, borderTop: "1.5px dashed #d9d2c7", margin: "0 10px" }} />
            <span className="bconf-divider-icon">✂</span>
            <div style={{ flex: 1, borderTop: "1.5px dashed #d9d2c7", margin: "0 10px" }} />
            <div className="bconf-divider-cutout-right" />
          </div>

          {/* ── Stay details ── */}
          <div className="bconf-details">
            <div className="bconf-section-label">Stay Details</div>
            <div className="bconf-grid">
              <div className="bconf-grid-cell">
                <span className="bconf-cell-label">Check-in</span>
                <span className="bconf-cell-value">{booking?.checkIn?.date || "—"}</span>
                <span className="bconf-cell-sub">{booking?.checkIn?.time || ""}</span>
              </div>
              <div className="bconf-grid-cell">
                <span className="bconf-cell-label">Check-out</span>
                <span className="bconf-cell-value">{booking?.checkOut?.date || "—"}</span>
                <span className="bconf-cell-sub">{booking?.checkOut?.time || ""}</span>
              </div>
              <div className="bconf-grid-cell">
                <span className="bconf-cell-label">Duration</span>
                <span className="bconf-cell-value">{rd.nights} Night{rd.nights !== 1 ? "s" : ""}</span>
              </div>
              <div className="bconf-grid-cell">
                <span className="bconf-cell-label">Room</span>
                <span className="bconf-cell-value">{rd.roomType || booking?.roomType || "—"}</span>
              </div>
              <div className="bconf-grid-cell">
                <span className="bconf-cell-label">Guests</span>
                <span className="bconf-cell-value">{rd.guests || booking?.guests || "—"}</span>
              </div>
              {rd.arrivalTime && (
                <div className="bconf-grid-cell">
                  <span className="bconf-cell-label">Arrival Time</span>
                  <span className="bconf-cell-value">{rd.arrivalTime}</span>
                </div>
              )}
            </div>

            {rd.specialRequests && (
              <div style={{ marginTop: 14, padding: "12px 14px", background: "#faf8f5", borderRadius: 8, border: "1px solid #ece7df" }}>
                <div className="bconf-cell-label" style={{ marginBottom: 4 }}>Special Requests</div>
                <div style={{ fontSize: 13, color: "#5a5448", lineHeight: 1.5 }}>{rd.specialRequests}</div>
              </div>
            )}
          </div>

          {/* ── Price breakdown ── */}
          <div className="bconf-pricing">
            <div className="bconf-section-label">Price Summary</div>

            {rd.basePrice > 0 && rd.nights > 0 && (
              <div className="bconf-price-row">
                <span>
                  {rd.currency} {Number(rd.basePrice).toLocaleString()} × {rd.nights} night{rd.nights !== 1 ? "s" : ""}
                </span>
                <span>{fmt(rd.basePrice * rd.nights)}</span>
              </div>
            )}

            {rd.originalPrice > rd.totalPrice && rd.originalPrice > 0 && (
              <div className="bconf-price-row" style={{ color: "#19907e" }}>
                <span>Discount applied</span>
                <span>− {fmt(rd.originalPrice - rd.totalPrice)}</span>
              </div>
            )}

            <div className="bconf-price-total-row">
              <span className="bconf-price-total-label">Total Paid</span>
              <span className="bconf-price-total-value">{fmt(rd.totalPrice)}</span>
            </div>
            <div className="bconf-price-tax-note">
              {rd.taxesIncluded ? "Inclusive of taxes & charges" : "Exclusive of local taxes & charges"}
            </div>
          </div>

          {/* ── Host Contact ── */}
          <div className="bconf-contact">
            <div className="bconf-section-label">Property Contact</div>
            <div className="bconf-contact-grid">
              {hotel?.phone && (
                <div className="bconf-contact-item">
                  <span className="bconf-contact-icon">📞</span>
                  <div>
                    <div className="bconf-contact-label">Host Phone</div>
                    <div className="bconf-contact-value">{hotel.phone}</div>
                  </div>
                </div>
              )}
              {hotel?.hostEmail && (
                <div className="bconf-contact-item">
                  <span className="bconf-contact-icon">✉️</span>
                  <div>
                    <div className="bconf-contact-label">Host Email</div>
                    <div className="bconf-contact-value">{hotel.hostEmail}</div>
                  </div>
                </div>
              )}
              <div className="bconf-contact-item">
                <span className="bconf-contact-icon">📍</span>
                <div>
                  <div className="bconf-contact-label">Address</div>
                  <div className="bconf-contact-value">{rd.propertyAddress || hotel?.address || "—"}</div>
                </div>
              </div>
              <div className="bconf-contact-item">
                <span className="bconf-contact-icon">🏢</span>
                <div>
                  <div className="bconf-contact-label">Support</div>
                  <div className="bconf-contact-value">noreply@ibooknova.com.ng</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer note ── */}
          <div className="bconf-footer">
            <p className="bconf-conf-note">
              Please present your booking reference <strong>{booking?.refNumber}</strong> upon arrival.
              For any changes or queries, contact the property directly or reach us at{" "}
              <strong>noreply@ibooknova.com.ng</strong>.
            </p>
          </div>

        </div>

        {/* ── Action buttons (outside ticket) ── */}
        <div className="bconf-actions">
          <button className="bconf-btn bconf-btn--primary" onClick={handleViewReceipt}>
            <span>📄</span> View Full Receipt
          </button>
          <button className="bconf-btn bconf-btn--teal">
            <span>✉️</span> Resend Email
          </button>
          <button className="bconf-btn bconf-btn--ghost">
            <span>✏️</span> Manage Booking
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmation;