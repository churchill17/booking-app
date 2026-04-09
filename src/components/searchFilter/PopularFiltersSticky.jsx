import "./PopularFiltersSticky.css";

export default function PopularFiltersSticky({
  filters = [],
  activeChips = [],
  onToggle,
}) {
  return (
    <div
      className="search-filter-filter-card"
      style={{
        background: "var(--search-filter-midnightBlue)",
        border: "none",
      }}
    >
      <div
        className="search-filter-filter-section-title"
        style={{
          color: "var(--search-filter-lightBeige)",
          borderBottomColor: "rgba(255,255,255,0.12)",
        }}
      >
        Popular filters
      </div>
      <div className="search-filter-popular-chips">
        {(Array.isArray(filters) ? filters : []).map((f) => (
          <button
            key={f.label}
            className={`search-filter-chip ${activeChips.includes(f.label) ? "active" : ""}`}
            onClick={() => onToggle(f.label)}
            style={
              !activeChips.includes(f.label)
                ? {
                    background: "rgba(255,255,255,0.08)",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    color: "var(--search-filter-lightBeige)",
                  }
                : {}
            }
          >
            {f.label}{" "}
            <span className="search-filter-chip-count">
              ({f.count?.toLocaleString?.() || 0})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
