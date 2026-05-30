import "./StayCard.css";

export default function StayCard({ stay, onClick }) {
  return (
    <div className="stay-card" onClick={onClick}>
      {stay.image ? (
        <img
          className="stay-card__image"
          src={stay.image}
          alt={stay.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div className="stay-card__image stay-card__image--placeholder" />
      )}

      <div className="stay-card__body">
        <h3 className="stay-card__name">{stay.name}</h3>
        <span className="stay-card__location">{stay.location}</span>
        {stay.description && (
          <span className="stay-card__description">{stay.description}</span>
        )}

        <div className="stay-card__rating-row">
          <span className="stay-card__score">
            {stay.score}
            {stay.ratingLabel && (
              <span className="stay-card__rating-label"> ({stay.ratingLabel})</span>
            )}
          </span>
          <span className="stay-card__reviews">
            {stay.reviewCount} review{stay.reviewCount === 1 ? "" : "s"}
          </span>
        </div>

        {(stay.originalPrice || stay.currentPrice) && (
          <div className="stay-card__price-row">
            {stay.hasDiscount && stay.originalPrice && stay.currentPrice ? (
              <>
                <span className="stay-card__original-price">{stay.originalPrice}</span>
                <span className="stay-card__price">{stay.currentPrice}</span>
              </>
            ) : (
              <>
                <span className="stay-card__price-from">From</span>
                <span className="stay-card__price">{stay.originalPrice}</span>
              </>
            )}
            <span className="stay-card__price-unit">per night</span>
          </div>
        )}
      </div>
    </div>
  );
}
