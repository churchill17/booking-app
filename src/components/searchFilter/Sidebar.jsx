// components/Sidebar.jsx
import { useState, useEffect, useRef } from "react";
import CollapsibleSection from "./CollapsibleSection";
import CheckList from "./CheckList";
import Stepper from "./Stepper";
import PopularFiltersSticky from "./PopularFiltersSticky";

import "./Sidebar.css";

export default function Sidebar({
  state,
  dispatch,
  mobileOpen,
  onMobileClose,
}) {
  const scrollSentinelRef = useRef(null);
  const [showStickyPopular, setShowStickyPopular] = useState(false);

  useEffect(() => {
    const sentinel = scrollSentinelRef.current;
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowStickyPopular(!entry.isIntersecting),
      { root: null, threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const toggle = (key, val) => dispatch({ type: "TOGGLE_ARRAY", key, val });

  return (
    <>
      <div
        className={`search-filter-sidebar ${mobileOpen ? "mobile-open" : ""}`}
      >
        <button className="search-filter-mobile-close" onClick={onMobileClose}>
          ✕ Close Filters
        </button>

        <div ref={scrollSentinelRef}>
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
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Your budget (per night)">
            <div className="search-filter-budget-range">
              <span>NGN {(state.budgetMin ?? 0).toLocaleString()}</span>
              <span>
                NGN{" "}
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
            />
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Review score">
            <CheckList
              items={state.reviewScores}
              checked={state.reviewScores}
              onToggle={(val) => toggle("reviewScores", val)}
            />
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Property type">
            <CheckList
              items={state.propertyTypes}
              checked={state.propertyTypes}
              onToggle={(val) => toggle("propertyTypes", val)}
            />
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Bed Types" defaultOpen={false}>
            <CheckList
              items={state.bedTypes}
              checked={state.bedTypes}
              onToggle={(val) => toggle("bedTypes", val)}
            />
          </CollapsibleSection>
        </div>

        <div className="search-filter-filter-card">
          <CollapsibleSection title="Facilities" defaultOpen={false}>
            <CheckList
              items={state.facilities}
              checked={state.facilities}
              onToggle={(val) => toggle("facilities", val)}
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

        <div
          className="search-filter-sticky-popular"
          style={{ display: showStickyPopular ? "block" : "none" }}
        >
          <PopularFiltersSticky
            filters={state.popularFilters}
            activeChips={state.chips}
            onToggle={(val) => toggle("chips", val)}
          />
        </div>
      </div>
    </>
  );
}
