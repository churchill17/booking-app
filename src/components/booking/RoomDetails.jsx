import React from "react";
import "./RoomDetails.css";

const RoomDetails = ({ room, addOns }) => {
  const [selected, setSelected] = React.useState({});

  const toggle = (id) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="rd">
      <h2 className="rd__section-title">
        <span className="rd__title-accent">✦</span>
        {room.type}
      </h2>

      <div className="rd__highlights">
        <div className="rd__highlight-item rd__highlight-item--featured">
          <span className="rd__highlight-icon">☕</span>
          <span className="rd__highlight-text">{room.breakfast}</span>
        </div>
        <div className="rd__highlight-item">
          <span className="rd__highlight-score">{room.reviewScore}</span>
          <span className="rd__highlight-label">{room.reviewLabel} · {room.reviewCount} reviews</span>
        </div>
      </div>

      <div className="rd__badges">
        {room.features.map((f) => (
          <div key={f.text} className={`rd__badge ${f.highlight ? "rd__badge--highlight" : ""}`}>
            <span>{f.icon}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>

      <div className="rd__info-grid">
        <div className="rd__info-item">
          <span className="rd__info-icon">👥</span>
          <span>{room.guests}</span>
        </div>
        <div className="rd__info-item">
          <span className="rd__info-icon">🚭</span>
          <span>{room.smoking}</span>
        </div>
        <div className="rd__info-item">
          <span className="rd__info-icon">✨</span>
          <span>{room.cleanliness}</span>
        </div>
      </div>

      {room.genius && (
        <div className="rd__genius">
          <div className="rd__genius-badge">
            <span>★</span> Genius
          </div>
          <div className="rd__genius-body">
            <p className="rd__genius-title">{room.genius.discount}</p>
            <p className="rd__genius-desc">{room.genius.description}</p>
          </div>
        </div>
      )}

      <div className="rd__divider" />

      <h3 className="rd__sub-title">Enhance Your Stay</h3>
      <div className="rd__addons">
        {addOns.map((addon) => (
          <label
            key={addon.id}
            className={`rd__addon ${selected[addon.id] ? "rd__addon--selected" : ""}`}
          >
            <input
              type="checkbox"
              checked={!!selected[addon.id]}
              onChange={() => toggle(addon.id)}
              className="rd__addon-check"
            />
            <span className="rd__addon-icon">{addon.icon}</span>
            <div className="rd__addon-content">
              <span className="rd__addon-title">{addon.title}</span>
              <span className="rd__addon-desc">{addon.description}</span>
            </div>
            <span className="rd__addon-tick">{selected[addon.id] ? "✓" : "+"}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;
