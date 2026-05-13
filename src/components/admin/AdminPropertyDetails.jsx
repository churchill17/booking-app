import React from "react";
import "./AdminPropertyPage.css";
import "./AdminPropertyDetails.css";
import { useParams, useNavigate } from "react-router-dom";

const Pill = ({ children, variant = "teal" }) => (
  <span className={`admin-pd-pill admin-pd-pill--${variant}`}>{children}</span>
);

/** Recursively unwrap multi-serialised JSON until we have plain strings. */
function toStringArr(v, depth = 0) {
  if (!v || depth > 8) return [];
  if (Array.isArray(v)) {
    const items = [];
    for (const item of v) {
      if (typeof item !== "string") continue;
      const t = item.trim();
      if (t.startsWith("[") || t.startsWith('"')) {
        try {
          items.push(...toStringArr(JSON.parse(t), depth + 1));
          continue;
        } catch { /* treat as plain string */ }
      }
      if (t) items.push(item);
    }
    return [...new Set(items)];
  }
  if (typeof v === "string") {
    const t = v.trim();
    if (t.startsWith("[") || t.startsWith('"')) {
      try { return toStringArr(JSON.parse(t), depth + 1); } catch { /* fall through */ }
    }
    return t ? t.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }
  return [];
}

const AdminPillList = ({ items, variant = "teal" }) => {
  const arr = toStringArr(items);
  if (!arr.length) return null;
  return (
    <div className="admin-pd-pill-list">
      {arr.map((item, i) => (
        <Pill key={item + i} variant={variant}>
          {item}
        </Pill>
      ))}
    </div>
  );
};

const AdminSection = ({ title, icon, children }) => (
  <div className="admin-pd-section">
    <div className="admin-pd-section__header">
      {icon && <span className="admin-pd-section__icon">{icon}</span>}
      <h2 className="admin-pd-section__title">{title}</h2>
    </div>
    {children}
  </div>
);

const AdminStatBadge = ({ icon, label, value }) => (
  <div className="admin-pd-stat-badge">
    <span className="admin-pd-stat-badge__icon">{icon}</span>
    <span className="admin-pd-stat-badge__value">{value}</span>
    <span className="admin-pd-stat-badge__label">{label}</span>
  </div>
);

const AdminRuleCard = ({ color, bg, border, label, value }) => (
  <div className="admin-pd-rule-card" style={{ background: bg, border }}>
    <div className="admin-pd-rule-card__label" style={{ color }}>
      {label}
    </div>
    <div className="admin-pd-rule-card__value">{value}</div>
  </div>
);

export default function AdminPropertyDetails({ listings = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = listings.find((item) => String(item.id) === String(id));

  console.log("[DEBUG] AdminPropertyDetails property:", property);

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
    <div className="admin-pd-page">
      <button
        className="admin-btn-back"
        style={{ marginBottom: 18 }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Hero */}
      <div className="admin-pd-hero">
        {heroImage && (
          <img
            src={heroImage}
            alt={property.propertyName}
            className="admin-pd-hero__img"
          />
        )}
        <div className="admin-pd-hero__overlay" />
        <div className="admin-pd-hero__content">
          <div className="admin-pd-hero__badges">
            {property.type && (
              <span className="admin-pd-hero__badge admin-pd-hero__badge--type">
                {property.type}
              </span>
            )}
            {property.status && (
              <span
                className="admin-pd-hero__badge"
                style={{
                  background:
                    property.status === "Approved" ? "#0a8c6b" : "#c97d10",
                }}
              >
                {property.status}
              </span>
            )}
          </div>
          <h1 className="admin-pd-hero__title">{property.propertyName}</h1>
          <div className="admin-pd-hero__location">
            📍{" "}
            {[property.address, property.city, property.country]
              .filter(Boolean)
              .join(", ")}
          </div>
        </div>
      </div>

      {/* Image gallery strip */}
      {galleryImages.length > 0 && (
        <div className="admin-pd-gallery">
          {galleryImages.map((img, i) => (
            <img
              key={img + i}
              src={img}
              alt="Property"
              className="admin-pd-gallery__img"
            />
          ))}
        </div>
      )}

      {/* Stats bar */}
      <div className="admin-pd-stats-bar">
        <AdminStatBadge
          icon="⭐"
          label="Rating"
          value={`${property.avgRating ?? "—"}/5`}
        />
        <AdminStatBadge
          icon="💬"
          label="Reviews"
          value={property.totalReviews ?? "—"}
        />
        <AdminStatBadge
          icon="📋"
          label="Bookings"
          value={property.totalBookings ?? "—"}
        />
        <div className="admin-pd-stats-bar__price-wrap">
          <div className="admin-pd-stats-bar__price">
            <div className="admin-pd-stats-bar__price-value">
              {property.currency || "NGN"}{" "}
              {property.currentPrice || property.originalPrice || "—"}
            </div>
            {property.currentPrice && property.originalPrice && property.currentPrice !== property.originalPrice && (
              <div className="admin-pd-stats-bar__price-original" style={{ textDecoration: "line-through", fontSize: 13, opacity: 0.6 }}>
                {property.currency || "NGN"} {property.originalPrice}
              </div>
            )}
            <div className="admin-pd-stats-bar__price-type">
              {(property.pricingType || "per night").replace("_", " ")}
            </div>
            {property.weekendRate && (
              <div className="admin-pd-stats-bar__weekend">
                Weekend: {property.currency || "NGN"} {property.weekendRate}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="admin-pd-main-card">
        {/* Check-in / Check-out / Policies */}
        {(property.checkInFrom ||
          property.checkOutFrom ||
          typeof property.smokingAllowed !== "undefined" ||
          typeof property.lastMinuteBookings !== "undefined") && (
          <div className="admin-pd-policies">
            {property.checkInFrom && (
              <div className="admin-pd-policy-item admin-pd-policy-item--checkin">
                <div className="admin-pd-policy-item__label">Check-in</div>
                <div className="admin-pd-policy-item__value">
                  {property.checkInFrom} – {property.checkInUntil}
                </div>
              </div>
            )}
            {property.checkOutFrom && (
              <div className="admin-pd-policy-item admin-pd-policy-item--checkout">
                <div className="admin-pd-policy-item__label">Check-out</div>
                <div className="admin-pd-policy-item__value">
                  {property.checkOutFrom} – {property.checkOutUntil}
                </div>
              </div>
            )}
            {typeof property.smokingAllowed !== "undefined" && (
              <div className="admin-pd-policy-item">
                <div className="admin-pd-policy-item__label">Smoking</div>
                <div
                  className="admin-pd-policy-item__value"
                  style={{
                    color: property.smokingAllowed ? "#0a8c6b" : "#dc2626",
                  }}
                >
                  {property.smokingAllowed ? "✓ Allowed" : "✗ Not Allowed"}
                </div>
              </div>
            )}
            {typeof property.lastMinuteBookings !== "undefined" && (
              <div className="admin-pd-policy-item admin-pd-policy-item--lastminute">
                <div className="admin-pd-policy-item__label">Last Minute</div>
                <div
                  className="admin-pd-policy-item__value"
                  style={{
                    color: property.lastMinuteBookings ? "#0a8c6b" : "#dc2626",
                  }}
                >
                  {property.lastMinuteBookings ? "✓ Allowed" : "✗ Not Allowed"}
                </div>
              </div>
            )}
            {typeof property.excludeInfants !== "undefined" && (
              <div className="admin-pd-policy-item">
                <div className="admin-pd-policy-item__label">Infants</div>
                <div className="admin-pd-policy-item__value">
                  {property.excludeInfants ? "Excluded" : "Welcome"}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Popular Facilities */}
        {property.popularFacilities?.length > 0 && (
          <AdminSection title="Popular Facilities" icon="🏊">
            <AdminPillList items={property.popularFacilities} variant="teal" />
          </AdminSection>
        )}

        {/* Accommodations */}
        {property.accommodations && (
          <AdminSection title="Accommodations" icon="🛏️">
            <AdminPillList items={property.accommodations} variant="blue" />
          </AdminSection>
        )}

        {/* Dining */}
        {property.descriptionDining && (
          <AdminSection title="Dining" icon="🍽️">
            <AdminPillList items={property.descriptionDining} variant="amber" />
          </AdminSection>
        )}

        {/* Location */}
        {(property.locationDescription || property.location) && (
          <AdminSection title="Location Highlights" icon="📍">
            <AdminPillList
              items={property.locationDescription || property.location}
              variant="purple"
            />
          </AdminSection>
        )}

        {/* Facilities description */}
        {property.descriptionFacilities && (
          <AdminSection title="Facilities Overview" icon="✨">
            <AdminPillList items={property.descriptionFacilities} variant="pink" />
          </AdminSection>
        )}

        {/* Facilities object */}
        {property.facilities && Object.keys(property.facilities).length > 0 && (
          <AdminSection title="All Facilities" icon="🏢">
            <div className="admin-pd-facilities-list">
              {Object.entries(property.facilities).map(([group, items]) => (
                <div key={group}>
                  <div className="admin-pd-facility-group__label">
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </div>
                  <AdminPillList
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
          </AdminSection>
        )}

        {/* Rooms */}
        {property.rooms?.length > 0 && (
          <AdminSection title="Rooms" icon="🚪">
            <div className="admin-pd-rooms-list">
              {property.rooms.map((room, i) => (
                <div key={room.id || i} className="admin-pd-room-card">
                  <div className="admin-pd-room-card__header">
                    <div className="admin-pd-room-card__name">
                      {room.name || `Room ${i + 1}`}
                    </div>
                    <div className="admin-pd-room-card__badges">
                      {room.bedType && (
                        <AdminPill variant="blue">🛏 {room.bedType}</AdminPill>
                      )}
                      {room.guests && (
                        <AdminPill variant="teal">👥 {room.guests} guests</AdminPill>
                      )}
                      {room.availability && (
                        <AdminPill variant="green">📅 {room.availability}</AdminPill>
                      )}
                    </div>
                  </div>
                  {(room.size ||
                    room.originalPrice ||
                    room.currentPrice ||
                    room.discount ||
                    room.deal) && (
                    <div className="admin-pd-room-card__meta">
                      {room.size && (
                        <span className="admin-pd-room-card__size">
                          📐 {room.size}
                        </span>
                      )}
                      {(room.originalPrice || room.currentPrice) && (
                        <span>
                          {room.originalPrice && room.originalPrice !== room.currentPrice && (
                            <span className="admin-pd-room-card__price-original">
                              {property.currency || "NGN"}{" "}
                              {Number(room.originalPrice).toLocaleString()}
                            </span>
                          )}
                          {room.currentPrice && (
                            <span className="admin-pd-room-card__price-current">
                              {property.currency || "NGN"}{" "}
                              {Number(room.currentPrice).toLocaleString()}
                            </span>
                          )}
                        </span>
                      )}
                      {room.discount && (
                        <AdminPill variant="amber">🏷️ {room.discount}</AdminPill>
                      )}
                      {room.deal && <AdminPill variant="teal">⚡ {room.deal}</AdminPill>}
                    </div>
                  )}
                  {room.features?.length > 0 && (
                    <div className="admin-pd-room-card__sub-section">
                      <div className="admin-pd-room-card__sub-label">Features</div>
                      <AdminPillList items={room.features} variant="teal" />
                    </div>
                  )}
                  {room.amenities?.length > 0 && (
                    <div className="admin-pd-room-card__sub-section">
                      <div className="admin-pd-room-card__sub-label">Amenities</div>
                      <AdminPillList items={room.amenities} variant="blue" />
                    </div>
                  )}
                  {room.choices?.length > 0 && (
                    <div className="admin-pd-room-card__sub-section">
                      <div className="admin-pd-room-card__sub-label">Choices</div>
                      <AdminPillList items={room.choices} variant="gray" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AdminSection>
        )}

        {/* Highlights */}
        {property.highlights?.length > 0 && (
          <AdminSection title="Highlights" icon="✨">
            <div className="admin-pd-highlights-list">
              {property.highlights.map((h, i) => (
                <div key={h.text + i} className="admin-pd-highlight-item">
                  {h.icon && (
                    <span className="admin-pd-highlight-icon">{h.icon}</span>
                  )}
                  <span className="admin-pd-highlight-text">{h.text}</span>
                </div>
              ))}
            </div>
          </AdminSection>
        )}

        {/* FAQs */}
        {property.faqs?.length > 0 && (
          <AdminSection title="FAQs" icon="💬">
            <div className="admin-pd-faqs-list">
              {property.faqs.map((faq, i) => (
                <div key={faq.question + i} className="admin-pd-faq-item">
                  <div className="admin-pd-faq-question">{faq.question}</div>
                  <div className="admin-pd-faq-answer">{faq.answer}</div>
                </div>
              ))}
            </div>
          </AdminSection>
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
          <AdminSection title="House Rules" icon="📜">
            <div className="admin-pd-rules-grid">
              {property.cancellation && (
                <AdminRuleCard
                  bg="#fff7ed"
                  border="1px solid #fed7aa"
                  color="#9a3412"
                  label="Cancellation"
                  value={property.cancellation}
                />
              )}
              {property.childrenPolicy && (
                <AdminRuleCard
                  bg="#f0f9ff"
                  border="1px solid #bae6fd"
                  color="#0369a1"
                  label="Children"
                  value={property.childrenPolicy}
                />
              )}
              {property.petsPolicy && (
                <AdminRuleCard
                  bg="#fdf4ff"
                  border="1px solid #e9d5ff"
                  color="#7e22ce"
                  label="Pets"
                  value={property.petsPolicy}
                />
              )}
              {property.cotPolicy && (
                <AdminRuleCard
                  bg="#f0fdf4"
                  border="1px solid #bbf7d0"
                  color="#15803d"
                  label="Cot Policy"
                  value={property.cotPolicy}
                />
              )}
              {property.ageRestriction && (
                <AdminRuleCard
                  bg="#fff1f2"
                  border="1px solid #fecdd3"
                  color="#be123c"
                  label="Age Restriction"
                  value={property.ageRestriction}
                />
              )}
              {property.parties && (
                <AdminRuleCard
                  bg="#fff8e1"
                  border="1px solid #fde68a"
                  color="#92400e"
                  label="Parties"
                  value={property.parties}
                />
              )}
            </div>
            {property.paymentMethods?.length > 0 && (
              <div className="admin-pd-rules-payment">
                <div className="admin-pd-rules-payment-label">Payment Methods</div>
                <AdminPillList items={property.paymentMethods} variant="teal" />
              </div>
            )}
            {property.finePrint && (
              <div className="admin-pd-rules-fineprint">
                <b>Fine Print: </b>
                {property.finePrint}
              </div>
            )}
          </AdminSection>
        )}

        {/* About Property */}
        {property.raw?.aboutProperty && (
          <AdminSection title="About This Property" icon="ℹ️">
            <div className="admin-pd-about-text">{property.raw.aboutProperty}</div>
          </AdminSection>
        )}

        {/* Pricing Details */}
        {(property.cleaningFee ||
          typeof property.taxesIncluded !== "undefined") && (
          <AdminSection title="Pricing Details" icon="💰">
            <div className="admin-pd-pricing-list">
              {property.cleaningFee && (
                <div className="admin-pd-pricing-item">
                  <div className="admin-pd-pricing-item__label">Cleaning Fee</div>
                  <div className="admin-pd-pricing-item__value">
                    {property.currency || "NGN"} {property.cleaningFee}
                  </div>
                </div>
              )}
              {typeof property.taxesIncluded !== "undefined" && (
                <div className="admin-pd-pricing-item">
                  <div className="admin-pd-pricing-item__label">Taxes</div>
                  <div
                    className="admin-pd-pricing-item__value"
                    style={{
                      color: property.taxesIncluded ? "#0a8c6b" : "#dc2626",
                    }}
                  >
                    {property.taxesIncluded ? "Included" : "Not Included"}
                  </div>
                </div>
              )}
            </div>
          </AdminSection>
        )}

        {/* Host info */}
        {(property.firstName || property.email || property.phone) && (
          <AdminSection title="Host Information" icon="👤">
            <div className="admin-pd-host-card">
              <div className="admin-pd-host-avatar">
                {(property.firstName || property.email || "H")[0].toUpperCase()}
              </div>
              <div className="admin-pd-host-info">
                <div className="admin-pd-host-name">
                  {[property.firstName, property.middleName, property.lastName]
                    .filter(Boolean)
                    .join(" ") || "Host"}
                </div>
                {property.email && (
                  <div className="admin-pd-host-contact">✉️ {property.email}</div>
                )}
                {property.phone && (
                  <div className="admin-pd-host-contact">📞 {property.phone}</div>
                )}
                {property.addressLine1 && (
                  <div className="admin-pd-host-contact">
                    🏠 {property.addressLine1}
                    {property.addressLine2 ? `, ${property.addressLine2}` : ""}
                  </div>
                )}
                {property.city && (
                  <div className="admin-pd-host-contact">🌆 {property.city}</div>
                )}
                {property.zipCode && (
                  <div className="admin-pd-host-contact">️ {property.zipCode}</div>
                )}
                {property.country && (
                  <div className="admin-pd-host-contact">🌆 {property.country}</div>
                )}
                {property.informationCertified && (
                  <div className="admin-pd-host-contact">
                   ️ {property.informationCertified}
                  </div>
                )}
                {property.informationCertified && (
                  <div className="admin-pd-host-contact">
                   ️ {property.informationCertified}
                  </div>
                )}
              </div>
            </div>
          </AdminSection>
        )}

        {/* Address extras */}
        {(property.raw?.zipCode || property.raw?.apartment) && (
          <div className="admin-pd-address-extras">
            {property.raw.apartment && (
              <div className="admin-pd-address-tag">
                <b>Apartment:</b> {property.raw.apartment}
              </div>
            )}
            {property.raw.zipCode && (
              <div className="admin-pd-address-tag">
                <b>Zip Code:</b> {property.raw.zipCode}
              </div>
            )}
          </div>
        )}

        <div className="admin-pd-footer">
          Listed{" "}
          {property.createdAt
            ? new Date(property.createdAt).toLocaleDateString("en-GB")
            : "—"}
        </div>
      </div>
    </div>
  );
}
