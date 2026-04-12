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
            <div
              className="stay-card__body"
              style={{
                padding: "1.2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.7rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                <h3
                  className="stay-card__name"
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#1e2a38",
                    margin: 0,
                  }}
                >
                  {stay.name}
                </h3>
                <span
                  className="stay-card__location"
                  style={{
                    color: "#4a6572",
                    fontSize: "0.97rem",
                    fontWeight: 500,
                  }}
                >
                  {stay.location}
                </span>
                <span
                  className="stay-card__description"
                  style={{
                    color: "#7b8a99",
                    fontSize: "0.93rem",
                    fontWeight: 400,
                  }}
                >
                  {stay.description}
                </span>
                {stay.rating && (
                  <span
                    className="stay-card__rating"
                    style={{
                      color: "#f9a825",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                      marginTop: "0.1rem",
                    }}
                  >
                    Rating: {stay.rating}
                  </span>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.7rem",
                  marginTop: "0.2rem",
                }}
              >
                <span
                  className="stay-card__score"
                  style={{
                    background: "#1e6f5c",
                    color: "#fff",
                    borderRadius: "16px",
                    padding: "0.25rem 0.7rem",
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  {stay.score}{" "}
                  <span style={{ fontWeight: 400, color: "#c7f2e6" }}>
                    ({stay.ratingLabel})
                  </span>
                </span>
                <span
                  className="stay-card__reviews"
                  style={{
                    color: "#7b8a99",
                    fontSize: "0.93rem",
                    fontWeight: 500,
                  }}
                >
                  {stay.reviewCount} review{stay.reviewCount === 1 ? "" : "s"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "0.7rem",
                  marginTop: "0.2rem",
                }}
              >
                {stay.originalPrice &&
                  stay.currentPrice &&
                  stay.originalPrice !== stay.currentPrice && (
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#e57373",
                        fontWeight: 500,
                        fontSize: "1.02rem",
                      }}
                    >
                      {stay.originalPrice}
                    </span>
                  )}
                <span style={{ color: "#888", fontSize: "0.97rem" }}>From</span>
                <span
                  className="stay-card__price"
                  style={{
                    color: "#1e6f5c",
                    fontWeight: 700,
                    fontSize: "1.18rem",
                  }}
                >
                  {stay.currentPrice}
                </span>
                <span style={{ color: "#888", fontSize: "0.97rem" }}>
                  per night
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
