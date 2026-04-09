import PropertyCard from "./PropertyCard";

import "./Results.css";

export default function Results({ properties }) {
  return (
    <div className="search-filter-results">
      <div className="search-filter-advisory">
        Please review any travel advisories provided by your government to make
        an informed decision about your stay in this area, which may be
        considered conflict-affected.
      </div>
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
