import "./CheckList.css";

export default function CheckList({ items, checked, onToggle }) {
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <div className="search-filter-check-list">
      {safeItems.map((item) => (
        <label
          key={item.label}
          className="search-filter-check-row"
          onClick={() => onToggle(item.label)}
        >
          <div className="search-filter-check-left">
            <div
              className={`search-filter-check-box ${checked?.includes(item.label) ? "checked" : ""}`}
            />
            <span className="search-filter-check-label">{item.label}</span>
          </div>
          <span className="search-filter-check-count">
            {(item.count ?? 0).toLocaleString()}
          </span>
        </label>
      ))}
    </div>
  );
}
