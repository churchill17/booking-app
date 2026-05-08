import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { loadSearch } from "../../utils/searchStorage";
import { rankProperties } from "./searchRecommendations";
import PropertyCard from "./PropertyCard";
import "./Results.css";

export default function Results({ properties, loading = false }) {
  const location = useLocation();
  const src      = new URLSearchParams(location.search);
  const saved    = loadSearch();

  const checkIn  = src.get("checkIn");
  const checkOut = src.get("checkOut");
  const nights   = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 1;
  const adults   = parseInt(src.get("adults"),   10) || saved?.adults   || 1;
  const children = parseInt(src.get("children"), 10) || saved?.children || 0;
  const rooms    = parseInt(src.get("rooms"),    10) || saved?.rooms    || 1;

  const ranked = useMemo(
    () => rankProperties(properties, { nights, adults, children, rooms }),
    [properties, nights, adults, children, rooms],
  );

  if (loading) {
    return (
      <div className="search-filter-results">
        <div className="sf-loading">
          <div className="sf-loading-spinner" />
          Searching for properties…
        </div>
      </div>
    );
  }

  if (!ranked.length) {
    return (
      <div className="search-filter-results">
        <div className="sf-empty">
          <span className="sf-empty-icon">🏨</span>
          <p>No properties found for your search.</p>
          <p className="sf-empty-sub">Try a different destination, dates, or adjust your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-filter-results">
      <div className="search-filter-advisory">
        Please review any travel advisories provided by your government to make
        an informed decision about your stay in this area, which may be
        considered conflict-affected.
      </div>
      {ranked.map((p, i) => (
        <PropertyCard
          key={p.id ?? i}
          property={p}
          index={i}
          recommended={p.recommended}
          recommendationReason={p.recommendationReason}
        />
      ))}
    </div>
  );
}
