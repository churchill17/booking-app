import React, { useState } from "react";
import "./PopularCities.css";
import { CITY_REGIONS, CITIES_BY_REGION } from "./hotelsData.js";

export default function PopularCities() {
  const [activeRegion, setActiveRegion] = useState("North America");
  const [showAll, setShowAll] = useState(false);

  const cities = CITIES_BY_REGION[activeRegion] || [];
  const displayedCities = showAll ? cities : cities.slice(0, 9);

  return (
    <section className="popular-cities">
      <h2 className="popular-cities__title">Popular cities</h2>

      <div className="popular-cities__tabs">
        {CITY_REGIONS.map((r) => (
          <button
            key={r}
            className={`popular-cities__tab${activeRegion === r ? " popular-cities__tab--active" : ""}`}
            onClick={() => {
              setActiveRegion(r);
              setShowAll(false);
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="popular-cities__grid">
        {displayedCities.map((city) => (
          <a href="#" className="city-item" key={city.name}>
            <img
              className="city-item__image"
              src={city.img}
              alt={city.name}
              loading="lazy"
            />
            <div className="city-item__info">
              <p className="city-item__name">{city.name}</p>
              <p className="city-item__count">{city.count} hotels</p>
            </div>
          </a>
        ))}
      </div>

      {cities.length > 9 && (
        <button
          className="popular-cities__show-more"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "− Show less" : "+ Show more"}
        </button>
      )}
    </section>
  );
}
