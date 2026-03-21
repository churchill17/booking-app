import "./LastMinuteHotels.css";

export default function LastMinuteHotels({ hotels, title }) {
  return (
    <section className="last-minute">
      <div className="last-minute__header">
        <h2 className="last-minute__title">{title}</h2>
        <a href="#" className="last-minute__see-all">
          See all
        </a>
      </div>

      <div className="last-minute__grid">
        {hotels.map((hotel) => (
          <div className="hotel-card" key={hotel.id}>
            <img
              className="hotel-card__image"
              src={hotel.image}
              alt={hotel.name}
              loading="lazy"
            />
            <div className="hotel-card__body">
              <h3 className="hotel-card__name">{hotel.name}</h3>
              <p className="hotel-card__location">{hotel.location}</p>
              <p className="hotel-card__description">{hotel.description}</p>
              <div className="hotel-card__footer">
                <span className="hotel-card__score">
                  {hotel.score} ({hotel.reviewLabel})
                </span>
                <span className="hotel-card__reviews">
                  {hotel.reviewCount} reviews
                </span>
                <span className="hotel-card__price">{hotel.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
