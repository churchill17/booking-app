import React, { useState } from "react";
import "./HeroSearch.css";

export default function HeroSearch() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");

  return (
    <>
      <section className="hero-search">
        <div className="hero-search__overlay" />
        <div className="hero-search__content">
          <h1 className="hero-search__title">
            Attractions, activities and experiences
          </h1>
          <p className="hero-search__subtitle">
            Discover new attractions and experiences to match your interests and
            travel style
          </p>
        </div>
      </section>

      <div className="hero-search__surface">
        <div className="hero-search__content hero-search__content--search">
          <div className="hero-search__bar">
            <div className="hero-search__field">
              <span className="hero-search__icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <div className="hero-search__input-group">
                <label className="hero-search__label">Destination</label>
                <input
                  className="hero-search__input"
                  type="text"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="hero-search__divider" />

            <div className="hero-search__field">
              <span className="hero-search__icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <div className="hero-search__input-group">
                <label className="hero-search__label">Dates</label>
                <input
                  className="hero-search__input"
                  type="text"
                  placeholder="Select dates"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                />
              </div>
            </div>

            <button className="hero-search__btn">Search</button>
          </div>
        </div>
      </div>
    </>
  );
}
