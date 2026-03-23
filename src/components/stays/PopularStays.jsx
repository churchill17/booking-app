import React, { useState } from "react";
import "./PopularStays.css";
import { STAYS_BY_REGION, REGIONS } from "./staysData";

export default function PopularStays() {
  const [activeRegion, setActiveRegion] = useState("Lagos");
  const [showAll, setShowAll] = useState(false);

  const stays = STAYS_BY_REGION[activeRegion] || STAYS_BY_REGION["Lagos"];
  const displayed = showAll ? stays : stays.slice(0, 9);

  return (
    <section className="popular-stays">
      <h2 className="popular-stays__title">Popular stays</h2>

      <div className="popular-stays__tabs">
        {REGIONS.map((r) => (
          <button
            key={r}
            className={`popular-stays__tab${activeRegion === r ? " popular-stays__tab--active" : ""}`}
            onClick={() => {
              setActiveRegion(r);
              setShowAll(false);
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="popular-stays__grid">
        {displayed.map((stay) => (
          <a href="#" className="stay-list-item" key={stay.name}>
            <img
              className="stay-list-item__image"
              src={stay.img}
              alt={stay.name}
              loading="lazy"
            />
            <div className="stay-list-item__info">
              <p className="stay-list-item__name">{stay.name}</p>
              <p className="stay-list-item__location">{stay.location}</p>
              <p className="stay-list-item__rating">
                <span>{stay.score}</span> {stay.label} ·{" "}
                {stay.reviews.toLocaleString()} reviews
              </p>
            </div>
          </a>
        ))}
      </div>

      {stays.length > 9 && (
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
