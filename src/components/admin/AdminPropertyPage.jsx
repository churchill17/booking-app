import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHost.css";
const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

function fmtDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-GB");
}

function fmtPrice(v) {
  const n = Number(v || 0);
  return isFinite(n) ? ngn.format(n) : "—";
}

function StatusPill({ isApproved }) {
  return isApproved
    ? <span className="ap-badge ap-badge--approved"><i className="ti ti-circle-check" style={{ fontSize: 11, marginRight: 3 }} />Approved</span>
    : <span className="ap-badge ap-badge--pending"><i className="ti ti-clock" style={{ fontSize: 11, marginRight: 3 }} />Pending</span>;
}

const PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><rect width='56' height='56' rx='8' fill='%23f0ede8'/><path d='M10 40l12-14 8 8 10-12 10 18H10z' fill='%23c8c4bc'/></svg>";

const STATUS_OPTIONS = ["All", "Approved", "Pending Approval"];

export default function AdminPropertyPage({
  listings = [],
  isLoading = false,
  error = "",
  onRefresh,
  onDeleteListing,
  onApproveListing,
}) {
  const navigate = useNavigate();
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [deleteModal, setDeleteModal]   = useState(null); // { id, name }
  const [isDeleting, setIsDeleting]     = useState(false);
  const [deleteError, setDeleteError]   = useState("");

  const [approveModal, setApproveModal] = useState(null); // { row }
  const [isApproving, setIsApproving]   = useState(false);
  const [approveError, setApproveError] = useState("");

  const filtered = listings.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      (item.propertyName || "").toLowerCase().includes(q) ||
      (item.city || "").toLowerCase().includes(q) ||
      String(item.id || "").includes(q);
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const approvedCount = listings.filter((l) => l.isApproved).length;
  const pendingCount  = listings.filter((l) => !l.isApproved).length;

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true); setDeleteError("");
    try {
      await onDeleteListing(deleteModal.id);
      setDeleteModal(null);
    } catch (err) {
      setDeleteError(err?.message || "Could not delete. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmApprove = async () => {
    if (!approveModal) return;
    setIsApproving(true); setApproveError("");
    try {
      await onApproveListing(approveModal.row.id, !approveModal.row.isApproved);
      setApproveModal(null);
    } catch (err) {
      setApproveError(err?.message || "Could not update status.");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Header */}
      <div className="ap-header">
        <div>
          <h1 className="ap-title">Properties</h1>
          <p className="ap-subtitle">All host listings across the platform</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ap-btn ap-btn--ghost" onClick={onRefresh}>
            <i className="ti ti-refresh" aria-hidden="true" /> Refresh
          </button>
        </div>
      </div>

      {error && <div className="ap-error"><i className="ti ti-alert-circle" style={{ marginRight: 6 }} />{error}</div>}

      {/* Summary */}
      <div className="ap-stat-grid ap-stat-grid--4">
        {[
          { label: "Total listed",      value: listings.length,  icon: "ti-building",      color: "#e8f0fe", iconColor: "#1a3a5c" },
          { label: "Approved / live",   value: approvedCount,    icon: "ti-circle-check",  color: "#f0fdf4", iconColor: "#15803d" },
          { label: "Pending approval",  value: pendingCount,     icon: "ti-clock",          color: "#fff8e6", iconColor: "#b45309" },
          { label: "Showing",           value: filtered.length,  icon: "ti-filter",         color: "#f3e8ff", iconColor: "#7e22ce" },
        ].map((s) => (
          <div className="ap-stat-card" key={s.label}>
            <div className="ap-stat-icon" style={{ background: s.color }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.iconColor }} aria-hidden="true" />
            </div>
            <div>
              <p className="ap-stat-label">{s.label}</p>
              <p className="ap-stat-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="ap-card">
        <div className="ap-toolbar">
          <div className="ap-search">
            <i className="ti ti-search" aria-hidden="true" />
            <input placeholder="Search by name, city, ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="ap-filter-tabs">
            {STATUS_OPTIONS.map((s) => (
              <button key={s} className={`ap-filter-tab ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>{s}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="ap-loading"><i className="ti ti-loader-2" style={{ marginRight: 6 }} />Loading properties…</div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty"><i className="ti ti-building-off" />No properties found.</div>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table" style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Property</th>
                  <th>Host</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Bookings</th>
                  <th>Listed</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/admin/property/${row.id}`)}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <img
                        src={row.mainImage || PLACEHOLDER}
                        alt=""
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", display: "block" }}
                      />
                    </td>
                    <td>
                      <div className="ap-name">{row.propertyName}</div>
                      <div className="ap-muted">{row.type}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: "#2d3748" }}>
                        {[row.firstName, row.lastName].filter(Boolean).join(" ") || row.hostName || "—"}
                      </div>
                      <div className="ap-muted">{row.email || row.hostEmail || ""}</div>
                    </td>
                    <td className="ap-muted">{[row.city, row.country].filter(Boolean).join(", ") || "—"}</td>
                    <td className="ap-bold">{fmtPrice(row.originalPrice)}</td>
                    <td style={{ textAlign: "center" }}>{row.totalBookings || 0}</td>
                    <td className="ap-muted">{fmtDate(row.createdAt)}</td>
                    <td><StatusPill isApproved={row.isApproved} /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button
                          className={`ap-btn ${row.isApproved ? "ap-btn--disapprove" : "ap-btn--approve"}`}
                          style={{ padding: "5px 10px", fontSize: 11 }}
                          onClick={() => { setApproveError(""); setApproveModal({ row }); }}
                        >
                          {row.isApproved ? "Disapprove" : "Approve"}
                        </button>
                        <button
                          className="ap-btn ap-btn--danger"
                          style={{ padding: "5px 10px", fontSize: 11 }}
                          onClick={() => { setDeleteError(""); setDeleteModal({ id: row.id, name: row.propertyName }); }}
                        >
                          <i className="ti ti-trash" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approve modal */}
      {approveModal && (
        <div className="ap-modal-backdrop" onClick={() => setApproveModal(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="ap-modal-title">
              {approveModal.row.isApproved ? "Disapprove this property?" : "Approve this property?"}
            </h2>
            <div className="ap-modal-body">
              {[
                ["Property", approveModal.row.propertyName],
                ["Host",     [approveModal.row.firstName, approveModal.row.lastName].filter(Boolean).join(" ") || approveModal.row.hostName || "—"],
                ["Location", [approveModal.row.city, approveModal.row.country].filter(Boolean).join(", ") || "—"],
                ["Price",    fmtPrice(approveModal.row.originalPrice)],
                ["Bookings", `${approveModal.row.totalBookings || 0} total`],
                ["Added",    fmtDate(approveModal.row.createdAt)],
                ["Status",   approveModal.row.status],
              ].map(([label, value]) => (
                <div className="ap-modal-row" key={label}>
                  <span className="ap-modal-row-label">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            {approveError && <div className="ap-error" style={{ marginBottom: 14 }}>{approveError}</div>}
            <div className="ap-modal-footer">
              <button className="ap-btn ap-btn--ghost" onClick={() => setApproveModal(null)} disabled={isApproving}>Cancel</button>
              <button
                className={`ap-btn ${approveModal.row.isApproved ? "ap-btn--danger" : "ap-btn--primary"}`}
                onClick={confirmApprove}
                disabled={isApproving}
                style={{ opacity: isApproving ? 0.6 : 1 }}
              >
                {isApproving ? "Saving…" : (approveModal.row.isApproved ? "Disapprove" : "Approve")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteModal && (
        <div className="ap-modal-backdrop" onClick={() => setDeleteModal(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="ap-modal-title">Delete property?</h2>
            <div className="ap-modal-body">
              <div className="ap-modal-row">
                <span className="ap-modal-row-label">Property</span>
                <span>{deleteModal.name}</span>
              </div>
              <div className="ap-modal-row" style={{ marginTop: 4 }}>
                <span className="ap-modal-row-label" />
                <span style={{ color: "#c0392b", fontSize: 12 }}>This action is permanent and cannot be undone.</span>
              </div>
            </div>
            {deleteError && <div className="ap-error" style={{ marginBottom: 14 }}>{deleteError}</div>}
            <div className="ap-modal-footer">
              <button className="ap-btn ap-btn--ghost" onClick={() => setDeleteModal(null)} disabled={isDeleting}>Cancel</button>
              <button
                className="ap-btn ap-btn--danger"
                onClick={confirmDelete}
                disabled={isDeleting}
                style={{ opacity: isDeleting ? 0.6 : 1, background: "#c0392b", color: "#fff", border: "none" }}
              >
                {isDeleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}