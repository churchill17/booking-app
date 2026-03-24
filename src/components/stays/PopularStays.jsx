import React, { useState } from "react";
import "./PopularStays.css";

export default function PopularStays({ listings = [] }) {
  const [showAll, setShowAll] = useState(false);
  // Optionally, filter for popular stays (e.g., by rating or bookings)
  const sorted = [...listings].sort(
    (a, b) => (b.avgRating || 0) - (a.avgRating || 0),
  );
  const displayed = showAll ? sorted : sorted.slice(0, 9);

  return (
    <section className="popular-stays">
      <h2 className="popular-stays__title">Popular stays</h2>
      <div className="popular-stays__grid">
        {displayed.map((stay) => (
          <a href="#" className="stay-list-item" key={stay.id}>
            <img
              className="stay-list-item__image"
              src={stay.mainImage}
              alt={stay.propertyName}
              loading="lazy"
            />
            <div className="stay-list-item__info">
              <p className="stay-list-item__name">{stay.propertyName}</p>
              <p className="stay-list-item__location">
                {[stay.address, stay.city, stay.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="stay-list-item__rating">
                <span>{stay.avgRating}</span>{" "}
                {stay.avgRating >= 8.5
                  ? "Fabulous"
                  : stay.avgRating >= 7
                    ? "Very good"
                    : "Good"}{" "}
                · {stay.totalReviews} reviews
              </p>
            </div>
          </a>
        ))}
      </div>
      {listings.length > 9 && (
        <button
          className="popular-stays__show-more"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "− Show less" : "+ Show more"}
        </button>
      )}
    </section>
  );
}
