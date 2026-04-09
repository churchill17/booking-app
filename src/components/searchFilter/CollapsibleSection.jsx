import { useState } from "react";

import "./CollapsibleSection.css";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: 0 }}>
      <div
        className="search-filter-filter-section-title search-filter-section-toggle"
        onClick={() => setOpen((o) => !o)}
        style={{ marginBottom: open ? 14 : 0 }}
      >
        {title}
        <span className={`search-filter-section-toggle-icon ${open ? "open" : ""}`}>
          {open ? "▲" : "▼"}
        </span>
      </div>
      <div className="search-filter-collapsible" style={{ maxHeight: open ? 600 : 0 }}>
        {children}
      </div>
    </div>
  );
}
