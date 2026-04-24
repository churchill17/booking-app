import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stars from "./Stars";
import "./PropertyCard.css";

export default function PropertyCard({ property, index = 0 }) {
  const [wished, setWished] = useState(false);
  const navigate = useNavigate();

  const goToProperty = () => navigate(`/stays/${property.id}`);

  const image = property.mainImage || property.image || "";
  const score = property.avgRating || property.score || "";
  const location = property.city || property.location || "";
  const currency = property.currency || "NGN";
  const rawPrice =
    property.currentPrice ||
    property.current_price ||
    property.originalPrice ||
    property.original_price ||
    property.price ||
    "";
  const price = rawPrice
    ? `${currency} ${Number(rawPrice).toLocaleString()}`
    : "";
  const roomType =
    property.roomType ||
    (Array.isArray(property.rooms) && property.rooms.length > 0
      ? property.rooms[0].name
      : "");

  return (
    <div
      className="search-filter-card"
      style={{ animationDelay: `${index * 0.06}s`, cursor: "pointer" }}
      onClick={goToProperty}
    >
      <div className="search-filter-card-img-wrap">
        {image ? (
          <img
            src={image}
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
          onClick={(e) => {
            e.stopPropagation();
            setWished((w) => !w);
          }}
          title="Save to wishlist"
        >
          {wished ? "♥" : "♡"}
        </button>
      </div>

      <div className="search-filter-card-body">
        <div className="search-filter-card-header-row">
          {score ? (
            <span className="search-filter-score-badge">{score}</span>
          ) : null}
        </div>
        <div className="search-filter-card-name-row">
          <span className="search-filter-card-name">
            {property.name || property.propertyName}
          </span>
          <Stars count={property.stars} />
        </div>
        <div className="search-filter-card-location-row">
          <span className="search-filter-card-location">{location}</span>
        </div>
        <div className="search-filter-card-room-row">
          <span className="search-filter-room-type">{roomType}</span>
        </div>
        <div className="search-filter-card-perks-row">
          {property.availability && (
            <div className="search-filter-perk search-filter-perk-red">
              🔥 {property.availability}
            </div>
          )}
        </div>
        <div className="search-filter-card-bottom-row">
          <div className="search-filter-price-main">{price}</div>
          <button
            className="search-filter-avail-btn"
            onClick={(e) => {
              e.stopPropagation();
              goToProperty();
            }}
          >
            See availability →
          </button>
        </div>
      </div>
    </div>
  );
}
