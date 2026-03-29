import React from "react";
import "./PropertyOverview.css";

const PropertyOverview = ({ description, highlights, popularFacilities, coupleLocationScore }) => {
  return (
    <section className="property-overview">
      <div className="property-overview__main">
        <h2 className="property-overview__section-title">About this property</h2>

        <div className="property-overview__desc">
          <p>
            <strong>Comfortable Accommodations:</strong> {description.accommodations}
          </p>
          <p>
            <strong>Convenient Facilities:</strong> {description.facilities}
          </p>
          <p>
            <strong>Dining Experience:</strong> {description.dining}
          </p>
          <p>
            <strong>Prime Location:</strong> {description.location}
          </p>
          <p className="property-overview__couple-note">
            Couples particularly like the location — they rated it{" "}
            <strong>{coupleLocationScore}</strong> for a two-person trip.
          </p>
        </div>

        <div className="property-overview__facilities">
          <h3 className="property-overview__sub-title">Most popular facilities</h3>
          <div className="property-overview__facility-tags">
            {popularFacilities.map((f) => (
              <span key={f} className="property-overview__tag">
                ✓ {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      <aside className="property-overview__highlights">
        <h3 className="property-overview__sub-title">Property highlights</h3>
        <p className="property-overview__perfect">Perfect for a 1-night stay!</p>
        {highlights.map((h, i) => (
          <div key={i} className="property-overview__highlight-item">
            <span className="property-overview__highlight-icon">{h.icon}</span>
            <span>{h.text}</span>
          </div>
        ))}

        <div className="property-overview__cta-box">
          <button className="btn-reserve-full">Reserve</button>
          <button className="btn-save-full">♡ Save the property</button>
        </div>
      </aside>
    </section>
  );
};

export default PropertyOverview;
