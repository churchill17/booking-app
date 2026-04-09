import { useState } from "react";
import Stars from "./Stars";
import "./PropertyCard.css";

export default function PropertyCard({ property }) {
  const [wished, setWished] = useState(false);

  return (
    <>
      <div
        className="search-filter-card"
        style={{ animationDelay: `${property.id * 0.04}s` }}
      >
        <div className="search-filter-card-img-wrap">
          {property.image ? (
            <img
              src={property.image}
              alt={property.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                minHeight: "180px",
                display: "block",
              }}
            />
          ) : (
            <div className="search-filter-card-img-placeholder" />
          )}
          <button
            className={`search-filter-wish-btn ${wished ? "active" : ""}`}
            onClick={() => setWished((w) => !w)}
            title="Save to wishlist"
          >
            {wished ? "♥" : "♡"}
          </button>
        </div>

        <div className="search-filter-card-body">
          <div className="search-filter-card-header-row">
            <span className="search-filter-score-badge">{property.score}</span>
          </div>
          <div className="search-filter-card-name-row">
            <span className="search-filter-card-name">{property.name}</span>
            <Stars count={property.stars} />
          </div>
          <div className="search-filter-card-location-row">
            <span className="search-filter-card-location">
              {property.location}
            </span>
          </div>
          <div className="search-filter-card-room-row">
            <span className="search-filter-room-type">{property.roomType}</span>
          </div>
          <div className="search-filter-card-perks-row">
            {property.urgency && (
              <div className="search-filter-perk search-filter-perk-red">
                🔥 {property.urgency}
              </div>
            )}
          </div>
          <div className="search-filter-card-bottom-row">
            <div className="search-filter-price-main">{property.price}</div>
            <button className="search-filter-avail-btn">
              See availability →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
