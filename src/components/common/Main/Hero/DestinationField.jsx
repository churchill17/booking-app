import { useRef, useEffect, useState } from "react";
import "./DestinationField.css";

const RECENT_SEARCHES = [
  { name: "Abuja", detail: "6 Mar – 8 Mar, 2 adults" },
  { name: "Nnamdi Azikiwe International Airport", detail: "1 adult" },
  { name: "Nnamdi Azikiwe International Airport", detail: "1 adult" },
];
const TRENDING = [
  { name: "Lagos", detail: "Nigeria" },
  { name: "Lekki", detail: "Nigeria" },
  { name: "Ikeja", detail: "Nigeria" },
];

export default function DestinationField({ destination, setDestination }) {
  const [open, setOpen] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const visibleRecent = destination
    ? RECENT_SEARCHES.filter((s) =>
        s.name.toLowerCase().includes(destination.toLowerCase()),
      )
    : showAllRecent
      ? RECENT_SEARCHES
      : RECENT_SEARCHES.slice(0, 3);

  const visibleTrending = destination
    ? TRENDING.filter((s) =>
        s.name.toLowerCase().includes(destination.toLowerCase()),
      )
    : TRENDING;

  function handleSelect(name) {
    setDestination(name);
    setOpen(false);
  }

  return (
    <div className="search-field destination-field" ref={ref}>
      <span className="field-icon">🛏</span>
      <input
        type="search"
        placeholder="Where do you want to go?"
        value={destination}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setDestination(e.target.value);
          setOpen(true);
        }}
        required
      />

      {open && (
        <div className="dest-dropdown">
          <div
            className="dd-item dd-location"
            onMouseDown={() => handleSelect("Around current location")}
          >
            <span className="dd-icon">◎</span>
            <span className="dd-name">Around current location</span>
          </div>

          {visibleRecent.length > 0 && (
            <>
              {!destination && (
                <p className="dd-section-title">Your recent searches</p>
              )}
              {visibleRecent.map((item, i) => (
                <div
                  key={item.name + "-" + i}
                  className="dd-item"
                  onMouseDown={() => handleSelect(item.name)}
                >
                  <span className="dd-icon">🕐</span>
                  <div>
                    <div className="dd-name">{item.name}</div>
                    <div className="dd-detail">{item.detail}</div>
                  </div>
                </div>
              ))}
              {!destination && !showAllRecent && RECENT_SEARCHES.length > 3 && (
                <button
                  type="button"
                  className="dd-show-more"
                  onMouseDown={() => setShowAllRecent(true)}
                >
                  Show more
                </button>
              )}
            </>
          )}

          {visibleTrending.length > 0 && (
            <>
              {!destination && (
                <p className="dd-section-title">Trending destinations</p>
              )}
              {visibleTrending.map((item, i) => (
                <div
                  key={item.name + "-" + i}
                  className="dd-item"
                  onMouseDown={() => handleSelect(item.name)}
                >
                  <span className="dd-icon">📍</span>
                  <div>
                    <div className="dd-name">{item.name}</div>
                    <div className="dd-detail">{item.detail}</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {visibleRecent.length === 0 && visibleTrending.length === 0 && (
            <div className="dd-empty">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
