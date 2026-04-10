import React from "react";
import "./PropertyPage.css";
import { useParams, useNavigate } from "react-router-dom";

// Helper for section titles (moved outside PropertyDetails)
const Section = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <h2
      style={{
        fontSize: 20,
        color: "#182435",
        marginBottom: 10,
        fontWeight: 700,
        letterSpacing: 0.2,
      }}
    >
      {title}
    </h2>
    <div>{children}</div>
  </div>
);

export default function PropertyDetails({ listings = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = listings.find((item) => String(item.id) === String(id));

  if (!property) {
    return <div className="empty-state">Property not found.</div>;
  }

  // Gather all images (mainImage, images, photos)
  const images = [
    ...(property.photos && property.photos.length > 0 ? property.photos : []),
    ...(property.images && property.images.length > 0
      ? property.images.map((img) => img.image_url || img)
      : []),
    property.mainImage,
  ].filter(Boolean);

  return (
    <div
      className="property-details-page"
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 8px 32px rgba(24,36,53,0.10)",
        padding: 32,
      }}
    >
      <button
        className="btn-back"
        style={{ marginBottom: 18 }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
        {/* Image Gallery */}
        <div style={{ flex: "0 0 340px", maxWidth: 360 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {images.length > 0 ? (
              images.map((img, i) =>
                img ? (
                  <img
                    key={img + "-" + i}
                    src={img}
                    alt="Property"
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      objectFit: "cover",
                      minHeight: 120,
                      maxHeight: 220,
                      boxShadow: "0 2px 12px rgba(24,36,53,0.08)",
                    }}
                  />
                ) : null,
              )
            ) : (
              <div
                style={{
                  background: "#eee",
                  borderRadius: 12,
                  minHeight: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                }}
              >
                No Image
              </div>
            )}
          </div>
          {/* Highlights removed from here; now only under FAQs */}
        </div>
        {/* Details */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1
            className="property-details-title"
            style={{ fontSize: 32, marginBottom: 8 }}
          >
            {property.propertyName}
          </h1>
          <div
            className="property-details-meta"
            style={{
              display: "flex",
              gap: 18,
              fontSize: 15,
              color: "#6b7280",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: property.status === "Approved" ? "#0a8c6b" : "#c97d10",
              }}
            >
              {property.status}
            </span>
            <span>
              Bookings: <b>{property.totalBookings}</b>
            </span>
            <span>
              Added: {new Date(property.createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div>
              <b>Type:</b> {property.type}
            </div>
            <div>
              <b>Price:</b> {property.currency || "NGN"}
              {property.price}{" "}
              <span style={{ color: "#888" }}>
                / {property.pricingType || "per night"}
              </span>
            </div>
            <div>
              <b>Rating:</b> {property.avgRating} / 5
            </div>
            <div>
              <b>Reviews:</b> {property.totalReviews}
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ marginBottom: 6 }}>
              <b>Address:</b> {property.address}, {property.city},{" "}
              {property.country}
            </div>
            {property.raw && property.raw.zipCode && (
              <div style={{ marginBottom: 6 }}>
                <b>Zip Code:</b> {property.raw.zipCode}
              </div>
            )}
            {property.raw && property.raw.apartment && (
              <div style={{ marginBottom: 6 }}>
                <b>Apartment:</b> {property.raw.apartment}
              </div>
            )}
          </div>
          {property.checkInFrom && property.checkInUntil && (
            <div>
              <b>Check-in:</b> From {property.checkInFrom} to{" "}
              {property.checkInUntil}
            </div>
          )}
          {property.checkOutFrom && property.checkOutUntil && (
            <div>
              <b>Check-out:</b> From {property.checkOutFrom} to{" "}
              {property.checkOutUntil}
            </div>
          )}

          {/* Additional Details */}
          {(property.weekendRate ||
            property.cleaningFee ||
            property.taxesIncluded ||
            property.accommodations ||
            property.descriptionFacilities ||
            property.descriptionDining ||
            property.locationDescription) && (
            <div
            >
              {property.weekendRate && (
                <div>
                  <b>Weekend Rate:</b> {property.currency || "NGN"}
                  {property.weekendRate}
                </div>
              )}
              {property.cleaningFee && (
                <div>
                  <b>Cleaning Fee:</b> {property.currency || "NGN"}
                  {property.cleaningFee}
                </div>
              )}
              {typeof property.taxesIncluded !== "undefined" && (
                <div>
                  <b>Taxes Included:</b> {property.taxesIncluded ? "Yes" : "No"}
                </div>
              )}
              {property.accommodations && (
                <div>
                  <b>Accommodations:</b> {property.accommodations}
                </div>
              )}
              {property.descriptionFacilities && (
                <div>
                  <b>Facilities Description:</b>{" "}
                  {property.descriptionFacilities}
                </div>
              )}
              {property.descriptionDining && (
                <div>
                  <b>Dining Description:</b> {property.descriptionDining}
                </div>
              )}
              {property.locationDescription && (
                <div>
                  <b>Location Description:</b> {property.locationDescription}
                </div>
              )}
            </div>
          )}
          {property.popularFacilities &&
            property.popularFacilities.length > 0 && (
              <Section title="Popular Facilities">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {property.popularFacilities.map((f, i) => (
                    <span
                      key={f + i}
                      style={{
                        background: "#e6f4f2",
                        color: "#19907e",
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontSize: 13,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          {property.rooms && property.rooms.length > 0 && (
            <Section title="Rooms">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {property.rooms.map((room, i) => (
                  <div
                    key={room.id || i}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 14,
                      background: "#fafbfc",
                    }}
                  >
                    <div
                      style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}
                    >
                      {room.name || `Room ${i + 1}`}
                    </div>
                    {room.bedType && (
                      <div
                        style={{ color: "#888", fontSize: 14, marginBottom: 4 }}
                      >
                        Bed Type: {room.bedType}
                      </div>
                    )}
                    {room.size && (
                      <div
                        style={{ color: "#888", fontSize: 14, marginBottom: 4 }}
                      >
                        Size: {room.size}
                      </div>
                    )}
                    {room.availability && (
                      <div
                        style={{ color: "#888", fontSize: 14, marginBottom: 4 }}
                      >
                        Availability: {room.availability}
                      </div>
                    )}
                    {room.originalPrice && (
                      <div
                        style={{ color: "#444", fontSize: 14, marginBottom: 4 }}
                      >
                        Original Price: {property.currency || "NGN"}
                        {room.originalPrice}
                      </div>
                    )}
                    {room.currentPrice && (
                      <div
                        style={{ color: "#444", fontSize: 14, marginBottom: 4 }}
                      >
                        Current Price: {property.currency || "NGN"}
                        {room.currentPrice}
                      </div>
                    )}
                    {room.discount && (
                      <div
                        style={{
                          color: "#19907e",
                          fontSize: 13,
                          marginBottom: 2,
                        }}
                      >
                        Discount: {room.discount}
                      </div>
                    )}
                    {room.deal && (
                      <div
                        style={{
                          color: "#19907e",
                          fontSize: 13,
                          marginBottom: 2,
                        }}
                      >
                        Deal: {room.deal}
                      </div>
                    )}
                    {room.guests && (
                      <div
                        style={{
                          color: "#374151",
                          fontSize: 13,
                          marginBottom: 2,
                        }}
                      >
                        Guests: {room.guests}
                      </div>
                    )}
                    {room.features && room.features.length > 0 && (
                      <div
                        style={{
                          color: "#19907e",
                          fontSize: 13,
                          marginBottom: 2,
                        }}
                      >
                        Features: {room.features.join(", ")}
                      </div>
                    )}
                    {room.amenities && room.amenities.length > 0 && (
                      <div
                        style={{
                          color: "#374151",
                          fontSize: 13,
                          marginBottom: 2,
                        }}
                      >
                        Amenities: {room.amenities.join(", ")}
                      </div>
                    )}
                    {room.choices && room.choices.length > 0 && (
                      <div
                        style={{
                          color: "#374151",
                          fontSize: 13,
                          marginBottom: 2,
                        }}
                      >
                        Choices: {room.choices.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
          {property.faqs && property.faqs.length > 0 && (
            <Section title="FAQs">
              <ul
                style={{
                  padding: 0,
                  margin: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {property.faqs.map((faq, i) => (
                  <li
                    key={faq.question + i}
                    style={{
                      background: "#f9fafb",
                      borderRadius: 8,
                      padding: 10,
                      boxShadow: "0 1px 4px rgba(24,36,53,0.04)",
                    }}
                  >
                    <b style={{ color: "#19907e" }}>{faq.question}</b>
                    <div style={{ color: "#444", marginTop: 2 }}>
                      {faq.answer}
                    </div>
                  </li>
                ))}
              </ul>
              {/* Move Highlights, Popular Facilities, Parking under FAQs */}
              {property.highlights && property.highlights.length > 0 && (
                <Section title="Highlights">
                  <ul
                    style={{
                      padding: 0,
                      margin: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {property.highlights.map((h, i) => (
                      <li
                        key={h.text + i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {h.icon && (
                          <span style={{ fontSize: 18 }}>{h.icon}</span>
                        )}
                        <span style={{ color: "#374151" }}>{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
              {/* Popular Facilities removed from under FAQs */}
              {/* Example: Parking (if present in amenities or popularFacilities) */}
              {(property.amenities?.includes("Parking") ||
                property.popularFacilities?.includes("Parking")) && (
                <Section title="Parking">
                  <div style={{ color: "#374151", fontSize: 15 }}>
                    Parking available
                  </div>
                </Section>
              )}
            </Section>
          )}
          {/* Facilities Section */}
          {property.facilities &&
            Object.keys(property.facilities).length > 0 && (
              <Section title="Facilities">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
                  {Object.entries(property.facilities).map(([group, items]) => (
                    <div
                      key={group}
                      style={{ minWidth: 160, marginBottom: 12 }}
                    >
                      <b style={{ color: "#19907e" }}>
                        {group.charAt(0).toUpperCase() + group.slice(1)}
                      </b>
                      <div
                        style={{ fontSize: 14, color: "#374151", marginTop: 4 }}
                      >
                        {Array.isArray(items) && items.length > 0 ? (
                          items.join(", ")
                        ) : typeof items === "string" && items ? (
                          items
                        ) : (
                          <span style={{ color: "#aaa" }}>None</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

          {/* House Rules Section */}
          {(property.cancellation ||
            property.children ||
            property.cotPolicy ||
            property.ageRestriction ||
            property.petsPolicy ||
            property.paymentMethods?.length ||
            property.parties ||
            property.finePrint) && (
            <Section title="House Rules">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {property.cancellation && (
                  <div>
                    <b>Cancellation Policy:</b> {property.cancellation}
                  </div>
                )}
                {property.children && (
                  <div>
                    <b>Children Policy:</b> {property.children}
                  </div>
                )}
                {property.cotPolicy && (
                  <div>
                    <b>Cot Policy:</b> {property.cotPolicy}
                  </div>
                )}
                {property.ageRestriction && (
                  <div>
                    <b>Age Restriction:</b> {property.ageRestriction}
                  </div>
                )}
                {property.petsPolicy && (
                  <div>
                    <b>Pets Policy:</b> {property.petsPolicy}
                  </div>
                )}
                {property.paymentMethods &&
                  property.paymentMethods.length > 0 && (
                    <div>
                      <b>Payment Methods:</b>{" "}
                      {property.paymentMethods.join(", ")}
                    </div>
                  )}
                {property.parties && (
                  <div>
                    <b>Parties Policy:</b> {property.parties}
                  </div>
                )}
                {property.finePrint && (
                  <div>
                    <b>Fine Print:</b> {property.finePrint}
                  </div>
                )}
              </div>
            </Section>
          )}

          {property.raw && property.raw.aboutProperty && (
            <Section title="About this property">
              <div style={{ color: "#444", marginTop: 4 }}>
                {property.raw.aboutProperty}
              </div>
            </Section>
          )}
          {/* Removed Edit and Delete buttons */}
        </div>
      </div>
    </div>
  );
}
