export default function Stepper({ label, value, onChange }) {
  return (
    <>
      <div className="search-filter-stepper-row">
        <span className="search-filter-stepper-label">{label}</span>
        <div className="search-filter-stepper">
          <button
            className="search-filter-step-btn"
            onClick={() => onChange(Math.max(0, value - 1))}
          >
            −
          </button>
          <span className="search-filter-step-val">{value}</span>
          <button
            className="search-filter-step-btn"
            onClick={() => onChange(value + 1)}
          >
            +
          </button>
        </div>
      </div>
    </>
  );
}
