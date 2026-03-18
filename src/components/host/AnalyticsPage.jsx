import React, { useState } from "react";
import "./AnalyticsPage.css";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenueData = [42, 58, 48, 72, 65, 80, 90, 75, 85, 95, 78, 88];
const occupancyData = [78, 80, 75, 85, 82, 88, 92, 89, 91, 87, 90, 94];

const kpis = [
  { label: "Avg. Rent/Property", value: "$3,240", change: "+8.2%", up: true },
  { label: "Vacancy Rate", value: "10.6%", change: "-2.1%", up: true },
  { label: "Maintenance Costs", value: "$12,480", change: "+3.4%", up: false },
  { label: "Net Operating Income", value: "$198,200", change: "+14.7%", up: true },
];

const propertyPerf = [
  { name: "Saints Lawrence", revenue: 28400, target: 30000 },
  { name: "Gundi Mani", revenue: 21200, target: 22000 },
  { name: "Homexyde", revenue: 17800, target: 20000 },
  { name: "Sanbruto Saburo", revenue: 14600, target: 18000 },
  { name: "Plaza Verde", revenue: 11200, target: 12000 },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("revenue");
  const data = activeTab === "revenue" ? revenueData : occupancyData;
  const maxVal = Math.max(...data);

  return (
    <div className="analytics-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Performance overview & property insights</p>
        </div>
        <select className="period-select">
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="kpi-row">
        {kpis.map((k, i) => (
          <div className="kpi-card" key={i}>
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value">{k.value}</p>
            <span className={`kpi-change ${k.up ? "kpi-up" : "kpi-down"}`}>
              {k.up ? "↑" : "↓"} {k.change}
            </span>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        <div className="analytics-card analytics-card--wide">
          <div className="card-header">
            <h2 className="card-title">Performance Trend</h2>
            <div className="tab-pills">
              <button className={activeTab === "revenue" ? "tab-pill active" : "tab-pill"} onClick={() => setActiveTab("revenue")}>Revenue</button>
              <button className={activeTab === "occupancy" ? "tab-pill active" : "tab-pill"} onClick={() => setActiveTab("occupancy")}>Occupancy</button>
            </div>
          </div>
          <div className="bar-chart">
            {data.map((val, i) => (
              <div className="bar-col" key={i}>
                <div className="bar-wrap">
                  <div
                    className="bar-fill"
                    style={{ height: `${(val / maxVal) * 100}%` }}
                    title={activeTab === "revenue" ? `$${val}k` : `${val}%`}
                  />
                </div>
                <span className="bar-label">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h2 className="card-title">Occupancy Breakdown</h2>
          </div>
          <div className="donut-container">
            <svg viewBox="0 0 120 120" className="donut-svg">
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--lightBeige)" strokeWidth="14" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--teal)" strokeWidth="14"
                strokeDasharray={`${0.894 * 301.6} ${301.6}`}
                strokeDashoffset="75" strokeLinecap="round" />
              <text x="60" y="58" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--midnightBlue)" fontFamily="Playfair Display">89.4%</text>
              <text x="60" y="72" textAnchor="middle" fontSize="8" fill="var(--warmGray)" fontFamily="DM Sans">Occupied</text>
            </svg>
          </div>
          <div className="donut-legend">
            <div className="legend-item"><span className="legend-dot" style={{ background: "var(--teal)" }} />Occupied (89.4%)</div>
            <div className="legend-item"><span className="legend-dot" style={{ background: "var(--lightBeige)" }} />Vacant (10.6%)</div>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="card-header">
          <h2 className="card-title">Property Performance vs Target</h2>
        </div>
        <div className="perf-table">
          {propertyPerf.map((p, i) => (
            <div className="perf-row" key={i}>
              <span className="perf-name">{p.name}</span>
              <div className="perf-bars">
                <div className="perf-bar-wrap">
                  <div className="perf-bar-actual" style={{ width: `${(p.revenue / 32000) * 100}%` }} />
                </div>
                <div className="perf-bar-wrap perf-bar-target-wrap">
                  <div className="perf-bar-target" style={{ width: `${(p.target / 32000) * 100}%` }} />
                </div>
              </div>
              <span className="perf-pct">{Math.round((p.revenue / p.target) * 100)}%</span>
              <span className="perf-rev">${(p.revenue / 1000).toFixed(1)}k</span>
            </div>
          ))}
          <div className="perf-legend">
            <span><span className="legend-dot" style={{ background: "var(--teal)" }} />Actual</span>
            <span><span className="legend-dot" style={{ background: "var(--lightBeige)" }} />Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}
