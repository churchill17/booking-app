import React, { useState, useEffect, useRef } from "react";
import "./GuestsPage.css";

// ── Icons ─────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Grid: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  List: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Repeat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  Flag: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  ),
  Star: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Download: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Note: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Home: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Mail: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Phone: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.53 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 6 6l1.06-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

// ── Helpers ───────────────────────────────────────────────────
const fmtDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const initials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
};

const avatarColor = (name) => {
  const colors = [
    ["#1a4a7a", "#e8f0fb"],
    ["#0a6b52", "#e6f4ef"],
    ["#7a3a1a", "#faf0e6"],
    ["#4a1a7a", "#f0e6fa"],
    ["#1a5a6b", "#e6f2f4"],
    ["#6b5a1a", "#f4f0e6"],
  ];
  const idx = (name || "").charCodeAt(0) % colors.length;
  return colors[idx];
};

// ── Export CSV ────────────────────────────────────────────────
const exportCSV = (guests) => {
  const headers = ["Name", "Email", "Phone", "Total Stays", "Last Stay", "Properties", "Status", "Notes"];
  const rows = guests.map((g) => [
    g.name,
    g.email,
    g.phone || "",
    g.totalStays,
    fmtDate(g.lastStay),
    (g.properties || []).join("; "),
    g.isBlacklisted ? "Blacklisted" : g.isVip ? "VIP" : "Active",
    (g.note || "").replace(/,/g, ";"),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "guests.csv";
  a.click();
  URL.revokeObjectURL(url);
};

// ── Guest Detail Panel ────────────────────────────────────────
function GuestPanel({ guest, properties, onClose, onSave }) {
  const [note, setNote] = useState(guest.note || "");
  const [isVip, setIsVip] = useState(!!guest.isVip);
  const [isBlacklisted, setIsBlacklisted] = useState(!!guest.isBlacklisted);
  const [saving, setSaving] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    setNote(guest.note || "");
    setIsVip(!!guest.isVip);
    setIsBlacklisted(!!guest.isBlacklisted);
  }, [guest]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(guest.email, { note, isVip, isBlacklisted });
    setSaving(false);
  };

  const [bg, fg] = avatarColor(guest.name);

  return (
    <div className="gp-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && onClose()}>
      <div className="gp-panel">
        <div className="gp-panel-header">
          <span className="gp-panel-title">Guest Profile</span>
          <button className="gp-close-btn" onClick={onClose}><Icon.Close /></button>
        </div>

        {/* Identity */}
        <div className="gp-identity">
          <div className="gp-avatar-lg" style={{ background: bg, color: fg }}>
            {initials(guest.name)}
          </div>
          <div className="gp-identity-info">
            <div className="gp-identity-name">{guest.name}</div>
            <div className="gp-identity-badges">
              {guest.totalStays >= 2 && (
                <span className="gp-badge gp-badge--repeat">
                  <Icon.Repeat /> Repeat guest
                </span>
              )}
              {isVip && <span className="gp-badge gp-badge--vip"><Icon.Star /> VIP</span>}
              {isBlacklisted && <span className="gp-badge gp-badge--blacklisted"><Icon.Flag /> Flagged</span>}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="gp-section">
          <div className="gp-section-label">Contact</div>
          <div className="gp-contact-list">
            <div className="gp-contact-row"><Icon.Mail /><span>{guest.email}</span></div>
            {guest.phone && <div className="gp-contact-row"><Icon.Phone /><span>{guest.phone}</span></div>}
          </div>
        </div>

        {/* Stats */}
        <div className="gp-section">
          <div className="gp-section-label">Stay Summary</div>
          <div className="gp-stats-row">
            <div className="gp-stat">
              <span className="gp-stat-value">{guest.totalStays}</span>
              <span className="gp-stat-label">Total Stays</span>
            </div>
            <div className="gp-stat">
              <span className="gp-stat-value">{fmtDate(guest.lastStay)}</span>
              <span className="gp-stat-label">Last Stay</span>
            </div>
          </div>
        </div>

        {/* Stay history */}
        {Array.isArray(guest.bookings) && guest.bookings.length > 0 && (
          <div className="gp-section">
            <div className="gp-section-label">Stay History</div>
            <div className="gp-history-list">
              {guest.bookings.map((b, i) => (
                <div className="gp-history-item" key={i}>
                  <div className="gp-history-icon"><Icon.Home /></div>
                  <div className="gp-history-body">
                    <div className="gp-history-property">{b.propertyName}</div>
                    <div className="gp-history-dates">
                      <Icon.Calendar />
                      {fmtDate(b.checkIn)} — {fmtDate(b.checkOut)}
                    </div>
                  </div>
                  <div className="gp-history-status">
                    <StatusDot status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="gp-section">
          <div className="gp-section-label">Internal Notes</div>
          <textarea
            className="gp-note-input"
            placeholder="Add a private note about this guest — only you can see this."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        {/* Flags */}
        <div className="gp-section">
          <div className="gp-section-label">Guest Tags</div>
          <div className="gp-toggle-row">
            <button
              className={`gp-toggle-btn ${isVip ? "gp-toggle-btn--active-vip" : ""}`}
              onClick={() => { setIsVip(!isVip); if (!isVip) setIsBlacklisted(false); }}
            >
              <Icon.Star /> Mark as VIP
            </button>
            <button
              className={`gp-toggle-btn ${isBlacklisted ? "gp-toggle-btn--active-flag" : ""}`}
              onClick={() => { setIsBlacklisted(!isBlacklisted); if (!isBlacklisted) setIsVip(false); }}
            >
              <Icon.Flag /> Flag guest
            </button>
          </div>
        </div>

        <button className="gp-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

// ── Status dot ────────────────────────────────────────────────
function StatusDot({ status }) {
  const map = {
    confirmed: { color: "#0a8c6b", bg: "var(--successLight)", label: "Confirmed" },
    pending:   { color: "#c97d10", bg: "#fff8e6",             label: "Pending" },
    cancelled: { color: "var(--errorRed)", bg: "var(--errorLight)", label: "Cancelled" },
    completed: { color: "#2563eb", bg: "#e8f1ff",             label: "Completed" },
  };
  const s = map[String(status).toLowerCase()] || { color: "var(--slateGray)", bg: "var(--softBeige)", label: status };
  return (
    <span className="g-status-badge" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ── Guest Card ────────────────────────────────────────────────
function GuestCard({ guest, onClick }) {
  const [bg, fg] = avatarColor(guest.name);
  return (
    <div className={`g-card ${guest.isBlacklisted ? "g-card--flagged" : ""} ${guest.isVip ? "g-card--vip" : ""}`} onClick={onClick}>
      <div className="g-card-top">
        <div className="g-avatar" style={{ background: bg, color: fg }}>
          {initials(guest.name)}
        </div>
        <div className="g-card-badges">
          {guest.isVip && <span className="g-badge g-badge--vip"><Icon.Star /></span>}
          {guest.isBlacklisted && <span className="g-badge g-badge--flag"><Icon.Flag /></span>}
          {guest.totalStays >= 2 && !guest.isVip && !guest.isBlacklisted && (
            <span className="g-badge g-badge--repeat"><Icon.Repeat /></span>
          )}
        </div>
      </div>
      <div className="g-card-name">{guest.name}</div>
      <div className="g-card-email">{guest.email}</div>
      {guest.phone && <div className="g-card-phone">{guest.phone}</div>}
      <div className="g-card-divider" />
      <div className="g-card-meta">
        <div className="g-card-meta-item">
          <Icon.Calendar />
          <span>{guest.totalStays} stay{guest.totalStays !== 1 ? "s" : ""}</span>
        </div>
        <div className="g-card-meta-item">
          <Icon.Home />
          <span>{(guest.properties || []).length} propert{(guest.properties || []).length !== 1 ? "ies" : "y"}</span>
        </div>
      </div>
      {guest.lastStay && (
        <div className="g-card-last">Last stay: {fmtDate(guest.lastStay)}</div>
      )}
      {guest.note && (
        <div className="g-card-note">
          <Icon.Note /> {guest.note.length > 60 ? guest.note.slice(0, 60) + "…" : guest.note}
        </div>
      )}
      <div className="g-card-action">
        View profile <Icon.ChevronRight />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function GuestsPage({
  guests = [],
  properties = [],
  isLoading = false,
  error = "",
  onUpdateGuestMeta,
  onRefresh,
}) {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [localGuests, setLocalGuests] = useState(guests);

  useEffect(() => { setLocalGuests(guests); }, [guests]);

  const totalGuests   = localGuests.length;
  const vipCount      = localGuests.filter((g) => g.isVip).length;
  const flaggedCount  = localGuests.filter((g) => g.isBlacklisted).length;
  const repeatCount   = localGuests.filter((g) => g.totalStays >= 2).length;

  const summaries = [
    { label: "Total Guests",   value: totalGuests,  icon: <Icon.Users />,  color: "var(--darkNavyBlue)" },
    { label: "Repeat Guests",  value: repeatCount,  icon: <Icon.Repeat />, color: "var(--steelBlue)" },
    { label: "VIP Guests",     value: vipCount,     icon: <Icon.Star />,   color: "#c97d10" },
    { label: "Flagged",        value: flaggedCount, icon: <Icon.Flag />,   color: "var(--errorRed)" },
  ];

  const filtered = localGuests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase()) ||
      (g.phone || "").includes(search);
    const matchProperty =
      propertyFilter === "All" || (g.properties || []).includes(propertyFilter);
    const matchTag =
      tagFilter === "All" ||
      (tagFilter === "VIP" && g.isVip) ||
      (tagFilter === "Flagged" && g.isBlacklisted) ||
      (tagFilter === "Repeat" && g.totalStays >= 2);
    return matchSearch && matchProperty && matchTag;
  });

  const handleSaveMeta = async (email, meta) => {
    setLocalGuests((prev) =>
      prev.map((g) => g.email === email ? { ...g, ...meta } : g)
    );
    if (selectedGuest?.email === email) {
      setSelectedGuest((prev) => ({ ...prev, ...meta }));
    }
    if (onUpdateGuestMeta) await onUpdateGuestMeta(email, meta);
  };

  return (
    <div className="guests-page">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Guests</h1>
          <p className="page-subtitle">{totalGuests} unique guest{totalGuests !== 1 ? "s" : ""} across all properties</p>
        </div>
        <div className="guests-header-actions">
          <button className="btn-ghost-sm" onClick={() => exportCSV(filtered)}>
            <Icon.Download /> Export CSV
          </button>
          {onRefresh && (
            <button className="btn-primary" onClick={onRefresh}>Refresh</button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="guests-summary">
        {summaries.map((s) => (
          <div className="pay-summary-card" key={s.label}>
            <div className="pay-icon" style={{ background: `${s.color}18`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="pay-label">{s.label}</p>
              <p className="pay-value" style={{ color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="guests-toolbar">
        <div className="guests-toolbar-left">
          <div className="search-box">
            <Icon.Search />
            <input
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="guests-property-select"
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
          >
            <option value="All">All properties</option>
            {properties.map((p) => (
              <option key={p.id || p} value={p.name || p}>{p.name || p}</option>
            ))}
          </select>
        </div>
        <div className="guests-toolbar-right">
          <div className="filter-tabs">
            {["All", "Repeat", "VIP", "Flagged"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${tagFilter === f ? "active" : ""}`}
                onClick={() => setTagFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="view-toggle">
            <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
              <Icon.Grid />
            </button>
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
              <Icon.List />
            </button>
          </div>
        </div>
      </div>

      {error && <div className="empty-state">{error}</div>}
      {isLoading && <div className="empty-state">Loading guests...</div>}

      {/* Grid view */}
      {!isLoading && view === "grid" && (
        <div className="guests-grid">
          {filtered.map((g) => (
            <GuestCard key={g.email} guest={g} onClick={() => setSelectedGuest(g)} />
          ))}
        </div>
      )}

      {/* List view */}
      {!isLoading && view === "list" && (
        <div className="payment-card">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Properties stayed</th>
                <th>Total stays</th>
                <th>Last stay</th>
                <th>Tags</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => {
                const [bg, fg] = avatarColor(g.name);
                return (
                  <tr key={g.email} onClick={() => setSelectedGuest(g)} style={{ cursor: "pointer" }}>
                    <td>
                      <div className="tenant-cell">
                        <div className="tenant-avatar" style={{ background: bg, color: fg }}>
                          {initials(g.name)}
                        </div>
                        <div>
                          <div className="tenant-name">{g.name}</div>
                          <div className="text-muted">{g.email}</div>
                          {g.phone && <div className="text-muted">{g.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">
                      {(g.properties || []).slice(0, 2).join(", ")}
                      {(g.properties || []).length > 2 && ` +${g.properties.length - 2}`}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: "var(--darkNavyBlue)" }}>
                        {g.totalStays}
                      </span>
                    </td>
                    <td className="text-muted">{fmtDate(g.lastStay)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {g.isVip && <span className="g-badge g-badge--vip"><Icon.Star /> VIP</span>}
                        {g.isBlacklisted && <span className="g-badge g-badge--flag"><Icon.Flag /> Flagged</span>}
                        {g.totalStays >= 2 && !g.isVip && !g.isBlacklisted && (
                          <span className="g-badge g-badge--repeat"><Icon.Repeat /> Repeat</span>
                        )}
                      </div>
                    </td>
                    <td className="text-muted" style={{ maxWidth: 180 }}>
                      {g.note ? (
                        <span style={{ fontSize: 12 }}>
                          {g.note.length > 50 ? g.note.slice(0, 50) + "…" : g.note}
                        </span>
                      ) : <span style={{ color: "var(--blueWhite)" }}>—</span>}
                    </td>
                    <td>
                      <button className="row-menu" onClick={(e) => { e.stopPropagation(); setSelectedGuest(g); }}>
                        <Icon.ChevronRight />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state">No guests match your filters.</div>}
        </div>
      )}

      {!isLoading && filtered.length === 0 && !error && (
        <div className="empty-state">No guests found.</div>
      )}

      {/* Side panel */}
      {selectedGuest && (
        <GuestPanel
          guest={selectedGuest}
          properties={properties}
          onClose={() => setSelectedGuest(null)}
          onSave={handleSaveMeta}
        />
      )}
    </div>
  );
}