import { useRef, useState } from "react";
import "./FlightsMain.css";
import { getBookingApiUrl } from "../../../utils/api";
import { TRIP_TYPES } from "./constants";
import useClickOutside from "./hooks/useClickOutside";
import { displayDate } from "./utils/dateUtils";
import CalendarDropdown from "./components/CalendarDropdown/CalendarDropdown";
import CityDropdown from "./components/CityDropdown/CityDropdown";
import MultiCityRow from "./components/MultiCityRow/MultiCityRow";
import PassengersDropdown from "./components/PassengersDropdown/PassengersDropdown";
import ValidationPopup from "./components/ValidationPopup/ValidationPopup";

const FLIGHTS_API_URL = getBookingApiUrl("flights.php");

export default function FlightsMain() {
  const [tripType, setTripType] = useState("Round-trip");
  const [showTripDropdown, setShowTripDropdown] = useState(false);

  // Round-trip / One-way fields
  const [from, setFrom] = useState("Abuja (ABV)");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Active dropdown panels
  const [activePanel, setActivePanel] = useState(null); // "from"|"to"|"departure"|"return"|"passengers"

  // Passengers
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");

  // Multi-city flights
  const [multiFlights, setMultiFlights] = useState([
    { from: "Abuja (ABV)", to: "", departure: "" },
    { from: "", to: "", departure: "" },
  ]);
  const [multiAdults, setMultiAdults] = useState(1);
  const [showMultiPax, setShowMultiPax] = useState(false);
  const [multiChildren, setMultiChildren] = useState(0);
  const [multiInfants, setMultiInfants] = useState(0);
  const [multiCabinClass, setMultiCabinClass] = useState("Economy");

  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for click-outside
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const dateRef = useRef(null);
  const paxRef = useRef(null);
  const tripRef = useRef(null);
  const multiPaxRef = useRef(null);

  useClickOutside(fromRef, () => {
    if (activePanel === "from") setActivePanel(null);
  });
  useClickOutside(toRef, () => {
    if (activePanel === "to") setActivePanel(null);
  });
  useClickOutside(dateRef, () => {
    if (activePanel === "departure" || activePanel === "return")
      setActivePanel(null);
  });
  useClickOutside(paxRef, () => {
    if (activePanel === "passengers") setActivePanel(null);
  });
  useClickOutside(tripRef, () => setShowTripDropdown(false));
  useClickOutside(multiPaxRef, () => setShowMultiPax(false));

  const passengersLabel = () => {
    const total = adults + children + infants;
    return `${total} passenger${total !== 1 ? "s" : ""}, ${cabinClass}`;
  };
  const multiPaxLabel = () => {
    const total = multiAdults + multiChildren + multiInfants;
    return `${total} adult${total !== 1 ? "s" : ""}, ${multiCabinClass}`;
  };

  function swapLocations() {
    setFrom(to);
    setTo(from);
  }

  const validate = () => {
    const newErrors = {};
    if (tripType === "Multi-city") {
      multiFlights.forEach((f, i) => {
        if (!f.from.trim())
          newErrors[`mc_from_${i}`] = `Flight ${i + 1}: Origin required`;
        if (!f.to.trim())
          newErrors[`mc_to_${i}`] = `Flight ${i + 1}: Destination required`;
        if (!f.departure)
          newErrors[`mc_dep_${i}`] = `Flight ${i + 1}: Departure date required`;
      });
    } else {
      if (!from.trim()) newErrors.from = "Origin is required";
      if (!to.trim()) newErrors.to = "Destination is required";
      if (!departure) newErrors.departure = "Departure date is required";
      if (tripType === "Round-trip" && !returnDate)
        newErrors.returnDate = "Return date is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setShowValidation(false);

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShowValidation(true);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const body =
        tripType === "Multi-city"
          ? { tripType, flights: multiFlights, passengers: multiPaxLabel() }
          : {
              tripType,
              from: from.trim(),
              to: to.trim(),
              departure,
              returnDate: tripType === "One-way" ? null : returnDate,
              passengers: passengersLabel(),
            };

      const response = await fetch(FLIGHTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
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
            <div className="flights-trip-selector" ref={tripRef}>
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
                          setActivePanel(null);
                        }}
                      >
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── MULTI-CITY ── */}
            {tripType === "Multi-city" ? (
              <form
                className="flights-search-bar mc-form"
                onSubmit={handleSubmit}
              >
                <div className="mc-flights-list">
                  {multiFlights.map((flight, idx) => (
                    <MultiCityRow
                      key={idx}
                      index={idx}
                      flight={flight}
                      onChange={(updated) => {
                        const copy = [...multiFlights];
                        copy[idx] = updated;
                        setMultiFlights(copy);
                      }}
                      onRemove={() =>
                        setMultiFlights((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                      canRemove={multiFlights.length > 2}
                    />
                  ))}
                </div>

                <div className="mc-footer">
                  <div className="mc-footer-left">
                    {multiFlights.length < 5 && (
                      <button
                        type="button"
                        className="mc-add-btn"
                        onClick={() =>
                          setMultiFlights((prev) => [
                            ...prev,
                            { from: "", to: "", departure: "" },
                          ])
                        }
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add another flight
                      </button>
                    )}
                    <button
                      type="button"
                      className="mc-clear-btn"
                      onClick={() =>
                        setMultiFlights([
                          { from: "", to: "", departure: "" },
                          { from: "", to: "", departure: "" },
                        ])
                      }
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="mc-footer-right">
                    {/* Multi-city passengers */}
                    <div className="mc-pax-wrap" ref={multiPaxRef}>
                      <button
                        type="button"
                        className="mc-pax-btn"
                        onClick={() => setShowMultiPax((p) => !p)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {multiPaxLabel()}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      {showMultiPax && (
                        <div className="fd-dropdown-panel fd-dropdown-up">
                          <PassengersDropdown
                            adults={multiAdults}
                            setAdults={setMultiAdults}
                            children={multiChildren}
                            setChildren={setMultiChildren}
                            infants={multiInfants}
                            setInfants={setMultiInfants}
                            cabinClass={multiCabinClass}
                            setCabinClass={setMultiCabinClass}
                            onDone={() => setShowMultiPax(false)}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="flights-search-btn"
                      disabled={loading}
                    >
                      {loading ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* ── ROUND-TRIP / ONE-WAY ── */
              <form className="flights-search-bar" onSubmit={handleSubmit}>
                {/* From */}
                <div
                  className="flights-field flights-field-from fd-relative"
                  ref={fromRef}
                >
                  <button
                    type="button"
                    className={`fd-field-btn ${!from ? "placeholder" : ""}`}
                    onClick={() => togglePanel("from")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="10" r="3" />
                      <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 0 1 8-8z" />
                    </svg>
                    <span className="fd-field-value">{from || "From?"}</span>
                    {from && (
                      <span
                        className="fd-field-clear"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFrom("");
                          setActivePanel("from");
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.stopPropagation(),
                          setFrom(""),
                          setActivePanel("from"))
                        }
                        aria-label="Clear origin"
                      >
                        ×
                      </span>
                    )}
                  </button>
                  {activePanel === "from" && (
                    <div className="fd-dropdown-panel">
                      <CityDropdown
                        value={from}
                        onChange={(v) => {
                          setFrom(v);
                          setActivePanel(null);
                          if (errors.from)
                            setErrors((p) => ({ ...p, from: "" }));
                        }}
                        exclude={to?.split(" (")[1]?.replace(")", "")}
                        placeholder="Departure city"
                      />
                    </div>
                  )}
                </div>

                {/* Swap */}
                <button
                  type="button"
                  className="flights-swap-btn"
                  onClick={swapLocations}
                  aria-label="Swap locations"
                >
                  ⇄
                </button>

                {/* To */}
                <div
                  className="flights-field flights-field-to fd-relative"
                  ref={toRef}
                >
                  <button
                    type="button"
                    className={`fd-field-btn ${!to ? "placeholder" : ""}`}
                    onClick={() => togglePanel("to")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="10" r="3" />
                      <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 0 1 8-8z" />
                    </svg>
                    <span className="fd-field-value">{to || "To?"}</span>
                    {to && (
                      <span
                        className="fd-field-clear"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTo("");
                          setActivePanel("to");
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.stopPropagation(), setTo(""), setActivePanel("to"))
                        }
                        aria-label="Clear destination"
                      >
                        ×
                      </span>
                    )}
                  </button>
                  {activePanel === "to" && (
                    <div className="fd-dropdown-panel">
                      <CityDropdown
                        value={to}
                        onChange={(v) => {
                          setTo(v);
                          setActivePanel(null);
                          if (errors.to) setErrors((p) => ({ ...p, to: "" }));
                        }}
                        exclude={from?.split(" (")[1]?.replace(")", "")}
                        placeholder="Destination city"
                      />
                    </div>
                  )}
                </div>

                <div className="flights-divider" />

                {/* Dates */}
                <div
                  className="flights-field flights-field-dates fd-relative"
                  ref={dateRef}
                >
                  <button
                    type="button"
                    className={`fd-field-btn fd-date-field-btn ${
                      !departure ? "placeholder" : ""
                    } ${activePanel === "departure" ? "active" : ""}`}
                    onClick={() => togglePanel("departure")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <span className="fd-field-value">
                      {departure ? displayDate(departure) : "Departure"}
                    </span>
                  </button>

                  {tripType !== "One-way" &&
                    !activePanel?.startsWith("departure") &&
                    !activePanel?.startsWith("return") && (
                      <span className="flights-date-dash">–</span>
                    )}

                  {tripType !== "One-way" && (
                    <button
                      type="button"
                      className={`fd-field-btn fd-date-field-btn ${
                        !returnDate ? "placeholder" : ""
                      } ${activePanel === "return" ? "active" : ""}`}
                      onClick={() => togglePanel("return")}
                    >
                      <span className="fd-field-value">
                        {returnDate ? displayDate(returnDate) : "Return"}
                      </span>
                    </button>
                  )}

                  {(activePanel === "departure" ||
                    activePanel === "return") && (
                    <div className="fd-dropdown-panel fd-calendar-dropdown">
                      <div className="fd-cal-panels">
                        <div className="fd-cal-side">
                          <div className="fd-cal-side-label">Departure</div>
                          <CalendarDropdown
                            value={departure}
                            onChange={(v) => {
                              setDeparture(v);
                              if (errors.departure)
                                setErrors((p) => ({ ...p, departure: "" }));
                              if (tripType !== "One-way")
                                setActivePanel("return");
                              else setActivePanel(null);
                            }}
                          />
                        </div>
                        {tripType !== "One-way" && (
                          <div className="fd-cal-side">
                            <div className="fd-cal-side-label">Return</div>
                            <CalendarDropdown
                              value={returnDate}
                              onChange={(v) => {
                                setReturnDate(v);
                                if (errors.returnDate)
                                  setErrors((p) => ({ ...p, returnDate: "" }));
                                setActivePanel(null);
                              }}
                              minDate={departure}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flights-divider" />

                {/* Passengers */}
                <div
                  className="flights-field flights-field-passengers fd-relative"
                  ref={paxRef}
                >
                  <button
                    type="button"
                    className="fd-field-btn"
                    onClick={() => togglePanel("passengers")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="fd-field-value">{passengersLabel()}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {activePanel === "passengers" && (
                    <div className="fd-dropdown-panel fd-dropdown-right">
                      <PassengersDropdown
                        adults={adults}
                        setAdults={setAdults}
                        children={children}
                        setChildren={setChildren}
                        infants={infants}
                        setInfants={setInfants}
                        cabinClass={cabinClass}
                        setCabinClass={setCabinClass}
                        onDone={() => setActivePanel(null)}
                      />
                    </div>
                  )}
                </div>

                {/* Search */}
                <button
                  type="submit"
                  className="flights-search-btn"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </form>
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

      {/* Validation popup */}
      {showValidation && (
        <ValidationPopup
          errors={errors}
          onClose={() => setShowValidation(false)}
        />
      )}
    </main>
  );
}
