import { useMemo, useState } from "react";
import { TRAVEL_TABS } from "../../data";
import "./Travel.css";

export default function Travel() {
  const [selectedTab, setSelectedTab] = useState(TRAVEL_TABS[0].id);

  const activeTab = useMemo(
    () => TRAVEL_TABS.find((tab) => tab.id === selectedTab) ?? TRAVEL_TABS[0],
    [selectedTab],
  );

  return (
    <section className="travel-section">
      <h2>Frequently booked by travelers from Nigeria</h2>
      <div
        className="travel-tabs"
        role="tablist"
        aria-label="Travel categories"
      >
        {TRAVEL_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selectedTab === tab.id}
            className={`travel-tab-btn ${selectedTab === tab.id ? "travel-tab-btn-active" : ""}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="travel-content" role="tabpanel">
        {activeTab.columns.map((column, index) => (
          <div key={`${activeTab.id}-${index}`} className="travel-column">
            {column.map((item) => (
              <p key={item} className="travel-item">
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
