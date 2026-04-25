import React from "react";
import "./PropertyPage.css";
import "./PropertyDetails.css";
import { useParams, useNavigate } from "react-router-dom";

const Pill = ({ children, variant = "teal" }) => (
  <span className={`pd-pill pd-pill--${variant}`}>{children}</span>
);

const PillList = ({ items, variant = "teal" }) => {
  const arr = Array.isArray(items)
    ? items
    : typeof items === "string"
      ? items
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  if (!arr.length) return null;
  return (
    <div className="pd-pill-list">
      {arr.map((item, i) => (
        <Pill key={item + i} variant={variant}>
          {item}
        </Pill>
      ))}
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="pd-section">
    <div className="pd-section__header">
      {icon && <span className="pd-section__icon">{icon}</span>}
      <h2 className="pd-section__title">{title}</h2>
    </div>
    {children}
  </div>
);

const StatBadge = ({ icon, label, value }) => (
  <div className="pd-stat-badge">
    <span className="pd-stat-badge__icon">{icon}</span>
    <span className="pd-stat-badge__value">{value}</span>
    <span className="pd-stat-badge__label">{label}</span>
  </div>
);

const RuleCard = ({ color, bg, border, label, value }) => (
  <div className="pd-rule-card" style={{ background: bg, border }}>
    <div className="pd-rule-card__label" style={{ color }}>
      {label}
    </div>
    <div className="pd-rule-card__value">{value}</div>
  </div>
);

export default function PropertyDetails({ listings = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = listings.find((item) => String(item.id) === String(id));

  console.log("[DEBUG] PropertyDetails property:", property);

  if (!property) {
    return <div className="empty-state">Property not found.</div>;
  }

  const images = [
    ...(property.photos?.length > 0 ? property.photos : []),
    ...(property.images?.length > 0
      ? property.images.map((img) => img.image_url || img)
      : []),
    property.mainImage,
  ].filter(Boolean);

  const heroImage = images[0];
  const galleryImages = images.slice(1, 5);

  return (
    <div className="pd-page">
      <button
        className="btn-back"
        style={{ marginBottom: 18 }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Hero */}
      <div className="pd-hero">
        {heroImage && (
          <img
            src={heroImage}
            alt={property.propertyName}
            className="pd-hero__img"
          />
        )}
        <div className="pd-hero__overlay" />
        <div className="pd-hero__content">
          <div className="pd-hero__badges">
            {property.type && (
              <span className="pd-hero__badge pd-hero__badge--type">
                {property.type}
              </span>
            )}
            {property.status && (
              <span
                className="pd-hero__badge"
                style={{
                  background:
                    property.status === "Approved" ? "#0a8c6b" : "#c97d10",
                }}
              >
                {property.status}
              </span>
            )}
          </div>
          <h1 className="pd-hero__title">{property.propertyName}</h1>
          <div className="pd-hero__location">
            📍{" "}
            {[property.address, property.city, property.country]
              .filter(Boolean)
              .join(", ")}
          </div>
        </div>
      </div>

      {/* Image gallery strip */}
      {galleryImages.length > 0 && (
        <div className="pd-gallery">
          {galleryImages.map((img, i) => (
            <img
              key={img + i}
              src={img}
              alt="Property"
              className="pd-gallery__img"
            />
          ))}
        </div>
      )}

      {/* Stats bar */}
      <div className="pd-stats-bar">
        <StatBadge
          icon="⭐"
          label="Rating"
          value={`${property.avgRating ?? "—"}/5`}
        />
        <StatBadge
          icon="💬"
          label="Reviews"
          value={property.totalReviews ?? "—"}
        />
        <StatBadge
          icon="📋"
          label="Bookings"
          value={property.totalBookings ?? "—"}
        />
        <div className="pd-stats-bar__price-wrap">
          <div className="pd-stats-bar__price">
            <div className="pd-stats-bar__price-value">
              {property.currency || "NGN"}{" "}
              {property.originalPrice || property.currentPrice || "—"}
            </div>
            <div className="pd-stats-bar__price-type">
              {property.pricingType || "per night"}
            </div>
            {property.weekendRate && (
              <div className="pd-stats-bar__weekend">
                Weekend: {property.currency || "NGN"} {property.weekendRate}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="pd-main-card">
        {/* Check-in / Check-out / Policies */}
        {(property.checkInFrom ||
          property.checkOutFrom ||
          typeof property.smokingAllowed !== "undefined" ||
          typeof property.lastMinuteBookings !== "undefined") && (
          <div className="pd-policies">
            {property.checkInFrom && (
              <div className="pd-policy-item pd-policy-item--checkin">
                <div className="pd-policy-item__label">Check-in</div>
                <div className="pd-policy-item__value">
                  {property.checkInFrom} – {property.checkInUntil}
                </div>
              </div>
            )}
            {property.checkOutFrom && (
              <div className="pd-policy-item pd-policy-item--checkout">
                <div className="pd-policy-item__label">Check-out</div>
                <div className="pd-policy-item__value">
                  {property.checkOutFrom} – {property.checkOutUntil}
                </div>
              </div>
            )}
            {typeof property.smokingAllowed !== "undefined" && (
              <div className="pd-policy-item">
                <div className="pd-policy-item__label">Smoking</div>
                <div
                  className="pd-policy-item__value"
                  style={{
                    color: property.smokingAllowed ? "#0a8c6b" : "#dc2626",
                  }}
                >
                  {property.smokingAllowed ? "✓ Allowed" : "✗ Not Allowed"}
                </div>
              </div>
            )}
            {typeof property.lastMinuteBookings !== "undefined" && (
              <div className="pd-policy-item pd-policy-item--lastminute">
                <div className="pd-policy-item__label">Last Minute</div>
                <div
                  className="pd-policy-item__value"
                  style={{
                    color: property.lastMinuteBookings ? "#0a8c6b" : "#dc2626",
                  }}
                >
                  {property.lastMinuteBookings ? "✓ Allowed" : "✗ Not Allowed"}
                </div>
              </div>
            )}
            {typeof property.excludeInfants !== "undefined" && (
              <div className="pd-policy-item">
                <div className="pd-policy-item__label">Infants</div>
                <div className="pd-policy-item__value">
                  {property.excludeInfants ? "Excluded" : "Welcome"}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Popular Facilities */}
        {property.popularFacilities?.length > 0 && (
          <Section title="Popular Facilities" icon="🏊">
            <PillList items={property.popularFacilities} variant="teal" />
          </Section>
        )}

        {/* Accommodations */}
        {property.accommodations && (
          <Section title="Accommodations" icon="🛏️">
            <PillList items={property.accommodations} variant="blue" />
          </Section>
        )}

        {/* Dining */}
        {property.descriptionDining && (
          <Section title="Dining" icon="🍽️">
            <PillList items={property.descriptionDining} variant="amber" />
          </Section>
        )}

        {/* Location */}
        {(property.locationDescription || property.location) && (
          <Section title="Location Highlights" icon="📍">
            <PillList
              items={property.locationDescription || property.location}
              variant="purple"
            />
          </Section>
        )}

        {/* Facilities description */}
        {property.descriptionFacilities && (
          <Section title="Facilities Overview" icon="✨">
            <PillList items={property.descriptionFacilities} variant="pink" />
          </Section>
        )}

        {/* Facilities object */}
        {property.facilities && Object.keys(property.facilities).length > 0 && (
          <Section title="All Facilities" icon="🏢">
            <div className="pd-facilities-list">
              {Object.entries(property.facilities).map(([group, items]) => (
                <div key={group}>
                  <div className="pd-facility-group__label">
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </div>
                  <PillList
                    items={
                      Array.isArray(items)
                        ? items
                        : typeof items === "string"
                          ? [items]
                          : []
                    }
                    variant="gray"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Rooms */}
        {property.rooms?.length > 0 && (
          <Section title="Rooms" icon="🚪">
            <div className="pd-rooms-list">
              {property.rooms.map((room, i) => (
                <div key={room.id || i} className="pd-room-card">
                  <div className="pd-room-card__header">
                    <div className="pd-room-card__name">
                      {room.name || `Room ${i + 1}`}
                    </div>
                    <div className="pd-room-card__badges">
                      {room.bedType && (
                        <Pill variant="blue">🛏 {room.bedType}</Pill>
                      )}
                      {room.guests && (
                        <Pill variant="teal">👥 {room.guests} guests</Pill>
                      )}
                      {room.availability && (
                        <Pill variant="green">📅 {room.availability}</Pill>
                      )}
                    </div>
                  </div>
                  {(room.size ||
                    room.originalPrice ||
                    room.currentPrice ||
                    room.discount ||
                    room.deal) && (
                    <div className="pd-room-card__meta">
                      {room.size && (
                        <span className="pd-room-card__size">
                          📐 {room.size}
                        </span>
                      )}
                      {(room.originalPrice || room.currentPrice) && (
                        <span>
                          {room.originalPrice && room.originalPrice !== room.currentPrice && (
                            <span className="pd-room-card__price-original">
                              {property.currency || "NGN"}{" "}
                              {Number(room.originalPrice).toLocaleString()}
                            </span>
                          )}
                          {room.currentPrice && (
                            <span className="pd-room-card__price-current">
                              {property.currency || "NGN"}{" "}
                              {Number(room.currentPrice).toLocaleString()}
                            </span>
                          )}
                        </span>
                      )}
                      {room.discount && (
                        <Pill variant="amber">🏷️ {room.discount}</Pill>
                      )}
                      {room.deal && <Pill variant="teal">⚡ {room.deal}</Pill>}
                    </div>
                  )}
                  {room.features?.length > 0 && (
                    <div className="pd-room-card__sub-section">
                      <div className="pd-room-card__sub-label">Features</div>
                      <PillList items={room.features} variant="teal" />
                    </div>
                  )}
                  {room.amenities?.length > 0 && (
                    <div className="pd-room-card__sub-section">
                      <div className="pd-room-card__sub-label">Amenities</div>
                      <PillList items={room.amenities} variant="blue" />
                    </div>
                  )}
                  {room.choices?.length > 0 && (
                    <div className="pd-room-card__sub-section">
                      <div className="pd-room-card__sub-label">Choices</div>
                      <PillList items={room.choices} variant="gray" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Highlights */}
        {property.highlights?.length > 0 && (
          <Section title="Highlights" icon="✨">
            <div className="pd-highlights-list">
              {property.highlights.map((h, i) => (
                <div key={h.text + i} className="pd-highlight-item">
                  {h.icon && (
                    <span className="pd-highlight-icon">{h.icon}</span>
                  )}
                  <span className="pd-highlight-text">{h.text}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* FAQs */}
        {property.faqs?.length > 0 && (
          <Section title="FAQs" icon="💬">
            <div className="pd-faqs-list">
              {property.faqs.map((faq, i) => (
                <div key={faq.question + i} className="pd-faq-item">
                  <div className="pd-faq-question">{faq.question}</div>
                  <div className="pd-faq-answer">{faq.answer}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* House Rules */}
        {(property.cancellation ||
          property.childrenPolicy ||
          property.cotPolicy ||
          property.ageRestriction ||
          property.petsPolicy ||
          property.paymentMethods?.length ||
          property.parties ||
          property.finePrint) && (
          <Section title="House Rules" icon="📜">
            <div className="pd-rules-grid">
              {property.cancellation && (
                <RuleCard
                  bg="#fff7ed"
                  border="1px solid #fed7aa"
                  color="#9a3412"
                  label="Cancellation"
                  value={property.cancellation}
                />
              )}
              {property.childrenPolicy && (
                <RuleCard
                  bg="#f0f9ff"
                  border="1px solid #bae6fd"
                  color="#0369a1"
                  label="Children"
                  value={property.childrenPolicy}
                />
              )}
              {property.petsPolicy && (
                <RuleCard
                  bg="#fdf4ff"
                  border="1px solid #e9d5ff"
                  color="#7e22ce"
                  label="Pets"
                  value={property.petsPolicy}
                />
              )}
              {property.cotPolicy && (
                <RuleCard
                  bg="#f0fdf4"
                  border="1px solid #bbf7d0"
                  color="#15803d"
                  label="Cot Policy"
                  value={property.cotPolicy}
                />
              )}
              {property.ageRestriction && (
                <RuleCard
                  bg="#fff1f2"
                  border="1px solid #fecdd3"
                  color="#be123c"
                  label="Age Restriction"
                  value={property.ageRestriction}
                />
              )}
              {property.parties && (
                <RuleCard
                  bg="#fff8e1"
                  border="1px solid #fde68a"
                  color="#92400e"
                  label="Parties"
                  value={property.parties}
                />
              )}
            </div>
            {property.paymentMethods?.length > 0 && (
              <div className="pd-rules-payment">
                <div className="pd-rules-payment-label">Payment Methods</div>
                <PillList items={property.paymentMethods} variant="teal" />
              </div>
            )}
            {property.finePrint && (
              <div className="pd-rules-fineprint">
                <b>Fine Print: </b>
                {property.finePrint}
              </div>
            )}
          </Section>
        )}

        {/* About Property */}
        {property.raw?.aboutProperty && (
          <Section title="About This Property" icon="ℹ️">
            <div className="pd-about-text">{property.raw.aboutProperty}</div>
          </Section>
        )}

        {/* Pricing Details */}
        {(property.cleaningFee ||
          typeof property.taxesIncluded !== "undefined") && (
          <Section title="Pricing Details" icon="💰">
            <div className="pd-pricing-list">
              {property.cleaningFee && (
                <div className="pd-pricing-item">
                  <div className="pd-pricing-item__label">Cleaning Fee</div>
                  <div className="pd-pricing-item__value">
                    {property.currency || "NGN"} {property.cleaningFee}
                  </div>
                </div>
              )}
              {typeof property.taxesIncluded !== "undefined" && (
                <div className="pd-pricing-item">
                  <div className="pd-pricing-item__label">Taxes</div>
                  <div
                    className="pd-pricing-item__value"
                    style={{
                      color: property.taxesIncluded ? "#0a8c6b" : "#dc2626",
                    }}
                  >
                    {property.taxesIncluded ? "Included" : "Not Included"}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Host info */}
        {(property.firstName || property.email || property.phone) && (
          <Section title="Host Information" icon="👤">
            <div className="pd-host-card">
              <div className="pd-host-avatar">
                {(property.firstName || property.email || "H")[0].toUpperCase()}
              </div>
              <div className="pd-host-info">
                <div className="pd-host-name">
                  {[property.firstName, property.middleName, property.lastName]
                    .filter(Boolean)
                    .join(" ") || "Host"}
                </div>
                {property.email && (
                  <div className="pd-host-contact">✉️ {property.email}</div>
                )}
                {property.phone && (
                  <div className="pd-host-contact">📞 {property.phone}</div>
                )}
                {property.addressLine1 && (
                  <div className="pd-host-contact">
                    🏠 {property.addressLine1}
                    {property.addressLine2 ? `, ${property.addressLine2}` : ""}
                  </div>
                )}
                {property.city && (
                  <div className="pd-host-contact">🌆 {property.city}</div>
                )}
                {property.zipCode && (
                  <div className="pd-host-contact">�️ {property.zipCode}</div>
                )}
                {property.country && (
                  <div className="pd-host-contact">🌆 {property.country}</div>
                )}
                {property.informationCertified && (
                  <div className="pd-host-contact">
                    �️ {property.informationCertified}
                  </div>
                )}
                {property.informationCertified && (
                  <div className="pd-host-contact">
                    �️ {property.informationCertified}
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* Address extras */}
        {(property.raw?.zipCode || property.raw?.apartment) && (
          <div className="pd-address-extras">
            {property.raw.apartment && (
              <div className="pd-address-tag">
                <b>Apartment:</b> {property.raw.apartment}
              </div>
            )}
            {property.raw.zipCode && (
              <div className="pd-address-tag">
                <b>Zip Code:</b> {property.raw.zipCode}
              </div>
            )}
          </div>
        )}

        <div className="pd-footer">
          Listed{" "}
          {property.createdAt
            ? new Date(property.createdAt).toLocaleDateString("en-GB")
            : "—"}
        </div>
      </div>
    </div>
  );
}
