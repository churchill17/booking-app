import React, { useState } from "react";
import "./PropertyPage.css";
import { useNavigate } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

const EMPTY_FORM = {
  propertyName: "",
  address: "",
  city: "",
  country: "",
  status: "Pending",
};

const STATUS_OPTIONS = ["All", "Approved", "Pending Approval"];
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420' viewBox='0 0 640 420'><rect width='640' height='420' fill='%23ede9e1'/><circle cx='215' cy='150' r='42' fill='%23d5cfc0'/><path d='M96 320l110-108 72 72 88-100 178 136H96z' fill='%23b3aca9'/><text x='320' y='376' text-anchor='middle' font-family='Arial' font-size='24' fill='%23182435'>No Image</text></svg>";

const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB");
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return currencyFormatter.format(Number.isFinite(amount) ? amount : 0);
};

const formatPricingType = (value) => {
  return String(value || "per_night").replace(/_/g, " ");
};

const toTitleCase = (value) =>
  String(value || "Property").replace(/\b\w/g, (char) => char.toUpperCase());

export default function PropertyPage({
  listings = [],
  isLoading = false,
  error = "",
  onRefresh,
  onDeleteListing,
}) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Navigation handlers
  const handleCreateNavigate = () => {
    navigate("/list-property/type");
  };

  const handleCardClick = (row) => {
    navigate(`/host/property/${row.id}`);
  };

  const handleEditNavigate = (row) => {
    navigate(`/list-property/edit/${row.id}`);
  };

  const filtered = listings.filter((item) => {
    const name = item.propertyName || "";
    const location = [item.city, item.country].filter(Boolean).join(" ");
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase()) ||
      String(item.id || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const navigate = useNavigate();

  // Delete modal logic
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    await onDeleteListing(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="property-page">
      <div className="page-header-row">
        <div className="page-header-title-row">
          <h1 className="page-title">Order List</h1>
          <p className="breadcrumb">
            <span>Property</span> <span className="bc-dot">●</span>{" "}
            <span className="bc-active">Order List</span>
          </p>
        </div>
        <button
          className="btn-create"
          type="button"
          onClick={handleCreateNavigate}
        >
          Create
        </button>
        <div className="header-controls">
          <div className="search-box">
            <span>🔍</span>
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <span>⚡</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
          <button className="btn-refresh" onClick={onRefresh} type="button">
            Refresh
          </button>
        </div>
      </div>

      {/* The create form is now handled in a modal or separate page, triggered by the Create button */}

      {error ? (
        <div className="property-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="summary-cards">
        <SummaryCard
          icon="👤"
          label="Total Properties"
          value={String(listings.length)}
        />
        <SummaryCard
          icon="🧾"
          label="Filtered Results"
          value={String(filtered.length)}
        />
        <SummaryCard
          icon="✅"
          label="Approved"
          value={String(listings.filter((item) => item.isApproved).length)}
        />
      </div>

      {isLoading ? (
        <div className="empty-state">Loading properties...</div>
      ) : null}

      {!isLoading && filtered.length > 0 ? (
        <div className="property-card-grid">
          {filtered.map((row) => (
            <article
              className="property-card clickable"
              key={row.id}
              onClick={() => handleCardClick(row)}
            >
              <div className="property-card__image-wrap">
                <img
                  className="property-card__image"
                  src={row.mainImage || PLACEHOLDER_IMAGE}
                  alt={row.propertyName}
                />
                <StatusPill status={row.status} />
              </div>

              <div className="property-card__body">
                <div className="property-card__topline">
                  <span className="property-type-badge">
                    {toTitleCase(row.type)}
                  </span>
                  <span className="property-card__bookings">
                    {row.totalBookings} bookings
                  </span>
                </div>

                <h2 className="property-card__title">{row.propertyName}</h2>
                <p className="property-card__location">
                  {[row.city, row.country].filter(Boolean).join(", ") ||
                    "Location unavailable"}
                </p>

                <div className="property-card__meta-row">
                  <p className="property-card__price">
                    {formatCurrency(row.price)}
                    <span className="property-card__price-type">
                      {` / ${formatPricingType(row.pricingType)}`}
                    </span>
                  </p>
                  <p className="property-card__rating">
                    <span className="property-card__rating-star">★</span>
                    {`${row.avgRating} / 5`}
                  </p>
                </div>

                <div className="property-card__chips">
                  {row.amenities.slice(0, 4).map((amenity) => (
                    <span className="amenity-chip" key={amenity}>
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="property-card__footer">
                  <span className="property-card__date">
                    Added {formatDate(row.createdAt)}
                  </span>
                  <div
                    className="row-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="row-menu"
                      type="button"
                      onClick={() => handleEditNavigate(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="row-menu row-menu--danger"
                      type="button"
                      onClick={() => handleDeleteClick(row.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {/* Delete Confirmation Modal - moved outside card grid */}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(24,36,53,0.52)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            className="modal-card"
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "28px",
              boxShadow: "0 20px 48px rgba(24,36,53,0.22)",
              maxWidth: "400px",
            }}
          >
            <h2
              style={{
                color: "#182435",
                fontSize: "24px",
                marginBottom: "18px",
              }}
            >
              Are you sure you want to delete?
            </h2>
            <p style={{ marginBottom: "24px" }}>
              This action is permanent and cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "#eee",
                  border: "none",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "#d32f2f",
                  color: "#fff",
                  border: "none",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && filtered.length === 0 ? (
        <div className="empty-state">
          No properties found matching your search.
        </div>
      ) : null}
    </div>
  );
}
function SummaryCard({ icon, label, value }) {
  return (
    <div className="summary-card">
      <div className="summary-icon">{icon}</div>
      <div>
        <p className="summary-label">{label}</p>
        <p className="summary-value">{value}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const cls =
    {
      Approved: "pill-success",
      "Pending Approval": "pill-warn",
    }[status] || "";
  return <span className={`status-pill ${cls}`}>● {status}</span>;
}
