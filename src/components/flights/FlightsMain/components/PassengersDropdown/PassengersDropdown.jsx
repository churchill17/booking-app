import { CABIN_CLASSES } from "../../constants";
import "./PassengersDropdown.css";

export default function PassengersDropdown({
  adults,
  setAdults,
  children,
  setChildren,
  infants,
  setInfants,
  cabinClass,
  setCabinClass,
  onDone,
}) {
  return (
    <div className="fd-passengers-panel">
      <div className="fd-pax-row">
        <div className="fd-pax-label">
          <span className="fd-pax-type">Adults</span>
          <span className="fd-pax-sub">12+ years</span>
        </div>
        <div className="fd-pax-counter">
          <button
            type="button"
            className="fd-pax-btn"
            onClick={() => setAdults((n) => Math.max(1, n - 1))}
          >
            −
          </button>
          <span className="fd-pax-num">{adults}</span>
          <button
            type="button"
            className="fd-pax-btn"
            onClick={() => setAdults((n) => Math.min(9, n + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="fd-pax-row">
        <div className="fd-pax-label">
          <span className="fd-pax-type">Children</span>
          <span className="fd-pax-sub">2–11 years</span>
        </div>
        <div className="fd-pax-counter">
          <button
            type="button"
            className="fd-pax-btn"
            onClick={() => setChildren((n) => Math.max(0, n - 1))}
          >
            −
          </button>
          <span className="fd-pax-num">{children}</span>
          <button
            type="button"
            className="fd-pax-btn"
            onClick={() => setChildren((n) => Math.min(8, n + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="fd-pax-row">
        <div className="fd-pax-label">
          <span className="fd-pax-type">Infants</span>
          <span className="fd-pax-sub">Under 2 years</span>
        </div>
        <div className="fd-pax-counter">
          <button
            type="button"
            className="fd-pax-btn"
            onClick={() => setInfants((n) => Math.max(0, n - 1))}
          >
            −
          </button>
          <span className="fd-pax-num">{infants}</span>
          <button
            type="button"
            className="fd-pax-btn"
            onClick={() => setInfants((n) => Math.min(adults, n + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="fd-pax-divider" />
      <div className="fd-cabin-title">Cabin class</div>

      <div className="fd-cabin-list">
        {CABIN_CLASSES.map((cls) => (
          <button
            key={cls}
            type="button"
            className={`fd-cabin-item ${cabinClass === cls ? "active" : ""}`}
            onClick={() => setCabinClass(cls)}
          >
            {cls}
            {cabinClass === cls && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a56db"
                strokeWidth="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <button type="button" className="fd-pax-done" onClick={onDone}>
        Done
      </button>
    </div>
  );
}
