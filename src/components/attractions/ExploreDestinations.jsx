import React, { useState } from "react";
import "./ExploreDestinations.css";

const REGIONS = [
  "Europe",
  "North America",
  "Asia",
  "Africa",
  "Oceania",
  "Middle East",
  "Caribbean",
  "South America",
  "Central America",
];

const DESTINATIONS = {
  Europe: [
    { name: "London", things: "3971 things to do", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
    { name: "Istanbul", things: "2698 things to do", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80" },
    { name: "Paris", things: "3962 things to do", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80" },
    { name: "Hamburg", things: "367 things to do", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80" },
    { name: "Amsterdam", things: "2114 things to do", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80" },
    { name: "Lisbon", things: "3817 things to do", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80" },
    { name: "Rome", things: "6801 things to do", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80" },
    { name: "Athens", things: "3482 things to do", image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=600&q=80" },
    { name: "Berlin", things: "863 things to do", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80" },
    { name: "Barcelona", things: "2622 things to do", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80" },
    { name: "Venice", things: "1805 things to do", image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=600&q=80" },
    { name: "Málaga", things: "822 things to do", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80" },
  ],
  "North America": [
    { name: "New York", things: "5210 things to do", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80" },
    { name: "Los Angeles", things: "3890 things to do", image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&q=80" },
    { name: "Chicago", things: "2150 things to do", image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&q=80" },
    { name: "Miami", things: "1870 things to do", image: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=600&q=80" },
  ],
  Asia: [
    { name: "Tokyo", things: "7320 things to do", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80" },
    { name: "Bangkok", things: "4100 things to do", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80" },
    { name: "Singapore", things: "2960 things to do", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80" },
    { name: "Bali", things: "3200 things to do", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80" },
  ],
  Africa: [
    { name: "Cairo", things: "1420 things to do", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&q=80" },
    { name: "Cape Town", things: "1875 things to do", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80" },
    { name: "Marrakech", things: "1650 things to do", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80" },
    { name: "Nairobi", things: "760 things to do", image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=600&q=80" },
  ],
  Oceania: [
    { name: "Sydney", things: "2840 things to do", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80" },
    { name: "Melbourne", things: "1990 things to do", image: "https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=600&q=80" },
    { name: "Auckland", things: "1120 things to do", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80" },
  ],
  "Middle East": [
    { name: "Dubai", things: "8042 things to do", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
    { name: "Abu Dhabi", things: "2150 things to do", image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=600&q=80" },
    { name: "Doha", things: "1340 things to do", image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&q=80" },
  ],
  Caribbean: [
    { name: "Cancún", things: "1530 things to do", image: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&q=80" },
    { name: "Havana", things: "870 things to do", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { name: "Nassau", things: "640 things to do", image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80" },
  ],
  "South America": [
    { name: "Rio de Janeiro", things: "2310 things to do", image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=600&q=80" },
    { name: "Buenos Aires", things: "1760 things to do", image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80" },
    { name: "Lima", things: "1120 things to do", image: "https://images.unsplash.com/photo-1588499756884-d72584d84df5?w=600&q=80" },
  ],
  "Central America": [
    { name: "Panama City", things: "780 things to do", image: "https://images.unsplash.com/photo-1567343483886-1e86c1cf7c7d?w=600&q=80" },
    { name: "San José", things: "560 things to do", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  ],
};

export default function ExploreDestinations() {
  const [activeRegion, setActiveRegion] = useState("Europe");
  const destinations = DESTINATIONS[activeRegion] || [];

  return (
    <section className="explore">
      <div className="explore__container">
        <h2 className="explore__heading">Explore more destinations</h2>
        <p className="explore__sub">Find things to do in cities around the world</p>

        {/* Region Tabs */}
        <div className="explore__tabs" role="tablist">
          {REGIONS.map((region) => (
            <button
              key={region}
              role="tab"
              aria-selected={activeRegion === region}
              className={`explore__tab ${activeRegion === region ? "explore__tab--active" : ""}`}
              onClick={() => setActiveRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="explore__grid">
          {destinations.map((dest) => (
            <div key={dest.name} className="explore-card">
              <img
                src={dest.image}
                alt={dest.name}
                className="explore-card__img"
                loading="lazy"
              />
              <div className="explore-card__overlay" />
              <div className="explore-card__info">
                <span className="explore-card__name">{dest.name}</span>
                <span className="explore-card__things">{dest.things}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
