import React, { useState } from "react";
import "./PaymentPage.css";

const transactions = [
  { id: "TXN-00124", tenant: "Alex Morrison", property: "Saints Lawrence", amount: 2334, date: "23/07/2022", method: "Bank Transfer", status: "Completed" },
  { id: "TXN-00123", tenant: "Jamie Liu", property: "Sanbruto Saburo", amount: 5699, date: "02/11/2022", method: "Credit Card", status: "Failed" },
  { id: "TXN-00122", tenant: "Chris Park", property: "Homexyde", amount: 7334, date: "12/12/2022", method: "Online Transfer", status: "Completed" },
  { id: "TXN-00121", tenant: "Dana Rivera", property: "Gundi Mani", amount: 10334, date: "10/12/2022", method: "Bank Transfer", status: "Completed" },
  { id: "TXN-00120", tenant: "Sam Kim", property: "Homexyde", amount: 454, date: "08/12/2022", method: "Cash", status: "Pending" },
  { id: "TXN-00119", tenant: "Jordan Blake", property: "Plaza Verde", amount: 3210, date: "05/01/2023", method: "Credit Card", status: "Completed" },
  { id: "TXN-00118", tenant: "Taylor West", property: "Westridge Flats", amount: 6780, date: "18/01/2023", method: "Bank Transfer", status: "Completed" },
];

const summaries = [
  { label: "Total Collected", value: "$284,540", icon: "💵", color: "var(--teal)" },
  { label: "Pending", value: "$12,480", icon: "⏳", color: "#c97d10" },
  { label: "Failed", value: "$5,699", icon: "❌", color: "var(--errorRed)" },
  { label: "This Month", value: "$48,200", icon: "📅", color: "var(--midnightBlue)" },
];

export default function PaymentPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter(t => {
    const matchFilter = filter === "All" || t.status === filter;
    const matchSearch = t.tenant.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="payment-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Payment</h1>
          <p className="page-subtitle">Track and manage all rent payments</p>
        </div>
        <button className="btn-primary">+ Record Payment</button>
      </div>

      <div className="payment-summary">
        {summaries.map((s, i) => (
          <div className="pay-summary-card" key={i}>
            <div className="pay-icon" style={{ background: `${s.color}18` }}>
              <span>{s.icon}</span>
            </div>
            <div>
              <p className="pay-label">{s.label}</p>
              <p className="pay-value" style={{ color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-card">
        <div className="payment-toolbar">
          <div className="search-box">
            <span>🔍</span>
            <input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {["All", "Completed", "Pending", "Failed"].map(f => (
              <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <table className="payment-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Tenant</th>
              <th>Property</th>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={i}>
                <td className="txn-id">{t.id}</td>
                <td className="tenant-cell">
                  <div className="tenant-avatar">{t.tenant[0]}</div>
                  {t.tenant}
                </td>
                <td>{t.property}</td>
                <td className="text-muted">{t.date}</td>
                <td>
                  <span className="method-badge">{t.method}</span>
                </td>
                <td className="amount-cell">${t.amount.toLocaleString()}</td>
                <td><PayStatusBadge status={t.status} /></td>
                <td>
                  <button className="row-action">↓ Receipt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state">No transactions found.</div>}
      </div>
    </div>
  );
}

function PayStatusBadge({ status }) {
  const styles = {
    Completed: { bg: "var(--successLight)", color: "#0a8c6b" },
    Failed: { bg: "var(--errorLight)", color: "var(--errorRed)" },
    Pending: { bg: "#fff8e6", color: "#c97d10" },
  }[status] || {};
  return (
    <span className="pay-status" style={{ background: styles.bg, color: styles.color }}>
      ● {status}
    </span>
  );
}
