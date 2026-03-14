import { useState } from "react";
import "./HeroSearch.css";

export default function HeroSearch() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("Mon 16 Mar");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState("Thu 19 Mar");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [differentLocation, setDifferentLocation] = useState(false);
  const [driverAge, setDriverAge] = useState(true);
  const [driverAgeValue, setDriverAgeValue] = useState();
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = () => {
    setSearchResults({
      location: pickupLocation || "Airport, city or station",
      pickup: `${pickupDate} at ${pickupTime}`,
      dropoff: `${dropoffDate} at ${dropoffTime}`,
      results: [
        {
          id: 1,
          car: "Toyota Corolla",
          type: "Economy",
          price: "NGN 45,200",
          company: "Hertz",
          seats: 5,
          doors: 4,
        },
        {
          id: 2,
          car: "Honda CR-V",
          type: "SUV",
          price: "NGN 72,500",
          company: "Avis",
          seats: 5,
          doors: 4,
        },
        {
          id: 3,
          car: "Ford Focus",
          type: "Compact",
          price: "NGN 38,900",
          company: "Budget",
          seats: 5,
          doors: 4,
        },
      ],
    });
  };

  return (
    <section className="hero-search">
      <div className="hero-banner">
        <h1 className="hero-title">Car hire for any kind of trip</h1>
        <p className="hero-subtitle">
          Great cars at great prices, from the biggest car rental companies
        </p>
      </div>

      <div className="search-bar-wrapper">
        <div className="search-bar">
          <div className="search-field location-field">
            <span className="search-icon">🔍</span>
            <div className="field-content">
              <label className="field-label">Pick-up location</label>
              <input
                type="text"
                placeholder="Airport, city or station"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="field-input"
              />
            </div>
          </div>

          <div className="search-divider" />

          <div className="search-field date-field">
            <span className="search-icon">📅</span>
            <div className="field-content">
              <label className="field-label">Pick-up date</label>
              <input
                type="text"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="field-input"
              />
            </div>
          </div>

          <div className="search-divider" />

          <div className="search-field time-field">
            <span className="search-icon">🕙</span>
            <div className="field-content">
              <label className="field-label">Time</label>
              <input
                type="text"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="field-input"
              />
            </div>
          </div>

          <div className="search-divider" />

          <div className="search-field date-field">
            <span className="search-icon">📅</span>
            <div className="field-content">
              <label className="field-label">Drop-off date</label>
              <input
                type="text"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className="field-input"
              />
            </div>
          </div>

          <div className="search-divider" />

          <div className="search-field time-field">
            <span className="search-icon">🕙</span>
            <div className="field-content">
              <label className="field-label">Time</label>
              <input
                type="text"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                className="field-input"
              />
            </div>
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="search-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={differentLocation}
              onChange={(e) => setDifferentLocation(e.target.checked)}
            />
            <span className="checkbox-custom" />
            Drop car off at different location
          </label>

          <div className="driver-age-option">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={driverAge}
                onChange={(e) => setDriverAge(e.target.checked)}
              />
              <span className="checkbox-custom checked-blue" />
              Driver aged between 30 - 65?
            </label>

            {!driverAge && (
              <div className="driver-age-inline">
                <label
                  className="driver-age-input-label"
                  htmlFor="driver-age-input"
                >
                  Driver's Age
                </label>
                <input
                  id="driver-age-input"
                  className="driver-age-input"
                  type="number"
                  min="18"
                  max="99"
                  step="1"
                  value={driverAgeValue}
                  onChange={(e) => setDriverAgeValue(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {searchResults && (
        <div className="search-results">
          <h3 className="results-title">
            Search Results for <span>{searchResults.location}</span>
          </h3>
          <p className="results-meta">
            {searchResults.pickup} → {searchResults.dropoff}
          </p>
          <div className="results-grid">
            {searchResults.results.map((car) => (
              <div className="result-card" key={car.id}>
                <div className="car-icon">🚗</div>
                <div className="car-info">
                  <h4 className="car-name">{car.car}</h4>
                  <span className="car-type">{car.type}</span>
                  <div className="car-meta">
                    <span>👤 {car.seats} seats</span>
                    <span>🚪 {car.doors} doors</span>
                  </div>
                  <span className="car-company">{car.company}</span>
                </div>
                <div className="car-price">
                  <span className="price-label">From</span>
                  <strong className="price-value">{car.price}</strong>
                  <span className="price-per">per day</span>
                  <button className="select-btn">Select</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="savings-section">
        <h2 className="savings-title">Travel more, spend less</h2>
        <div className="savings-card">
          <div className="savings-content">
            <h3 className="savings-card-title">Sign in, save money</h3>
            <p className="savings-card-text">
              Save 10% on select rental cars – just look for the blue Genius
              label
            </p>
            <div className="savings-actions">
              <button className="btn-primary">Sign in</button>
              <button className="btn-link">Register</button>
            </div>
          </div>
          <div className="genius-badge">
            <div className="genius-box">
              <span className="genius-label">Genius</span>
              <span className="genius-ribbon">🎁</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
