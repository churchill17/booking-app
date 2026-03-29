import React from "react";
import "./PropertyPage.css";
import { useParams, useNavigate } from "react-router-dom";

export default function PropertyDetails({ listings = [], onEdit, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = listings.find((item) => String(item.id) === String(id));

  if (!property) {
    return <div className="empty-state">Property not found.</div>;
  }

  // Gather all images (mainImage, images, photos)
  const images = [
    ...(property.photos && property.photos.length > 0 ? property.photos : []),
    ...(property.images && property.images.length > 0 ? property.images : []),
    property.mainImage,
  ].filter(Boolean);

  return (
    <div
      className="property-details-page"
      style={{
        maxWidth: 900,
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
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        {/* Image Gallery */}
        <div style={{ flex: "0 0 320px", maxWidth: 340 }}>
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
        </div>
        {/* Details */}
        <div style={{ flex: 1, minWidth: 240 }}>
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
              <b>Price:</b> ₦{property.price}{" "}
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
            <div>
              <b>Available:</b> {property.isAvailable ? "Yes" : "No"}
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
          <div style={{ marginBottom: 18 }}>
            <b>Amenities:</b>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 6,
              }}
            >
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((am, i) => (
                  <span
                    key={am + "-" + i}
                    style={{
                      background: "#f3f4f6",
                      color: "#374151",
                      borderRadius: 8,
                      padding: "4px 10px",
                      fontSize: 13,
                    }}
                  >
                    {am}
                  </span>
                ))
              ) : (
                <span style={{ color: "#888" }}>No amenities listed</span>
              )}
            </div>
          </div>
          {property.raw && property.raw.aboutProperty && (
            <div style={{ marginBottom: 18 }}>
              <b>About this property:</b>
              <div style={{ color: "#444", marginTop: 4 }}>
                {property.raw.aboutProperty}
              </div>
            </div>
          )}
          <div
            className="property-details-actions"
            style={{ display: "flex", gap: 12, marginTop: 24 }}
          >
            <button className="row-menu" onClick={() => onEdit(property)}>
              Edit
            </button>
            <button
              className="row-menu row-menu--danger"
              onClick={() => onDelete(property.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
