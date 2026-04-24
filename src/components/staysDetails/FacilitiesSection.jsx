import React from "react";
import "./FacilitiesSection.css";

const FacilityList = ({ items }) => (
  <ul className="facilities__list">
    {items.map((item, i) => (
      <li key={i} className="facilities__list-item">
        <span className="facilities__check">✓</span>
        <span>
          {typeof item === "string" ? item : item.name}
          {item.extra && <span className="facilities__extra">{item.extra}</span>}
        </span>
      </li>
    ))}
  </ul>
);

const categoryGroups = [
  { key: "bathroom", icon: "🚿", label: "Bathroom" },
  { key: "foodAndDrink", icon: "🍽️", label: "Food & Drink" },
  { key: "safety", icon: "🔒", label: "Safety & Security" },
  { key: "bedroom", icon: "🛏️", label: "Bedroom" },
  { key: "outdoors", icon: "🌿", label: "Outdoors" },
  { key: "kitchen", icon: "🍳", label: "Kitchen" },
  { key: "receptionServices", icon: "🛎️", label: "Reception Services" },
  { key: "familyFriendly", icon: "👨‍👩‍👧", label: "Family Friendly" },
  { key: "general", icon: "ℹ️", label: "General" },
  { key: "wellness", icon: "🧘", label: "Wellness" },
  { key: "cleaning", icon: "🧹", label: "Cleaning Services" },
  { key: "business", icon: "💼", label: "Business Facilities" },
  { key: "languages", icon: "🌐", label: "Languages" },
];

const FacilitiesSection = ({ facilities, popularFacilities = [], amenities = [] }) => {
  const hasCategories = categoryGroups.some(
    ({ key }) => Array.isArray(facilities?.[key]) && facilities[key].length > 0,
  );

  const displayPopular =
    Array.isArray(popularFacilities) && popularFacilities.length > 0
      ? popularFacilities
      : Array.isArray(amenities) && amenities.length > 0
        ? amenities.slice(0, 9)
        : [];

  return (
    <section className="facilities">
      <div className="facilities__header">
        <div>
          <h2 className="facilities__title">Facilities</h2>
        </div>
        <button className="facilities__availability-btn">See availability</button>
      </div>

      {displayPopular.length > 0 && (
        <div className="facilities__popular">
          <h3 className="facilities__group-title">Most popular facilities</h3>
          <div className="facilities__popular-tags">
            {displayPopular.map((f) => (
              <span key={f} className="facilities__popular-tag">
                ✓ {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasCategories ? (
        <div className="facilities__grid">
          {categoryGroups.map(({ key, icon, label }) => {
            const items = facilities?.[key];
            if (!Array.isArray(items) || items.length === 0) return null;
            return (
              <div key={key} className="facilities__group">
                <h4 className="facilities__group-title">
                  {icon} {label}
                </h4>
                <FacilityList items={items} />
              </div>
            );
          })}
          {facilities?.internet && (
            <div className="facilities__group">
              <h4 className="facilities__group-title">📶 Internet</h4>
              <p className="facilities__text">{facilities.internet}</p>
            </div>
          )}
          {facilities?.parking && (
            <div className="facilities__group">
              <h4 className="facilities__group-title">🅿️ Parking</h4>
              <p className="facilities__text">{facilities.parking}</p>
            </div>
          )}
        </div>
      ) : amenities.length > 0 ? (
        <div className="facilities__grid">
          <div className="facilities__group" style={{ gridColumn: "1 / -1" }}>
            <h4 className="facilities__group-title">✅ All Amenities</h4>
            <FacilityList items={amenities} />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default FacilitiesSection;
