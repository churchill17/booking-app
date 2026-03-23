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

  return (
    <div className="property-details-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 className="property-details-title">{property.propertyName}</h1>
      <div className="property-details-meta">
        <span>Status: {property.status}</span>
        <span>{property.totalBookings} bookings</span>
        <span>Added {new Date(property.createdAt).toLocaleDateString("en-GB")}</span>
      </div>
      <div className="property-details-images">
        {(property.photos && property.photos.length > 0 ? property.photos : [property.mainImage]).map((img, i) => (
          <img key={i} src={img} alt="Property" className="property-details-img" />
        ))}
      </div>
      <div className="property-details-info">
        <p><strong>Address:</strong> {property.address}</p>
        <p><strong>City:</strong> {property.city}</p>
        <p><strong>Country:</strong> {property.country}</p>
        <p><strong>Price:</strong> ₦{property.price} / {property.pricingType || "per night"}</p>
        <p><strong>Rating:</strong> {property.avgRating} / 5</p>
        <p><strong>Amenities:</strong> {property.amenities && property.amenities.join(", ")}</p>
      </div>
      <div className="property-details-actions">
        <button className="row-menu" onClick={() => onEdit(property)}>Edit</button>
        <button className="row-menu row-menu--danger" onClick={() => onDelete(property.id)}>Delete</button>
      </div>
    </div>
  );
}
