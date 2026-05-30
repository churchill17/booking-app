import React, { useMemo } from "react";
import "./AdminHost.css";

const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-US");

function pct(a, b) {
  if (!b || b === 0) return 0;
  return Math.round((a / b) * 100);
}

/**
 * Builds monthly booking counts and revenue from real bookings array.
 */
function buildMonthlyData(bookings) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const counts = Array(12).fill(0);
  const revenue = Array(12).fill(0);

  bookings.forEach((b) => {
    const d = new Date(b.bookingDate || b.checkIn);
    if (!isNaN(d)) {
      counts[d.getMonth()] += 1;
      revenue[d.getMonth()] += Number(b.totalPrice || 0);
    }
  });

  return months.map((label, i) => ({ label, count: counts[i], revenue: revenue[i] }));
}

/**
 * Groups bookings by property and returns top N by booking count.
 */
function topByBookings(bookings, listings, n = 6) {
  const map = {};
  bookings.forEach((b) => {
    const key = b.propertyName || "Unknown";
    if (!map[key]) map[key] = { name: key, count: 0, revenue: 0 };
    map[key].count += 1;
    map[key].revenue += Number(b.totalPrice || 0);
  });

  // Merge with listing data for city info
  const withCity = Object.values(map).map((item) => {
    const listing = listings.find((l) => l.propertyName === item.name);
    return { ...item, city: listing?.city || "" };
  });

  return withCity.sort((a, b) => b.count - a.count).slice(0, n);
}

function Bar({ value, max, color = "#1a3a5c", height = 120 }) {
  const h = max > 0 ? Math.round((value / max) * height) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height, gap: 0 }}>
      <div
        style={{
          width: "100%",
          height: h,
          background: color,
          borderRadius: "3px 3px 0 0",
          minHeight: value > 0 ? 3 : 0,
          transition: "height 0.3s ease",
        }}
      />
    </div>
  );
}

export default function AdminAnalyticsPage({ bookings = [], listings = [], stats = null }) {

  const monthly = useMemo(() => buildMonthlyData(bookings), [bookings]);
  const topProps = useMemo(() => topByBookings(bookings, listings), [bookings, listings]);

  const maxBookings = Math.max(...monthly.map((m) => m.count), 1);
  const maxRevenue  = Math.max(...monthly.map((m) => m.revenue), 1);

  const confirmed  = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled  = bookings.filter((b) => b.status === "cancelled").length;
  const pending    = bookings.filter((b) => b.status === "pending").length;
  const paid       = bookings.filter((b) => b.paymentStatus === "paid").length;
  const totalB     = bookings.length || 1;
  const totalEarnings = Number(stats?.totalEarnings || 0);
  const topCount   = topProps[0]?.count || 1;

  const kpiCards = [
    {
      label: "Confirmation rate",
      value: `${pct(confirmed, totalB)}%`,
      sub: `${confirmed} of ${totalB} bookings confirmed`,
      icon: "ti-circle-check",
      color: "#f0fdf4", iconColor: "#15803d",
    },
    {
      label: "Cancellation rate",
      value: `${pct(cancelled, totalB)}%`,
      sub: `${cancelled} of ${totalB} bookings cancelled`,
      icon: "ti-x",
      color: "#fff0f0", iconColor: "#c0392b",
    },
    {
      label: "Payment conversion",
      value: `${pct(paid, totalB)}%`,
      sub: `${paid} bookings paid`,
      icon: "ti-currency-naira",
      color: "#fefce8", iconColor: "#b45309",
    },
    {
      label: "Total platform revenue",
      value: ngn.format(totalEarnings),
      sub: "From paid bookings",
      icon: "ti-chart-bar",
      color: "#e8f0fe", iconColor: "#1a3a5c",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      <div className="ap-header">
        <div>
          <h1 className="ap-title">Analytics</h1>
          <p className="ap-subtitle">Platform performance from live booking data</p>
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="ap-error" style={{ background: "#fff8e6", borderColor: "#fde68a", color: "#92400e" }}>
          <i className="ti ti-info-circle" style={{ marginRight: 6 }} />
          No booking data yet. Analytics will populate as bookings come in.
        </div>
      )}

      {/* KPI cards */}
      <div className="ap-stat-grid ap-stat-grid--4">
        {kpiCards.map((k) => (
          <div className="ap-stat-card" key={k.label}>
            <div className="ap-stat-icon" style={{ background: k.color }}>
              <i className={`ti ${k.icon}`} style={{ fontSize: 20, color: k.iconColor }} aria-hidden="true" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="ap-stat-label">{k.label}</p>
              <p className="ap-stat-value">{k.value}</p>
              <p style={{ fontSize: 11, color: "#9a9890", marginTop: 1 }}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>

        {/* Monthly bookings bar chart */}
        <div className="ap-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#1a2b40" }}>Monthly bookings</div>
            <div style={{ fontSize: 12, color: "#9a9890", marginTop: 2 }}>Booking count by month</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
            {monthly.map((m, i) => (
              <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Bar value={m.count} max={maxBookings} color="#1a3a5c" height={120} />
                <span style={{ fontSize: 10, color: "#9a9890", marginTop: 4 }}>{m.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 14, borderTop: "1px solid #f0ede8", paddingTop: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9a9890" }}>Total</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1a2b40" }}>{num.format(bookings.length)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9a9890" }}>Confirmed</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#15803d" }}>{num.format(confirmed)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9a9890" }}>Pending</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#b45309" }}>{num.format(pending)}</div>
            </div>
          </div>
        </div>

        {/* Booking status breakdown donut */}
        <div className="ap-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#1a2b40" }}>Booking breakdown</div>
            <div style={{ fontSize: 12, color: "#9a9890", marginTop: 2 }}>Status distribution</div>
          </div>
          <StatusDonut bookings={bookings} />
        </div>
      </div>

      {/* Monthly revenue chart */}
      <div className="ap-card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#1a2b40" }}>Monthly revenue</div>
          <div style={{ fontSize: 12, color: "#9a9890", marginTop: 2 }}>From all bookings by month (NGN)</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
          {monthly.map((m) => (
            <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div title={ngn.format(m.revenue)} style={{ width: "100%", height: maxRevenue > 0 ? Math.round((m.revenue / maxRevenue) * 100) : 0, background: "#4a90d9", borderRadius: "3px 3px 0 0", minHeight: m.revenue > 0 ? 3 : 0, transition: "height 0.3s ease" }} />
              <span style={{ fontSize: 10, color: "#9a9890", marginTop: 4 }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top properties table */}
      <div className="ap-card">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e8e5de" }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#1a2b40" }}>Top properties by bookings</div>
          <div style={{ fontSize: 12, color: "#9a9890", marginTop: 2 }}>Ranked by number of bookings received</div>
        </div>
        {topProps.length === 0 ? (
          <div className="ap-empty"><i className="ti ti-building-off" />No property data yet.</div>
        ) : (
          <div style={{ padding: "12px 0" }}>
            {topProps.map((p, i) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 20px", borderBottom: i < topProps.length - 1 ? "1px solid #f0ede8" : "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: i === 0 ? "#1a3a5c" : "#e8e5de", color: i === 0 ? "#fff" : "#5a5a52", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ap-name" style={{ marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}{p.city ? ` · ${p.city}` : ""}</div>
                  <div style={{ height: 5, background: "#f0ede8", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct(p.count, topCount)}%`, background: "#1a3a5c", borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="ap-bold" style={{ fontSize: 13 }}>{p.count} bookings</div>
                  <div className="ap-muted">{ngn.format(p.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Properties overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <MetricCard label="Total properties" value={num.format(stats?.totalProperties ?? listings.length)} icon="ti-building" />
        <MetricCard label="Approved" value={num.format(stats?.approvedProperties ?? listings.filter(l => l.isApproved).length)} icon="ti-circle-check" iconColor="#15803d" />
        <MetricCard label="Pending approval" value={num.format(stats?.pendingProperties ?? listings.filter(l => !l.isApproved).length)} icon="ti-clock" iconColor="#b45309" />
      </div>

    </div>
  );
}

function MetricCard({ label, value, icon, iconColor = "#1a3a5c" }) {
  return (
    <div className="ap-card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f5f4f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className={`ti ${icon}`} style={{ fontSize: 20, color: iconColor }} aria-hidden="true" />
      </div>
      <div>
        <div className="ap-stat-label">{label}</div>
        <div className="ap-stat-value" style={{ fontSize: 22 }}>{value}</div>
      </div>
    </div>
  );
}

function StatusDonut({ bookings }) {
  const total = bookings.length || 1;
  const confirmed  = bookings.filter((b) => b.status === "confirmed").length;
  const pending    = bookings.filter((b) => b.status === "pending").length;
  const cancelled  = bookings.filter((b) => b.status === "cancelled").length;
  const completed  = bookings.filter((b) => b.status === "completed").length;

  const segments = [
    { label: "Confirmed",  count: confirmed, color: "#15803d" },
    { label: "Pending",    count: pending,   color: "#b45309" },
    { label: "Cancelled",  count: cancelled, color: "#c0392b" },
    { label: "Completed",  count: completed, color: "#1d4ed8" },
  ].filter((s) => s.count > 0);

  // SVG donut — radius 42, cx/cy 60
  const R = 42, CX = 60, CY = 60, STROKE = 14;
  const circ = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        {/* bg track */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f0ede8" strokeWidth={STROKE} />
        {segments.map((s) => {
          const dash = (s.count / total) * circ;
          const gap  = circ - dash;
          const el = (
            <circle
              key={s.label}
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              style={{ transform: "rotate(-90deg)", transformOrigin: `${CX}px ${CY}px` }}
            />
          );
          offset += dash;
          return el;
        })}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1a2b40" fontFamily="inherit">{bookings.length}</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="10" fill="#9a9890" fontFamily="inherit">bookings</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: "#5a5a52" }}>{s.label}</span>
            <span style={{ fontWeight: 600, color: "#1a2b40", marginLeft: "auto", paddingLeft: 8 }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}