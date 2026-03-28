import { useState } from "react";
import "./PopularStays.css";

export default function PopularStays({ stays, title }) {
  const [showAll, setShowAll] = useState(false);
  return (
    <section className="popular-stays">
      <div className="popular-stays__header">
        <h2 className="popular-stays__title">{title}</h2>
        <a href="#" className="popular-stays__see-all">
          See all
        </a>
      </div>
      <div className="popular-stays__grid">
        {stays.map((stay) => (
          <div className="popular-stay-card" key={stay.id}>
            <img
              className="popular-stay-card__image"
              src={stay.image}
              alt={stay.name}
              loading="lazy"
            />
            <div className="popular-stay-card__body">
              <p className="popular-stay-card__name">{stay.name}</p>
              <p className="popular-stay-card__location">{stay.location}</p>
              <p className="popular-stay-card__description">
                {stay.description}
              </p>
              <div className="popular-stay-card__footer">
                <span className="popular-stay-card__score">
                  {stay.score} ({stay.reviewLabel})
                </span>
                <span className="popular-stay-card__reviews">
                  {stay.reviewCount} reviews
                </span>
                <span className="popular-stay-card__price">{stay.price}</span>
              </div>
            </div>
          </div>
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
