import React from "react";
import "./BookingConfirmation.css";

const BookingConfirmation = ({ hotel, booking, user }) => {
  return (
    <div className="bconf">
      <div className="bconf__hero">
        <div className="bconf__hero-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="2" />
            <path
              d="M10 18l5.5 5.5L26 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="bconf__hero-title">You're all booked!</h1>
        <p className="bconf__hero-sub">
          A confirmation has been sent to <strong>{user.email}</strong>
        </p>
      </div>

      <div className="bconf__ref-block">
        <span className="bconf__ref-label">Booking Reference</span>
        <span className="bconf__ref-num">{booking.refNumber}</span>
      </div>

      <div className="bconf__summary-grid">
        <div className="bconf__summary-item">
          <span className="bconf__summary-label">Property</span>
          <span className="bconf__summary-value">{hotel.name}</span>
        </div>
        <div className="bconf__summary-item">
          <span className="bconf__summary-label">Check-in</span>
          <span className="bconf__summary-value">{booking.checkIn.date}</span>
          <span className="bconf__summary-meta">{booking.checkIn.time}</span>
        </div>
        <div className="bconf__summary-item">
          <span className="bconf__summary-label">Check-out</span>
          <span className="bconf__summary-value">{booking.checkOut.date}</span>
          <span className="bconf__summary-meta">{booking.checkOut.time}</span>
        </div>
        <div className="bconf__summary-item">
          <span className="bconf__summary-label">Room</span>
          <span className="bconf__summary-value">{booking.roomType}</span>
          <span className="bconf__summary-meta bconf__summary-meta--green">
            {booking.breakfast}
          </span>
        </div>
        <div className="bconf__summary-item">
          <span className="bconf__summary-label">Guests</span>
          <span className="bconf__summary-value">{booking.guests}</span>
        </div>
        <div className="bconf__summary-item">
          <span className="bconf__summary-label">Total</span>
          <span className="bconf__summary-value bconf__summary-value--price">
            {booking.totalPrice}
          </span>
          <span className="bconf__summary-meta">Pay at property</span>
        </div>
      </div>

      <div className="bconf__info-row">
        <div className="bconf__info-card">
          <span className="bconf__info-icon">📍</span>
          <div>
            <p className="bconf__info-title">Location</p>
            <p className="bconf__info-body">{hotel.address}</p>
          </div>
        </div>
        <div className="bconf__info-card">
          <span className="bconf__info-icon">💳</span>
          <div>
            <p className="bconf__info-title">Payment</p>
            <p className="bconf__info-body">No charge now — pay when you arrive at the property.</p>
          </div>
        </div>
        <div className="bconf__info-card">
          <span className="bconf__info-icon">🔓</span>
          <div>
            <p className="bconf__info-title">Cancellation</p>
            <p className="bconf__info-body">Free cancellation before {booking.cancelDeadline}.</p>
          </div>
        </div>
      </div>

      <div className="bconf__actions">
        <button className="bconf__btn bconf__btn--primary">
          <span>📄</span> Download Confirmation
        </button>
        <button className="bconf__btn bconf__btn--outline">
          <span>✉️</span> Resend Email
        </button>
        <button className="bconf__btn bconf__btn--ghost">
          <span>✏️</span> Manage Booking
        </button>
      </div>

      <div className="bconf__loyalty">
        <div className="bconf__loyalty-badge">
          <span>★</span> Genius
        </div>
        <div>
          <p className="bconf__loyalty-title">This booking counts toward your Genius progress!</p>
          <p className="bconf__loyalty-desc">
            Stays, flights, rental cars and attractions — every booking moves you forward.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
