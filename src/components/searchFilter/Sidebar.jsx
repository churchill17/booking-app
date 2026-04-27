// components/Sidebar.jsx
import CollapsibleSection from "./CollapsibleSection";
import CheckList from "./CheckList";
import Stepper from "./Stepper";

import "./Sidebar.css";

export default function Sidebar({
  state,
  dispatch,
  mobileOpen,
  onMobileClose,
}) {

  const toggle = (key, val) => dispatch({ type: "TOGGLE_ARRAY", key, val });

  return (
    <>
      <div
        className={`search-filter-sidebar ${mobileOpen ? "mobile-open" : ""}`}
      >
        <button className="search-filter-mobile-close" onClick={onMobileClose}>
          ✕ Close Filters
        </button>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Popular filters">
            <div className="search-filter-popular-chips">
              {(Array.isArray(state.popularFilters)
                ? state.popularFilters
                : []
              ).map((f) => (
                <button
                  key={f.label}
                  className={`search-filter-chip ${state.chips?.includes(f.label) ? "active" : ""}`}
                  onClick={() => toggle("chips", f.label)}
                >
                  {f.label}{" "}
                  <span className="search-filter-chip-count">
                    (
                    {typeof f.count === "number" && f.count != null
                      ? f.count.toLocaleString()
                      : "0"}
                    )
                  </span>
                </button>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Your budget (per night)">
            <div className="search-filter-budget-range">
              <span>
                {state.currency} {(state.budgetMin ?? 0).toLocaleString()}
              </span>
              <span>
                {state.currency}{" "}
                {Number(state.budgetMax) >= 300000
                  ? "300,000+"
                  : (state.budgetMax ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="search-filter-budget-hist">
              {(state.histHeights || []).map((h, i) => (
                <div
                  key={i}
                  className={`search-filter-hist-bar ${i > 3 && i < 11 ? "active" : ""}`}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <input
              type="range"
              className="search-filter-slider"
              min={0}
              max={300000}
              step={1000}
              value={state.budgetMax}
              onChange={(e) =>
                dispatch({
                  type: "SET",
                  key: "budgetMax",
                  val: +e.target.value,
                })
              }
              style={{ width: "100%", marginBottom: 8 }}
            />
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Review score">
            <CheckList
              items={state.reviewScores}
              checked={state.checkedReviewScores}
              onToggle={(val) => toggle("checkedReviewScores", val)}
            />
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Property type">
            <CheckList
              items={state.propertyTypes}
              checked={state.checkedPropertyTypes}
              onToggle={(val) => toggle("checkedPropertyTypes", val)}
            />
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Bed Types" defaultOpen={false}>
            <CheckList
              items={state.bedTypes}
              checked={state.checkedBedTypes}
              onToggle={(val) => toggle("checkedBedTypes", val)}
            />
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Facilities" defaultOpen={false}>
            <CheckList
              items={state.facilities}
              checked={state.checkedFacilities}
              onToggle={(val) => toggle("checkedFacilities", val)}
            />
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Property rating" defaultOpen={false}>
            <div className="search-filter-star-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  className={`search-filter-star-btn ${state.stars === s ? "active" : ""}`}
                  onClick={() =>
                    dispatch({
                      type: "SET",
                      key: "stars",
                      val: state.stars === s ? 0 : s,
                    })
                  }
                >
                  {"★".repeat(s)}
                </button>
              ))}
            </div>
          </CollapsibleSection>
        </div>

      </div>
    </>
  );
}
