import React from "react";
import "./HotelCard.css";

const HotelCard = ({ hotel, booking }) => {
  return (
    <aside className="hotel-card">
      <div className="hotel-card__gallery">
        <div className="hotel-card__img hotel-card__img--main">
          <div className="hotel-card__img-placeholder hotel-card__img-placeholder--1">
            <span>🏨</span>
          </div>
        </div>
        <div className="hotel-card__img hotel-card__img--side">
          <div className="hotel-card__img-placeholder hotel-card__img-placeholder--2">
            <span>🌿</span>
          </div>
        </div>
      </div>

      <div className="hotel-card__body">
        <div className="hotel-card__stars">
          {"★".repeat(hotel.stars)}
        </div>
        <h2 className="hotel-card__name">{hotel.name}</h2>
        <p className="hotel-card__address">{hotel.address}</p>
        <span className="hotel-card__location-tag">{hotel.locationLabel}</span>

        <div className="hotel-card__rating">
          <span className="hotel-card__score">{hotel.rating}</span>
          <div className="hotel-card__rating-info">
            <span className="hotel-card__rating-label">{hotel.ratingLabel}</span>
            <span className="hotel-card__reviews">{hotel.reviewCount} reviews</span>
          </div>
        </div>

        <div className="hotel-card__amenities">
          {hotel.amenities.map((a) => (
            <span key={a.label} className="hotel-card__amenity">
              <span>{a.icon}</span> {a.label}
            </span>
          ))}
        </div>
      </div>

      <div className="hotel-card__booking-details">
        <h3 className="hotel-card__details-title">Your Booking Details</h3>
        <div className="hotel-card__dates">
          <div className="hotel-card__date-block">
            <span className="hotel-card__date-label">Check-in</span>
            <span className="hotel-card__date-value">{booking.checkIn.date}</span>
            <span className="hotel-card__date-time">{booking.checkIn.time}</span>
          </div>
          <div className="hotel-card__date-divider">→</div>
          <div className="hotel-card__date-block">
            <span className="hotel-card__date-label">Check-out</span>
            <span className="hotel-card__date-value">{booking.checkOut.date}</span>
            <span className="hotel-card__date-time">{booking.checkOut.time}</span>
          </div>
        </div>

        {booking.urgency && (
          <div className="hotel-card__urgency">
            <span>⏰</span> {booking.urgency}
          </div>
        )}

        <div className="hotel-card__selection">
          <p className="hotel-card__selection-label">You selected</p>
          <p className="hotel-card__selection-value">{booking.selection}</p>
          <div className="hotel-card__room-type">
            <span className="hotel-card__room-name">{booking.roomType}</span>
            {booking.breakfast && (
              <span className="hotel-card__breakfast">
                ☕ {booking.breakfast}
              </span>
            )}
          </div>
          <button className="hotel-card__change-btn">Change selection</button>
        </div>
      </div>

      <div className="hotel-card__price-summary">
        <h3 className="hotel-card__price-title">Price Summary</h3>
        <div className="hotel-card__price-row">
          <span>Original price</span>
          <span>{booking.originalPrice}</span>
        </div>
        {booking.discount && (
          <div className="hotel-card__price-row hotel-card__price-row--discount">
            <span>{booking.discount.label}</span>
            <span>- {booking.discount.amount}</span>
          </div>
        )}
        {booking.discount && (
          <p className="hotel-card__discount-note">{booking.discount.note}</p>
        )}
        <div className="hotel-card__price-total">
          <span>Total</span>
          <div className="hotel-card__total-amounts">
            <span className="hotel-card__original-strikethrough">{booking.originalPrice}</span>
            <span className="hotel-card__final-price">{booking.totalPrice}</span>
          </div>
        </div>
        <div className="hotel-card__price-meta">
          <span>Includes taxes and charges</span>
          <span className="hotel-card__usd-price">{booking.totalPriceUSD}</span>
        </div>
      </div>
    </aside>
  );
};

export default HotelCard;
