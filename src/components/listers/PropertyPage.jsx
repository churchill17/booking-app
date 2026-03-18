import React, { useState } from "react";
import "./PropertyPage.css";

const EMPTY_FORM = {
  propertyName: "",
  address: "",
  city: "",
  country: "",
  status: "Pending",
};

const STATUS_OPTIONS = ["All", "Success", "Canceled", "Pending"];

const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB");
};

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
  const [selected, setSelected] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const filtered = listings.filter((item) => {
    const name = item.propertyName || "";
    const id = String(item.id || "");
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === filtered.length
        ? []
        : filtered.map((item) => item.id),
    );
  };

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
      setSelected((prev) => prev.filter((itemId) => itemId !== id));
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
          icon="💼"
          label="Selected Rows"
          value={String(selected.length)}
        />
      </div>

      <div className="orders-table-card">
        <table className="orders-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={
                    selected.length === filtered.length && filtered.length > 0
                  }
                />
              </th>
              <th>Order ID ↕</th>
              <th>Property</th>
              <th>Date ↕</th>
              <th>Price ↕</th>
              <th>Status ↕</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className={selected.includes(row.id) ? "row-selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                <td className="order-id-cell">{row.id || "-"}</td>
                <td>
                  <div className="property-cell">
                    <div className="prop-thumb">🏠</div>
                    <div>
                      <p className="prop-name">{row.propertyName}</p>
                      <p className="prop-addr">
                        {[row.address, row.city, row.country]
                          .filter(Boolean)
                          .join(", ") || "No location set"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="date-cell">{formatDate(row.createdAt)}</td>
                <td className="price-cell">
                  {row.price ? `$${row.price}` : "-"}
                </td>
                <td>
                  <StatusPill status={row.status} />
                </td>
                <td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading ? (
          <div className="empty-state">Loading listings...</div>
        ) : null}
        {filtered.length === 0 && (
          <div className="empty-state">
            No listings found matching your search.
          </div>
        )}
      </div>
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
      Success: "pill-success",
      Canceled: "pill-error",
      Pending: "pill-warn",
    }[status] || "";
  return <span className={`status-pill ${cls}`}>● {status}</span>;
}
