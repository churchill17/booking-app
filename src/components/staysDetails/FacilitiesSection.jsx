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

const FacilitiesSection = ({ facilities }) => {
  return (
    <section className="facilities">
      <div className="facilities__header">
        <div>
          <h2 className="facilities__title">Facilities</h2>
          <p className="facilities__subtitle">Great facilities! Review score: 8.4</p>
        </div>
        <button className="facilities__availability-btn">See availability</button>
      </div>

      <div className="facilities__popular">
        <h3 className="facilities__group-title">Most popular facilities</h3>
        <div className="facilities__popular-tags">
          {["Airport shuttle", "Free WiFi", "Non-smoking rooms", "Room service", "Free parking", "Family rooms", "Tea/coffee maker in all rooms", "Bar", "Breakfast"].map((f) => (
            <span key={f} className="facilities__popular-tag">✓ {f}</span>
          ))}
        </div>
      </div>

      <div className="facilities__grid">
        <div className="facilities__group">
          <h4 className="facilities__group-title">🚿 Bathroom</h4>
          <FacilityList items={facilities.bathroom} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🍽️ Food & Drink</h4>
          <FacilityList items={facilities.foodAndDrink} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🔒 Safety & Security</h4>
          <FacilityList items={facilities.safety} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🛏️ Bedroom</h4>
          <FacilityList items={facilities.bedroom} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🌿 Outdoors</h4>
          <FacilityList items={facilities.outdoors} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🍳 Kitchen</h4>
          <FacilityList items={facilities.kitchen} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">📶 Internet</h4>
          <p className="facilities__text">{facilities.internet}</p>
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🅿️ Parking</h4>
          <p className="facilities__text">{facilities.parking}</p>
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🛎️ Reception Services</h4>
          <FacilityList items={facilities.receptionServices} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">👨‍👩‍👧 Family Friendly</h4>
          <FacilityList items={facilities.familyFriendly} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">ℹ️ General</h4>
          <FacilityList items={facilities.general} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🧘 Wellness</h4>
          <FacilityList items={facilities.wellness} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🧹 Cleaning Services</h4>
          <FacilityList items={facilities.cleaning} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">💼 Business Facilities</h4>
          <FacilityList items={facilities.business} />
        </div>
        <div className="facilities__group">
          <h4 className="facilities__group-title">🌐 Languages</h4>
          <FacilityList items={facilities.languages} />
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
