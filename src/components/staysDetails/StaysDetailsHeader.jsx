import React from "react";
import "./StaysDetailsHeader.css";
import SearchContainer from "../common/Main/Hero/SearchContainer";

const StaysDetailsHeader = ({ data }) => {
  const { name, stars, address, rating, reviewCount, ratingLabel, locationScore } = data;
  const tabs = [
    { label: "Overview", href: "#overview" },
    { label: "Info & Prices", href: "#info-prices" },
    { label: "Facilities", href: "#facilities" },
    { label: "House Rules", href: "#house-rules" },
    { label: "Important & Legal", href: "#important-legal" },
    { label: "Guest Reviews (112)", href: "#guest-reviews" },
  ];
  return (
    <header className="stays-details-header">
      <SearchContainer />
      <div className="stays-details-header__nav">
        <span>Home</span>
        <span className="sep">›</span>
        <span>Hotels</span>
        <span className="sep">›</span>
        <span>Nigeria</span>
        <span className="sep">›</span>
        <span>Lagos</span>
        <span className="sep">›</span>
        <span className="stays-details-header__nav-active">Victoria Island</span>
        <span className="sep">›</span>
        <span>Sixteen By Sixteen</span>
      </div>

      <nav className="stays-details-header__tabs">
          {tabs.map((tab, idx) => (
            <a key={tab.label} href={tab.href} className={`stays-details-header__tab${idx === 0 ? " active" : ""}`}>{tab.label}</a>
          ))}
      </nav>

      <div className="stays-details-header__hero">
        <div className="stays-details-header__info">
          <div className="stays-details-header__stars">
            {"★".repeat(stars)}
            {"☆".repeat(5 - stars)}
          </div>
          <h1 className="stays-details-header__name">{name}</h1>
          <p className="stays-details-header__address">
            <span className="pin">📍</span>
            {address} {" "}
            <a href="#" className="stays-details-header__map-link">
              Excellent location · show map
            </a>
          </p>
        </div>
        <div className="stays-details-header__actions">
          <div className="stays-details-header__badges">
            <div className="stays-details-header__badge">
              <span className="badge-label">{ratingLabel}</span>
              <span className="badge-count">{reviewCount} reviews</span>
              <span className="badge-score">{rating}</span>
            </div>
            <div className="stays-details-header__location-badge">
              <span>Excellent location!</span>
              <span className="loc-score">{locationScore}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaysDetailsHeader;

