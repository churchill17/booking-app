import React, { useState } from "react";
import "./PopularHotels.css";
import {HOTELS_BY_REGION, REGIONS} from "./hotelsData";


export default function PopularHotels() {
  const [activeRegion, setActiveRegion] = useState("Lagos");
  const [showAll, setShowAll] = useState(false);

  const hotels =
    HOTELS_BY_REGION[activeRegion] || HOTELS_BY_REGION["Lagos"];
  const displayed = showAll ? hotels : hotels.slice(0, 9);

  return (
    <section className="popular-hotels">
      <h2 className="popular-hotels__title">Popular hotels</h2>

      <div className="popular-hotels__tabs">
        {REGIONS.map((r) => (
          <button
            key={r}
            className={`popular-hotels__tab${activeRegion === r ? " popular-hotels__tab--active" : ""}`}
            onClick={() => {
              setActiveRegion(r);
              setShowAll(false);
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="popular-hotels__grid">
        {displayed.map((hotel) => (
          <a href="#" className="hotel-list-item" key={hotel.name}>
            <img
              className="hotel-list-item__image"
              src={hotel.img}
              alt={hotel.name}
              loading="lazy"
            />
            <div className="hotel-list-item__info">
              <p className="hotel-list-item__name">{hotel.name}</p>
              <p className="hotel-list-item__location">{hotel.location}</p>
              <p className="hotel-list-item__rating">
                <span>{hotel.score}</span> {hotel.label} ·{" "}
                {hotel.reviews.toLocaleString()} reviews
              </p>
            </div>
          </a>
        ))}
      </div>

      {hotels.length > 9 && (
        <button
          className="popular-hotels__show-more"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "− Show less" : "+ Show more"}
        </button>
      )}
    </section>
  );
}
