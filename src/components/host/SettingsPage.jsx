import React, { useState } from "react";
import "./SettingsPage.css";

const tabs = ["Profile", "Notifications", "Security", "Appearance", "Billing"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="settings-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences</p>
        </div>
        {saved && <div className="save-toast">✅ Changes saved successfully!</div>}
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`settings-tab ${activeTab === tab ? "settings-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabIcon(tab)} {tab}
            </button>
          ))}
        </aside>

        <div className="settings-content">
          {activeTab === "Profile" && <ProfileSettings onSave={handleSave} />}
          {activeTab === "Notifications" && <NotificationSettings onSave={handleSave} />}
          {activeTab === "Security" && <SecuritySettings onSave={handleSave} />}
          {activeTab === "Appearance" && <AppearanceSettings onSave={handleSave} />}
          {activeTab === "Billing" && <BillingSettings onSave={handleSave} />}
        </div>
      </div>
    </div>
  );
}

function tabIcon(tab) {
  return { Profile: "👤", Notifications: "🔔", Security: "🔒", Appearance: "🎨", Billing: "💳" }[tab];
}

function ProfileSettings({ onSave }) {
  const [form, setForm] = useState({ firstName: "Banrisk", lastName: "Ade", email: "banrisk@vinjham.com", phone: "+234 800 000 0000", role: "Property Manager", bio: "Senior property manager with 8+ years of experience." });

  return (
    <div className="settings-panel">
      <h2 className="panel-title">Profile Information</h2>
      <p className="panel-desc">Update your personal details and public profile.</p>

      <div className="avatar-section">
        <div className="profile-avatar">B</div>
        <div>
          <button className="btn-outline">Change Photo</button>
          <p className="avatar-hint">JPG, PNG, max 2MB</p>
        </div>
      </div>

      <div className="form-grid">
        <FormField label="First Name" value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} />
        <FormField label="Last Name" value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} />
        <FormField label="Email Address" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" />
        <FormField label="Phone Number" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
        <FormField label="Role" value={form.role} onChange={v => setForm({ ...form, role: v })} />
      </div>
      <div className="form-field form-field--full">
        <label className="field-label">Bio</label>
        <textarea className="field-textarea" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
      </div>
      <div className="panel-actions">
        <button className="btn-ghost-sm">Discard</button>
        <button className="btn-primary-sm" onClick={onSave}>Save Changes</button>
      </div>
    </div>
  );
}

function NotificationSettings({ onSave }) {
  const [settings, setSettings] = useState({
    paymentReceived: true,
    newTenant: true,
    maintenanceRequest: false,
    leaseExpiry: true,
    weeklyReport: false,
    marketingEmails: false,
  });

  const toggle = key => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const notifs = [
    { key: "paymentReceived", label: "Payment Received", desc: "Get notified when a tenant makes a payment." },
    { key: "newTenant", label: "New Tenant Added", desc: "Alert when a new tenant is registered." },
    { key: "maintenanceRequest", label: "Maintenance Requests", desc: "Receive alerts for new maintenance tickets." },
    { key: "leaseExpiry", label: "Lease Expiry Reminders", desc: "Reminders 30 days before lease ends." },
    { key: "weeklyReport", label: "Weekly Summary Report", desc: "A weekly digest of all property activity." },
    { key: "marketingEmails", label: "Marketing & Updates", desc: "News and feature updates from Vinjham." },
  ];

  return (
    <div className="settings-panel">
      <h2 className="panel-title">Notifications</h2>
      <p className="panel-desc">Choose what you want to be notified about.</p>
      <div className="notif-list">
        {notifs.map(n => (
          <div className="notif-row" key={n.key}>
            <div>
              <p className="notif-label">{n.label}</p>
              <p className="notif-desc">{n.desc}</p>
            </div>
            <button
              className={`toggle-btn ${settings[n.key] ? "toggle-btn--on" : ""}`}
              onClick={() => toggle(n.key)}
            >
              <span className="toggle-knob" />
            </button>
          </div>
        ))}
      </div>
      <div className="panel-actions">
        <button className="btn-primary-sm" onClick={onSave}>Save Preferences</button>
      </div>
    </div>
  );
}

function SecuritySettings({ onSave }) {
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [twoFA, setTwoFA] = useState(true);
  const [sessions] = useState([
    { device: "Chrome on macOS", location: "Lagos, Nigeria", time: "Active now", current: true },
    { device: "Safari on iPhone", location: "Abuja, Nigeria", time: "2 days ago", current: false },
    { device: "Firefox on Windows", location: "London, UK", time: "1 week ago", current: false },
  ]);

  return (
    <div className="settings-panel">
      <h2 className="panel-title">Security</h2>
      <p className="panel-desc">Manage your password and account security.</p>

      <div className="section-block">
        <h3 className="section-subtitle">Change Password</h3>
        <div className="form-grid">
          <FormField label="Current Password" value={form.current} onChange={v => setForm({ ...form, current: v })} type="password" />
          <FormField label="New Password" value={form.newPw} onChange={v => setForm({ ...form, newPw: v })} type="password" />
          <FormField label="Confirm New Password" value={form.confirm} onChange={v => setForm({ ...form, confirm: v })} type="password" />
        </div>
      </div>

      <div className="section-block">
        <div className="twofa-row">
          <div>
            <h3 className="section-subtitle">Two-Factor Authentication</h3>
            <p className="notif-desc">Add an extra layer of security to your account.</p>
          </div>
          <button className={`toggle-btn ${twoFA ? "toggle-btn--on" : ""}`} onClick={() => setTwoFA(!twoFA)}>
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-subtitle">Active Sessions</h3>
        <div className="sessions-list">
          {sessions.map((s, i) => (
            <div className="session-row" key={i}>
              <div className="session-icon">💻</div>
              <div className="session-info">
                <p className="session-device">{s.device} {s.current && <span className="current-tag">Current</span>}</p>
                <p className="session-meta">{s.location} · {s.time}</p>
              </div>
              {!s.current && <button className="btn-danger-sm">Revoke</button>}
            </div>
          ))}
        </div>
      </div>

      <div className="panel-actions">
        <button className="btn-primary-sm" onClick={onSave}>Update Security</button>
      </div>
    </div>
  );
}

function AppearanceSettings({ onSave }) {
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("teal");
  const [density, setDensity] = useState("comfortable");

  const accents = [
    { key: "teal", color: "#19907e" },
    { key: "blue", color: "#3b82f6" },
    { key: "purple", color: "#8b5cf6" },
    { key: "orange", color: "#f97316" },
    { key: "rose", color: "#f43f5e" },
  ];

  return (
    <div className="settings-panel">
      <h2 className="panel-title">Appearance</h2>
      <p className="panel-desc">Customize how Vinjham looks for you.</p>

      <div className="section-block">
        <h3 className="section-subtitle">Theme</h3>
        <div className="theme-options">
          {["light", "dark", "system"].map(t => (
            <button key={t} className={`theme-option ${theme === t ? "theme-option--active" : ""}`} onClick={() => setTheme(t)}>
              <span className="theme-preview" data-theme={t}>
                {t === "light" && "☀️"}
                {t === "dark" && "🌙"}
                {t === "system" && "💻"}
              </span>
              <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-subtitle">Accent Color</h3>
        <div className="accent-options">
          {accents.map(a => (
            <button
              key={a.key}
              className={`accent-swatch ${accent === a.key ? "accent-swatch--active" : ""}`}
              style={{ background: a.color }}
              onClick={() => setAccent(a.key)}
              title={a.key}
            />
          ))}
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-subtitle">Display Density</h3>
        <div className="density-options">
          {["compact", "comfortable", "spacious"].map(d => (
            <button key={d} className={`density-opt ${density === d ? "density-opt--active" : ""}`} onClick={() => setDensity(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-actions">
        <button className="btn-primary-sm" onClick={onSave}>Save Appearance</button>
      </div>
    </div>
  );
}

function BillingSettings({ onSave }) {
  const [plan] = useState("Pro");
  const invoices = [
    { date: "Mar 1, 2024", amount: "$49.00", status: "Paid", period: "March 2024" },
    { date: "Feb 1, 2024", amount: "$49.00", status: "Paid", period: "February 2024" },
    { date: "Jan 1, 2024", amount: "$49.00", status: "Paid", period: "January 2024" },
  ];

  return (
    <div className="settings-panel">
      <h2 className="panel-title">Billing & Subscription</h2>
      <p className="panel-desc">Manage your plan and payment methods.</p>

      <div className="plan-card">
        <div className="plan-info">
          <span className="plan-badge">⚡ {plan} Plan</span>
          <p className="plan-price">$49<span>/month</span></p>
          <p className="plan-renew">Renews on April 1, 2024</p>
        </div>
        <div className="plan-features">
          <p>✅ Unlimited properties</p>
          <p>✅ Advanced analytics</p>
          <p>✅ Priority support</p>
          <p>✅ API access</p>
        </div>
        <button className="btn-outline">Upgrade Plan</button>
      </div>

      <div className="section-block">
        <h3 className="section-subtitle">Payment Method</h3>
        <div className="payment-method">
          <div className="card-icon">💳</div>
          <div>
            <p className="card-name">Visa ending in 4242</p>
            <p className="card-exp">Expires 08/2026</p>
          </div>
          <button className="btn-outline">Update</button>
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-subtitle">Invoice History</h3>
        <div className="invoice-list">
          {invoices.map((inv, i) => (
            <div className="invoice-row" key={i}>
              <div>
                <p className="inv-period">{inv.period}</p>
                <p className="inv-date">{inv.date}</p>
              </div>
              <span className="inv-amount">{inv.amount}</span>
              <span className="inv-status">✅ {inv.status}</span>
              <button className="btn-ghost-sm">↓ PDF</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text" }) {
  return (
    <div className="form-field">
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
