import './LastMinuteHotels.css';

const hotels = [
  {
    id: 1,
    name: 'Sixteen By Sixteen',
    location: 'Lagos',
    score: 8.3,
    reviewCount: 107,
    reviewLabel: 'Very good',
    description:
      'Conveniently located in the centre of Lagos, Sixteen By Sixteen offers air-conditioned rooms with free WiFi, free private parking and room service.',
    price: 'NGN 130,284.88',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  },
  {
    id: 2,
    name: 'Presken Kuramo Waters, Victoria Island',
    location: 'Lagos',
    score: 8.1,
    reviewCount: 200,
    reviewLabel: 'Very good',
    description:
      'Located in Lagos, 1 km from Landmark Beach, Presken Kuramo Waters, Victoria Island provides accommodation with an outdoor swimming pool, free private parking, a garden and a terrace.',
    price: 'NGN 74,981.88',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  },
  {
    id: 3,
    name: 'Eko Hotel Suites',
    location: 'Lagos',
    score: 8.0,
    reviewCount: 199,
    reviewLabel: 'Very good',
    description:
      'Attractively situated in the centre of Lagos, Eko Hotel Suites features air-conditioned rooms with free WiFi, free private parking and room service.',
    price: 'NGN 370,000',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
  },
  {
    id: 4,
    name: 'The Delborough Lagos',
    location: 'Lagos',
    score: 8.2,
    reviewCount: 173,
    reviewLabel: 'Very good',
    description:
      'Located in Lagos, 2.1 km from Landmark Beach, The Delborough Lagos provides accommodation with a fitness centre, free private parking and a rooftop pool.',
    price: 'NGN 613,696.85',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  },
];

export default function LastMinuteHotels() {
  return (
    <section className="last-minute">
      <div className="last-minute__header">
        <h2 className="last-minute__title">Last minute hotels near you tonight</h2>
        <a href="#" className="last-minute__see-all">See all</a>
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
              <div className="hotel-card__rating">
                <span className="hotel-card__score">{hotel.score}</span>
                <span className="hotel-card__review-label">
                  {hotel.reviewLabel} · {hotel.reviewCount} reviews
                </span>
              </div>
              <p className="hotel-card__description">{hotel.description}</p>
              <button className="hotel-card__show-more">Show more</button>
              <div className="hotel-card__price">
                From <strong>{hotel.price}</strong> per night
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
