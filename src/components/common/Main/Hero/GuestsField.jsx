import { useState, useRef, useEffect } from "react";
import "./GuestsField.css";

function Counter({ label, value, onChange, min = 0, max = 10 }) {
  return (
    <div className="guest-row">
      <span className="guest-label">{label}</span>
      <div className="guest-counter">
        <button
          type="button"
          className="counter-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          −
        </button>
        <span className="counter-value">{value}</span>
        <button
          type="button"
          className="counter-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function GuestsField({ adults, setAdults, children, setChildren, rooms, setRooms }) {
  const [open, setOpen] = useState(false);
  const [pets, setPets] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const guestLabel = `${adults} adult${adults > 1 ? "s" : ""} · ${children} child${children !== 1 ? "ren" : ""} · ${rooms} room${rooms > 1 ? "s" : ""}`;

  return (
    <div className="search-field guests-field" ref={ref}>
      <span className="field-icon">👤</span>
      <div className="guest-display" onClick={() => setOpen(o => !o)}>
        {guestLabel}
      </div>
      <span className="guest-chevron" onClick={() => setOpen(o => !o)}>▾</span>

      {open && (
        <div className="guests-dropdown">
          <Counter label="Adults"   value={adults}   onChange={setAdults}   min={1} max={30} />
          <Counter label="Children" value={children} onChange={setChildren} min={0} max={10} />
          <Counter label="Rooms"    value={rooms}    onChange={setRooms}    min={1} max={30} />

          <div className="guests-divider" />

          <div className="pets-row">
            <div className="pets-text">
              <span className="pets-label">Travelling with pets?</span>
              <span className="pets-note">Assistance animals aren't considered pets.</span>
              <a href="#" className="pets-link">Read more about travelling with assistance animals</a>
            </div>
            <button
              type="button"
              className={`toggle ${pets ? "on" : ""}`}
              onClick={() => setPets(p => !p)}
              aria-label="Toggle pets"
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          <button
            type="button"
            className="guests-done-btn"
            onClick={() => setOpen(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
