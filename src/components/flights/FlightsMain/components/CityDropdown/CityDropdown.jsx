import { useEffect, useRef, useState } from "react";
import { NIGERIAN_CITIES } from "../../constants";
import "./CityDropdown.css";

export default function CityDropdown({
  value,
  onChange,
  exclude,
  placeholder,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const filtered = NIGERIAN_CITIES.filter(
    (c) =>
      c.code !== exclude &&
      (c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="fd-city-panel">
      <div className="fd-city-search-row">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          className="fd-city-search-input"
          placeholder={placeholder || "Search city or airport"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="fd-city-list">
        {filtered.map((city) => (
          <button
            key={city.code}
            type="button"
            className={`fd-city-item ${value === `${city.name} (${city.code})` ? "active" : ""}`}
            onClick={() => onChange(`${city.name} (${city.code})`)}
          >
            <span className="fd-city-code">{city.code}</span>
            <span className="fd-city-info">
              <span className="fd-city-name">{city.name}</span>
              <span className="fd-city-airport">{city.airport}</span>
            </span>
            {value === `${city.name} (${city.code})` && (
              <svg
                className="fd-city-check"
                width="16"
                height="16"
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
    </div>
  );
}
