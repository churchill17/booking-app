import "./LastMinuteStays.css";
import { useNavigate } from "react-router-dom";

export default function LastMinuteStays({ stays, title }) {
  const navigate = useNavigate();
  return (
    <section className="last-minute">
      <div className="last-minute__header">
        <h2 className="last-minute__title">{title}</h2>
        <a href="#" className="last-minute__see-all">
          See all
        </a>
      </div>

      <div className="last-minute__grid">
        {stays.map((stay) => (
          <div
            className="stay-card"
            key={stay.id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/stays/${stay.id}`)}
          >
            <img
              className="stay-card__image"
              src={stay.image}
              alt={stay.name}
              loading="lazy"
            />
            <div className="stay-card__body">
              <h3 className="stay-card__name">{stay.name}</h3>
              <p className="stay-card__location">{stay.location}</p>
              <p className="stay-card__description">{stay.description}</p>
              <div className="stay-card__footer">
                <div style={{ width: "100%" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span className="stay-card__score">
                      {stay.score} ({stay.reviewLabel})
                    </span>
                    <span
                      className="stay-card__reviews"
                      style={{ marginLeft: 8 }}
                    >
                      {stay.reviewCount} reviews
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 4,
                    }}
                  >
                    <span style={{ color: "#888" }}>From&nbsp;</span>
                    <span className="stay-card__price">
                      {stay.currentPrice}
                    </span>
                    <span style={{ color: "#888" }}>&nbsp;per night</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
