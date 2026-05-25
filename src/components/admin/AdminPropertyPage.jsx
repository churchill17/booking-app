import React, { useState } from "react";
import "./AdminPropertyPage.css";
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
  onApproveListing,
}) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [approveModal, setApproveModal] = useState(null); // null | { row }

  const handleApproveClick = (e, row) => {
    e.stopPropagation();
    setApproveModal({ row });
  };

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
    <div className="admin-property-page">
      <div className="admin-page-header-row">
        <div className="admin-page-header-title-row">
          <h1 className="admin-page-title">Order List</h1>
          <p className="admin-breadcrumb">
            <span>Property</span> <span className="admin-bc-dot">●</span>{" "}
            <span className="admin-bc-active">Order List</span>
          </p>
        </div>
        <div className="admin-header-controls">
          <button
            className="admin-btn-create"
            type="button"
            onClick={handleCreateNavigate}
          >
            + Create Property
          </button>
          <div className="admin-search-box">
            <span>🔍</span>
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-filter-dropdown">
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
          <button className="admin-btn-refresh" onClick={onRefresh} type="button">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-property-error" role="alert">
          {error}
        </div>
      )}

      <div className="admin-summary-cards">
        <AdminSummaryCard
          icon="👤"
          label="Total Properties"
          value={String(listings.length)}
        />
        <AdminSummaryCard
          icon="🧾"
          label="Filtered Results"
          value={String(filtered.length)}
        />
        <AdminSummaryCard
          icon="✅"
          label="Approved"
          value={String(listings.filter((item) => item.isApproved).length)}
        />
      </div>

      {isLoading && <div className="admin-empty-state">Loading properties...</div>}

      {!isLoading && filtered.length > 0 && (
        <div className="admin-property-card-horizontal-list">
          {filtered.map((row) => (
            <article
              className="admin-property-card-horizontal clickable"
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
                className="admin-property-card-horizontal__title"
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
              <span className="admin-property-card__bookings">
                {row.totalBookings} bookings
              </span>
              <span className="admin-property-card-horizontal__address">
                {row.address ? row.address + ", " : ""}
                {[row.city, row.country].filter(Boolean).join(", ") ||
                  "Location unavailable"}
              </span>
              <span className="admin-property-card-horizontal__date">
                Added {formatDate(row.createdAt)}
              </span>
              <span className="admin-property-card-horizontal__price">
                {formatCurrency(row.originalPrice)}
                <span className="admin-property-card__price-type">
                  {` / ${formatPricingType(row.pricingType)}`}
                </span>
              </span>
              <AdminStatusPill status={row.status} />
              <button
                type="button"
                onClick={(e) => handleApproveClick(e, row)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  background: row.isApproved ? "#fee2e2" : "#dcfce7",
                  color: row.isApproved ? "#dc2626" : "#16a34a",
                }}
              >
                {row.isApproved ? "Disapprove" : "Approve"}
              </button>
              <div
                className="admin-property-card-horizontal__actions"
                style={{ display: "flex", gap: "10px", marginLeft: "auto" }}
              >
                <button
                  className="admin-row-menu"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditNavigate(row);
                  }}
                >
                  Edit
                </button>
                <button
                  className="admin-row-menu admin-row-menu--danger"
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
        <div className="admin-empty-state">
          No properties found matching your search.
        </div>
      )}

      {/* Approve / Disapprove Modal */}
      {approveModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(24,36,53,0.52)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
          onClick={async () => {
  await onApproveListing(approveModal.row.id, !approveModal.row.isApproved);
  setApproveModal(null);
}}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "28px",
              boxShadow: "0 20px 48px rgba(24,36,53,0.22)",
              maxWidth: "420px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "#182435", fontSize: "20px", marginBottom: "18px" }}>
              {approveModal.row.isApproved
                ? "Disapprove this property?"
                : "Approve this property?"}
            </h2>

            <div
              style={{
                background: "#f8f9fb",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "22px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              {[
                ["Property",  approveModal.row.propertyName],
                ["Location",  [approveModal.row.city, approveModal.row.country].filter(Boolean).join(", ") || "—"],
                ["Price",     formatCurrency(approveModal.row.originalPrice)],
                ["Bookings",  `${approveModal.row.totalBookings} bookings`],
                ["Added",     formatDate(approveModal.row.createdAt)],
                ["Status",    approveModal.row.status],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontWeight: 600, minWidth: "90px", color: "#6b7280" }}>{label}</span>
                  <span style={{
                    fontWeight: label === "Status" ? 600 : 400,
                    color: label === "Status"
                      ? (approveModal.row.isApproved ? "#16a34a" : "#c97d10")
                      : "#182435",
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setApproveModal(null)}
                style={{
                  padding: "9px 20px",
                  borderRadius: "8px",
                  background: "#f3f4f6",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setApproveModal(null)}
                style={{
                  padding: "9px 24px",
                  borderRadius: "8px",
                  background: approveModal.row.isApproved ? "#dc2626" : "#16a34a",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                OK
              </button>
            </div>
          </div>
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

function AdminSummaryCard({ icon, label, value }) {
  return (
    <div className="admin-summary-card">
      <div className="admin-summary-icon">{icon}</div>
      <div>
        <p className="admin-summary-label">{label}</p>
        <p className="admin-summary-value">{value}</p>
      </div>
    </div>
  );
}

function AdminStatusPill({ status }) {
  const cls =
    {
      Approved: "pill-success",
      "Pending Approval": "pill-warn",
    }[status] || "";
  return <span className={`admin-status-pill ${cls}`}>● {status}</span>;
}
