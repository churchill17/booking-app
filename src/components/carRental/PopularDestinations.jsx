import { useState } from "react";
import "./PopularDestinations.css";

const destinations = {
  cities: [
    {
      id: 1,
      city: "Lagos",
      locations: 86,
      price: "NGN 91,155.48",
      img: "https://images.unsplash.com/photo-1581944891026-456a4f09e6f8?w=120&h=80&fit=crop",
    },
    {
      id: 2,
      city: "Abuja",
      locations: 54,
      price: "NGN 72,504.83",
      img: "https://images.unsplash.com/photo-1611348586750-61bf6c080437?w=120&h=80&fit=crop",
    },
    {
      id: 3,
      city: "Port Harcourt",
      locations: 39,
      price: "NGN 69,097.02",
      img: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=120&h=80&fit=crop",
    },
    {
      id: 4,
      city: "Kano",
      locations: 28,
      price: "NGN 93,576.27",
      img: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=120&h=80&fit=crop",
    },
    {
      id: 5,
      city: "Ibadan",
      locations: 22,
      price: "NGN 72,264.21",
      img: "https://images.unsplash.com/photo-1620049729374-f6b2e7ef8d72?w=120&h=80&fit=crop",
    },
    {
      id: 6,
      city: "Enugu",
      locations: 18,
      price: "NGN 91,634.31",
      img: "https://images.unsplash.com/photo-1535909339361-9b5f81d1f33f?w=120&h=80&fit=crop",
    },
    {
      id: 7,
      city: "Benin City",
      locations: 17,
      price: "NGN 81,883.08",
      img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=120&h=80&fit=crop",
    },
    {
      id: 8,
      city: "Calabar",
      locations: 14,
      price: "NGN 90,187.73",
      img: "https://images.unsplash.com/photo-1518544866330-4e5f4d33a7f3?w=120&h=80&fit=crop",
    },
    {
      id: 9,
      city: "Owerri",
      locations: 13,
      price: "NGN 83,624.27",
      img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120&h=80&fit=crop",
    },
  ],
  airports: [
    {
      id: 10,
      city: "Murtala Muhammed Intl (LOS)",
      locations: 64,
      price: "NGN 88,400.00",
      img: "https://images.unsplash.com/photo-1581944891026-456a4f09e6f8?w=120&h=80&fit=crop",
    },
    {
      id: 11,
      city: "Nnamdi Azikiwe Intl (ABV)",
      locations: 51,
      price: "NGN 76,200.00",
      img: "https://images.unsplash.com/photo-1611348586750-61bf6c080437?w=120&h=80&fit=crop",
    },
    {
      id: 12,
      city: "Port Harcourt Intl (PHC)",
      locations: 37,
      price: "NGN 65,900.00",
      img: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=120&h=80&fit=crop",
    },
    {
      id: 13,
      city: "Mallam Aminu Kano Intl (KAN)",
      locations: 34,
      price: "NGN 102,300.00",
      img: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=120&h=80&fit=crop",
    },
    {
      id: 14,
      city: "Akanu Ibiam Intl (ENU)",
      locations: 26,
      price: "NGN 79,500.00",
      img: "https://images.unsplash.com/photo-1620049729374-f6b2e7ef8d72?w=120&h=80&fit=crop",
    },
    {
      id: 15,
      city: "Sam Mbakwe Airport (QOW)",
      locations: 19,
      price: "NGN 71,800.00",
      img: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=120&h=80&fit=crop",
    },
  ],
};

export default function PopularDestinations() {
  const [activeTab, setActiveTab] = useState("cities");
  const [showMore, setShowMore] = useState(false);

  const items = destinations[activeTab];
  const visibleItems = showMore ? items : items.slice(0, 9);

  return (
    <section className="destinations-section">
      <div className="destinations-header">
        <div>
          <h2 className="destinations-title">Popular car hire destinations</h2>
          <p className="destinations-subtitle">
            Explore top car hire locations across Nigeria
          </p>
        </div>
        <div className="tab-switcher">
          <button
            className={`tab-btn ${activeTab === "cities" ? "tab-active" : ""}`}
            onClick={() => {
              setActiveTab("cities");
              setShowMore(false);
            }}
          >
            Cities in Nigeria
          </button>
          <button
            className={`tab-btn ${activeTab === "airports" ? "tab-active" : ""}`}
            onClick={() => {
              setActiveTab("airports");
              setShowMore(false);
            }}
          >
            Aiport in Nigeria
          </button>
        </div>
      </div>

      <div className="destinations-grid">
        {visibleItems.map((dest) => (
          <div className="dest-item" key={dest.id}>
            <img
              src={dest.img}
              alt={dest.city}
              className="dest-img"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/120x80?text=" + dest.city;
              }}
            />
            <div className="dest-info">
              <h4 className="dest-city">{dest.city}</h4>
              <p className="dest-locations">
                {dest.locations} car hire locations
              </p>
              <p className="dest-price">
                Average price of{" "}
                <strong>NGN {dest.price.replace("NGN ", "")}</strong> per day
              </p>
            </div>
          </div>
        ))}
      </div>

      {!showMore && items.length > 9 && (
        <button className="show-more-btn" onClick={() => setShowMore(true)}>
          <span className="show-more-plus">+</span> Show more
        </button>
      )}
      {showMore && (
        <button className="show-more-btn" onClick={() => setShowMore(false)}>
          <span className="show-more-plus">−</span> Show less
        </button>
      )}
    </section>
  );
}
