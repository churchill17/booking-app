import React from "react";
import "./AccommodationTypes.css";

export default function AccommodationTypes({ types = [] }) {
  return (
    <section className="accommodation">
      <h2 className="accommodation__title">
        More accommodation on Booking.com
      </h2>
      <p className="accommodation__subtitle">
        Dive into our world of apartments, villas and other unique accommodation
      </p>

      <div className="accommodation__grid">
        {types.map((item) => (
          <a href="#" className="accommodation-card" key={item.type}>
            <img
              className="accommodation-card__image"
              src={item.img}
              alt={item.type}
              loading="lazy"
            />
            <div className="accommodation-card__overlay">
              <p className="accommodation-card__type">{item.type}</p>
              <p className="accommodation-card__count">{item.count}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
