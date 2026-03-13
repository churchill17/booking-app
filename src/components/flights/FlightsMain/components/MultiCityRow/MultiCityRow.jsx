import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { displayDate } from "../../utils/dateUtils";
import CalendarDropdown from "../CalendarDropdown/CalendarDropdown";
import CityDropdown from "../CityDropdown/CityDropdown";
import "./MultiCityRow.css";

export default function MultiCityRow({
  index,
  flight,
  onChange,
  onRemove,
  canRemove,
}) {
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showDep, setShowDep] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const depRef = useRef(null);

  useClickOutside(fromRef, () => setShowFrom(false));
  useClickOutside(toRef, () => setShowTo(false));
  useClickOutside(depRef, () => setShowDep(false));

  return (
    <div className="mc-row">
      <span className="mc-row-num">{index + 1}</span>

      <div className="mc-field-wrap" ref={fromRef}>
        <button
          type="button"
          className={`mc-field-btn ${!flight.from ? "placeholder" : ""}`}
          onClick={() => {
            setShowFrom((p) => !p);
            setShowTo(false);
            setShowDep(false);
          }}
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
          {flight.from || "From?"}
        </button>
        {showFrom && (
          <div className="fd-dropdown-panel">
            <CityDropdown
              value={flight.from}
              onChange={(v) => {
                onChange({ ...flight, from: v });
                setShowFrom(false);
              }}
              exclude={flight.to?.split(" (")[1]?.replace(")", "")}
              placeholder="Departure city"
            />
          </div>
        )}
      </div>

      <div className="mc-field-wrap" ref={toRef}>
        <button
          type="button"
          className={`mc-field-btn ${!flight.to ? "placeholder" : ""}`}
          onClick={() => {
            setShowTo((p) => !p);
            setShowFrom(false);
            setShowDep(false);
          }}
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
          {flight.to || "To?"}
        </button>
        {showTo && (
          <div className="fd-dropdown-panel">
            <CityDropdown
              value={flight.to}
              onChange={(v) => {
                onChange({ ...flight, to: v });
                setShowTo(false);
              }}
              exclude={flight.from?.split(" (")[1]?.replace(")", "")}
              placeholder="Destination city"
            />
          </div>
        )}
      </div>

      <div className="mc-field-wrap" ref={depRef}>
        <button
          type="button"
          className={`mc-field-btn ${!flight.departure ? "placeholder" : ""}`}
          onClick={() => {
            setShowDep((p) => !p);
            setShowFrom(false);
            setShowTo(false);
          }}
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
          {flight.departure ? displayDate(flight.departure) : "Departure"}
        </button>
        {showDep && (
          <div className="fd-dropdown-panel">
            <CalendarDropdown
              value={flight.departure}
              onChange={(v) => {
                onChange({ ...flight, departure: v });
                setShowDep(false);
              }}
            />
          </div>
        )}
      </div>

      {canRemove && (
        <button
          type="button"
          className="mc-remove-btn"
          onClick={onRemove}
          aria-label="Remove flight"
        >
          ×
        </button>
      )}
    </div>
  );
}
