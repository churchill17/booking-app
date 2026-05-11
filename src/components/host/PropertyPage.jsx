import React, { useState } from "react";
import "./PropertyPage.css";
import { useNavigate } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

const STATUS_OPTIONS = ["All", "Approved", "Pending Approval"];

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

const formatPricingType = (value) =>
  String(value || "per_night").replace(/_/g, " ");

export default function PropertyPage({
  listings = [],
  isLoading = false,
  error = "",
  onRefresh,
  onDeleteListing,
}) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleCreateNavigate = () => {
    navigate("/list-property", {
      state: {
        listProperty: { page: "wizard", wizardStep: 0, origin: "/host" },
      },
    });
  };

  const handleCardClick = (row) => navigate(`/host/property/${row.id}`);
  const handleEditNavigate = (row) => navigate(`/list-property/edit/${row.id}`);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      await onDeleteListing(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      setDeleteError(err?.message || "Could not delete property. Try again.");
    } finally {
      setIsDeleting(false);
    }
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
        <div className="header-controls">
          <button
            className="btn-create"
            type="button"
            onClick={handleCreateNavigate}
          >
            + Create Property
          </button>
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
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <button className="btn-refresh" onClick={onRefresh} type="button">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="property-error" role="alert">
          {error}
        </div>
      )}

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

      {isLoading && <div className="empty-state">Loading properties...</div>}

      {!isLoading && filtered.length > 0 && (
        <div className="property-card-horizontal-list">
          {filtered.map((row) => (
            <article
              className="property-card-horizontal clickable"
              key={row.id}
              onClick={() => handleCardClick(row)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                padding: "18px 22px",
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h2
                className="property-card-horizontal__title"
                style={{
                  minWidth: 0,
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--darkNavyBlue)",
                }}
              >
                {row.propertyName}
              </h2>
              <span className="property-card__bookings">
                {row.totalBookings} bookings
              </span>
              <span className="property-card-horizontal__address">
                {row.address ? row.address + ", " : ""}
                {[row.city, row.country].filter(Boolean).join(", ") ||
                  "Location unavailable"}
              </span>
              <span className="property-card-horizontal__date">
                Added {formatDate(row.createdAt)}
              </span>
              <span className="property-card-horizontal__price">
                {formatCurrency(row.originalPrice)}
                <span className="property-card__price-type">
                  {` / ${formatPricingType(row.pricingType)}`}
                </span>
              </span>
              <StatusPill status={row.status} />
              <div
                className="property-card-horizontal__actions"
                style={{ display: "flex", gap: "10px", marginLeft: "auto" }}
              >
                <button
                  className="row-menu"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditNavigate(row);
                  }}
                >
                  Edit
                </button>
                <button
                  className="row-menu row-menu--danger"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(row.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="empty-state">
          No properties found matching your search.
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
              width: "90%",
            }}
          >
            <h2
              style={{
                color: "#182435",
                fontSize: "22px",
                marginBottom: "12px",
              }}
            >
              Delete property?
            </h2>
            <p style={{ marginBottom: "20px", color: "#555" }}>
              This action is permanent and cannot be undone.
            </p>
            {deleteError && (
              <p
                style={{
                  color: "#d32f2f",
                  marginBottom: "16px",
                  fontSize: 14,
                }}
              >
                {deleteError}
              </p>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  background: "#eee",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  background: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
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
