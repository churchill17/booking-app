import React from 'react';
import './AccommodationTypes.css';

const types = [
  {
    type: 'Apartments',
    count: '1,780,342 apartments',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  },
  {
    type: 'B&Bs',
    count: '253,805 B&Bs',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  },
  {
    type: 'Hostels',
    count: '23,730 hostels',
    img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
  },
  {
    type: 'Luxury Hotels',
    count: '134,023 luxury hotels',
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  },
];

export default function AccommodationTypes() {
  return (
    <section className="accommodation">
      <h2 className="accommodation__title">More accommodation on Booking.com</h2>
      <p className="accommodation__subtitle">Dive into our world of apartments, villas and other unique accommodation</p>

      <div className="accommodation__grid">
        {types.map((item) => (
          <a href="#" className="accommodation-card" key={item.type}>
            <img
              className="accommodation-card__image"
              src={item.img}
              alt={item.type}
              loading="lazy"
            />
            <div className="accommodation-card__overlay">
              <p className="accommodation-card__type">{item.type}</p>
              <p className="accommodation-card__count">{item.count}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
