import React from "react";
import "./FacilitiesSection.css";

const FacilitiesSection = ({ popularFacilities = [], amenities = [] }) => {
  const items =
    Array.isArray(popularFacilities) && popularFacilities.length > 0
      ? popularFacilities
      : Array.isArray(amenities) && amenities.length > 0
        ? amenities
        : [];

  if (!items.length) return null;

  return (
    <section className="facilities">
      <h2 className="facilities__title">Popular Facilities</h2>
      <div className="facilities__popular-tags">
        {items.map((f) => (
          <span key={f} className="facilities__popular-tag">
            ✓ {f}
          </span>
        ))}
      </div>
    </section>
  );
};

export default FacilitiesSection;
