import React from "react";
import "./TopDestinations.css";

const TOP_DESTINATIONS = [
  {
    id: 1,
    name: "Dubai",
    things: "8042 things to do",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
  },
  {
    id: 2,
    name: "London",
    things: "3971 things to do",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  },
  {
    id: 3,
    name: "Istanbul",
    things: "2698 things to do",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
  },
];

export default function TopDestinations() {
  return (
    <section className="top-destinations">
      <div className="top-destinations__container">
        <h2 className="top-destinations__heading">Top destinations</h2>
        <div className="top-destinations__grid">
          {TOP_DESTINATIONS.map((dest) => (
            <div key={dest.id} className="dest-card">
              <img
                src={dest.image}
                alt={dest.name}
                className="dest-card__img"
                loading="lazy"
              />
              <div className="dest-card__overlay" />
              <div className="dest-card__info">
                <span className="dest-card__name">{dest.name}</span>
                <span className="dest-card__things">{dest.things}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
