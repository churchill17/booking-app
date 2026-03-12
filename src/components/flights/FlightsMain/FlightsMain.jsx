import { useState } from "react";
import "./FlightsMain.css";
import { getBookingApiUrl } from "../../../utils/api";

const TRIP_TYPES = ["Round-trip", "One-way", "Multi-city"];
const FLIGHTS_API_URL = getBookingApiUrl("flights.php");

export default function FlightsMain() {
  const [tripType, setTripType] = useState("Round-trip");
  const [showTripDropdown, setShowTripDropdown] = useState(false);
  const [from, setFrom] = useState("Abuja (ABV)");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1 adult, Economy");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function swapLocations() {
    setFrom(to);
    setTo(from);
  }

  function clearFrom() {
    setFrom("");
  }

  const validate = () => {
    const newErrors = {};
    if (!from.trim()) newErrors.from = "Origin is required";
    if (!to.trim()) newErrors.to = "Destination is required";
    if (!departure) newErrors.departure = "Departure date is required";
    if (tripType !== "One-way" && !returnDate)
      newErrors.returnDate = "Return date is required";
    if (!passengers.trim()) newErrors.passengers = "Passengers is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(FLIGHTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripType,
          from: from.trim(),
          to: to.trim(),
          departure,
          returnDate: tripType === "One-way" ? null : returnDate,
          passengers: passengers.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.message || "Flight search failed. Please try again.",
        );
      }

      setSubmitSuccess(
        data?.message || "Flight search submitted successfully.",
      );
    } catch (error) {
      setSubmitError(
        error.message || "Flight search failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flights-content">
      <section className="flights-hero">
        <div className="flights-hero-content">
          <div className="flights-hero-text">
            <h1 className="flights-hero-title">
              Search hundreds of flight sites at once.
            </h1>

            {/* Trip type selector */}
            <div className="flights-trip-selector">
              <button
                className="flights-trip-btn"
                onClick={() => setShowTripDropdown((p) => !p)}
                type="button"
              >
                {tripType}
                <svg
                  className={`trip-chevron ${showTripDropdown ? "open" : ""}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showTripDropdown && (
                <ul className="flights-trip-dropdown">
                  {TRIP_TYPES.map((t) => (
                    <li key={t}>
                      <button
                        type="button"
                        className={`trip-option ${tripType === t ? "active" : ""}`}
                        onClick={() => {
                          setTripType(t);
                          setShowTripDropdown(false);
                        }}
                      >
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Search bar */}
            <form className="flights-search-bar" onSubmit={handleSubmit}>
              {/* From */}
              <div className="flights-field flights-field-from">
                {from && (
                  <span className="flights-tag">
                    {from}
                    <button
                      type="button"
                      className="flights-tag-clear"
                      onClick={clearFrom}
                      aria-label="Clear origin"
                    >
                      ×
                    </button>
                  </span>
                )}
                {!from && (
                  <input
                    className="flights-input"
                    placeholder="From?"
                    value={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      if (errors.from)
                        setErrors((prev) => ({ ...prev, from: "" }));
                    }}
                  />
                )}
              </div>

              {/* Swap button */}
              <button
                type="button"
                className="flights-swap-btn"
                onClick={swapLocations}
                aria-label="Swap locations"
              >
                ⇄
              </button>

              {/* To */}
              <div className="flights-field flights-field-to">
                <input
                  className="flights-input"
                  placeholder="To?"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    if (errors.to) setErrors((prev) => ({ ...prev, to: "" }));
                  }}
                />
              </div>

              <div className="flights-divider" />

              {/* Dates */}
              <div className="flights-field flights-field-dates">
                <input
                  className="flights-input"
                  type="text"
                  placeholder="Departure"
                  value={departure}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  onChange={(e) => {
                    setDeparture(e.target.value);
                    if (errors.departure)
                      setErrors((prev) => ({ ...prev, departure: "" }));
                  }}
                />
                {tripType !== "One-way" && (
                  <>
                    <span className="flights-date-dash">–</span>
                    <input
                      className="flights-input"
                      type="text"
                      placeholder="Return"
                      value={returnDate}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                      onChange={(e) => {
                        setReturnDate(e.target.value);
                        if (errors.returnDate)
                          setErrors((prev) => ({ ...prev, returnDate: "" }));
                      }}
                    />
                  </>
                )}
              </div>

              <div className="flights-divider" />

              {/* Passengers */}
              <div className="flights-field flights-field-passengers">
                <input
                  className="flights-input"
                  placeholder="1 adult, Economy"
                  value={passengers}
                  onChange={(e) => {
                    setPassengers(e.target.value);
                    if (errors.passengers)
                      setErrors((prev) => ({ ...prev, passengers: "" }));
                  }}
                />
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="flights-search-btn"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            {(errors.from ||
              errors.to ||
              errors.departure ||
              errors.returnDate ||
              errors.passengers) && (
              <p className="flights-form-error">
                {errors.from ||
                  errors.to ||
                  errors.departure ||
                  errors.returnDate ||
                  errors.passengers}
              </p>
            )}

            {submitError && <p className="flights-form-error">{submitError}</p>}
            {submitSuccess && (
              <p className="flights-form-success">{submitSuccess}</p>
            )}
          </div>

          {/* Right side images */}
          <div className="flights-hero-images">
            <div className="flights-img-card flights-img-top">
              <img
                src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&q=80"
                alt="Aerial view from plane window"
              />
            </div>
            <div className="flights-img-card flights-img-bottom">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80"
                alt="Child looking out plane window"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
