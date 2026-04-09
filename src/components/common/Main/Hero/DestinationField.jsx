import { useRef, useEffect, useState } from "react";
import "./DestinationField.css";


const RECENT_SEARCHES_KEY = "recent_searches";

function getRecentSearches() {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(name) {
  if (!name) return;
  let searches = getRecentSearches();
  // Remove if already exists
  searches = searches.filter((s) => s.name !== name);
  // Add to front
  searches.unshift({ name, detail: "" });
  // Limit to 5
  if (searches.length > 5) searches = searches.slice(0, 5);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}


export default function DestinationField({ destination, setDestination }) {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(getRecentSearches());
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);



  function handleSelect(name) {
    setDestination(name);
    setOpen(false);
    addRecentSearch(name);
    setRecent(getRecentSearches());
  }

  function handleInputBlur() {
    // Optionally, add to recent on blur if not empty and not already present
    if (destination && !recent.some((s) => s.name === destination)) {
      addRecentSearch(destination);
      setRecent(getRecentSearches());
    }
  }

  return (
    <div className="search-field destination-field" ref={ref}>
      <span className="field-icon">🛏</span>
      <input
        type="search"
        placeholder="Where do you want to go?"
        value={destination}
        onFocus={() => {
          setRecent(getRecentSearches());
          setOpen(true);
        }}
        onBlur={handleInputBlur}
        onChange={(e) => {
          setDestination(e.target.value);
          setOpen(true);
        }}
        required
      />

      {open && (
        <div className="dest-dropdown">
          {recent.length > 0 ? (
            <>
              <p className="dd-section-title">Your recent searches</p>
              {recent.map((item, i) => (
                <div
                  key={item.name + "-" + i}
                  className="dd-item"
                  onMouseDown={() => handleSelect(item.name)}
                >
                  <span className="dd-icon">🕐</span>
                  <div>
                    <div className="dd-name">{item.name}</div>
                    {item.detail && (
                      <div className="dd-detail">{item.detail}</div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="dd-empty">No recent searches</div>
          )}
        </div>
      )}
    </div>
  );
}
