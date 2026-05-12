import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StaysDetailsHeader.css";
import SearchContainer from "../common/Main/Hero/SearchContainer";
import { loadSearch, saveSearch } from "../../utils/searchStorage";

const StaysDetailsHeader = ({ data, from, city }) => {
  const navigate = useNavigate();
  const saved = loadSearch();

  const [destination, setDestination] = useState(city || saved?.destination || "");
  const [checkIn, setCheckIn]         = useState(saved?.checkIn  || null);
  const [checkOut, setCheckOut]       = useState(saved?.checkOut || null);
  const [adults, setAdults]           = useState(saved?.adults ?? 2);
  const [children, setChildren]       = useState(saved?.children ?? 0);
  const [rooms, setRooms]             = useState(saved?.rooms ?? 1);

  // Save to localStorage only when the user submits the search form
  const handleSearch = (params) => {
    saveSearch({ destination, checkIn, checkOut, adults, children, rooms });
    navigate(`/SearchFilter?${params.toString()}`);
  };

  const {
    name, stars = 0, address, rating, reviewCount,
    ratingLabel, locationScore,
  } = data;

  const safeStars = Math.min(Math.max(Number(stars) || 0, 0), 5);

  const tabs = [
    { label: "Overview",           href: "#overview" },
    { label: "Info & Prices",      href: "#info-prices" },
    { label: "Facilities",         href: "#facilities" },
    { label: "House Rules",        href: "#house-rules" },
    { label: "Important & Legal",  href: "#important-legal" },
    {
      label: reviewCount ? `Guest Reviews (${reviewCount})` : "Guest Reviews",
      href: "#guest-reviews",
    },
  ];

  return (
    <header className="stays-details-header">
      {/* ── SearchContainer — saves only on submit ── */}
      <div className="sdh-search-wrap">
        <SearchContainer
          destination={destination}
          setDestination={setDestination}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          adults={adults}
          setAdults={setAdults}
          children={children}
          setChildren={setChildren}
          rooms={rooms}
          setRooms={setRooms}
          onSearch={handleSearch}
        />
      </div>

      {/* ── Breadcrumb ── */}
      {from && (
        <div className="stays-details-header__nav">
          <Link to="/" className="stays-details-header__nav-link">Home</Link>
          <span className="stays-details-header__nav-sep">›</span>
          <Link to={from.path} className="stays-details-header__nav-link">{from.label}</Link>
          <span className="stays-details-header__nav-sep">›</span>
          <span className="stays-details-header__nav-active">{name}</span>
        </div>
      )}

      {/* ── Tab nav ── */}
      <nav className="stays-details-header__tabs">
        {tabs.map((tab, idx) => (
          <a
            key={tab.label}
            href={tab.href}
            className={`stays-details-header__tab${idx === 0 ? " active" : ""}`}
          >
            {tab.label}
          </a>
        ))}
      </nav>

      {/* ── Hero info ── */}
      <div className="stays-details-header__hero">
        <div className="stays-details-header__info">
          {safeStars > 0 && (
            <div className="stays-details-header__stars">
              {"★".repeat(safeStars)}{"☆".repeat(5 - safeStars)}
            </div>
          )}
          <h1 className="stays-details-header__name">{name}</h1>
          <p className="stays-details-header__address">
            <span className="pin">📍</span>
            {address}{" "}
            <a href="#" className="stays-details-header__map-link">Show on map</a>
          </p>
        </div>
        <div className="stays-details-header__actions">
          <div className="stays-details-header__badges">
            {(rating > 0 || ratingLabel) && (
              <div className="stays-details-header__badge">
                {ratingLabel && <span className="badge-label">{ratingLabel}</span>}
                {reviewCount > 0 && <span className="badge-count">{reviewCount} reviews</span>}
                {rating > 0 && <span className="badge-score">{rating}</span>}
              </div>
            )}
            {locationScore > 0 && (
              <div className="stays-details-header__location-badge">
                <span>Location</span>
                <span className="loc-score">{locationScore}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaysDetailsHeader;
