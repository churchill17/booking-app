import React, { useState } from "react";
import "./PropertyPage.css";

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

const buildUpdatePayload = (values) => ({
  propertyName: values.propertyName,
  address: values.address,
  city: values.city,
  country: values.country,
  status: values.status,
});

export default function PropertyPage({
  listings = [],
  isLoading = false,
  error = "",
  onRefresh,
  onCreateListing,
  onUpdateListing,
  onDeleteListing,
}) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState("");

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

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!form.propertyName.trim()) {
      setActionError("Property name is required.");
      return;
    }

    setActionError("");
    setIsSaving(true);

    try {
      await onCreateListing({
        listing: {
          propertyName: form.propertyName.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          guests: 1,
          bathrooms: 1,
          parking: "No",
          pets: "No",
          photos: [],
          status: form.status,
        },
      });
      setForm(EMPTY_FORM);
    } catch (err) {
      setActionError(err?.message || "Could not create property.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setForm({
      propertyName: item.propertyName || "",
      address: item.address || "",
      city: item.city || "",
      country: item.country || "",
      status: item.status || "Pending",
    });
    setActionError("");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    if (!form.propertyName.trim()) {
      setActionError("Property name is required.");
      return;
    }

    setActionError("");
    setIsSaving(true);

    try {
      await onUpdateListing(editingId, buildUpdatePayload(form));
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      setActionError(err?.message || "Could not update property.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setActionError("");
    setIsSaving(true);
    try {
      await onDeleteListing(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      setActionError(err?.message || "Could not delete property.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="property-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Order List</h1>
          <p className="breadcrumb">
            <span>Property</span> <span className="bc-dot">●</span>{" "}
            <span className="bc-active">Order List</span>
          </p>
        </div>
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

      <form className="property-form" onSubmit={handleCreate}>
        <input
          placeholder="Property name"
          value={form.propertyName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, propertyName: e.target.value }))
          }
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, address: e.target.value }))
          }
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, city: e.target.value }))
          }
        />
        <input
          placeholder="Country"
          value={form.country}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, country: e.target.value }))
          }
        />
        <select
          value={form.status}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          {STATUS_OPTIONS.filter((item) => item !== "All").map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {editingId ? (
          <button
            type="button"
            className="property-form__btn"
            onClick={handleUpdate}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Update"}
          </button>
        ) : (
          <button
            type="submit"
            className="property-form__btn"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Create"}
          </button>
        )}
      </form>

      {error || actionError ? (
        <div className="property-error" role="alert">
          {actionError || error}
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
            <article className="property-card" key={row.id}>
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
                  <div className="row-actions">
                    <button
                      className="row-menu"
                      type="button"
                      onClick={() => startEditing(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="row-menu row-menu--danger"
                      type="button"
                      onClick={() => handleDelete(row.id)}
                      disabled={isSaving}
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
