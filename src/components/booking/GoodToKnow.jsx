import React from "react";
import "./GoodToKnow.css";

const GoodToKnow = ({ points }) => {
  return (
    <div className="gtk">
      <h3 className="gtk__title">
        <span className="gtk__title-icon">💡</span>
        Good to Know
      </h3>
      <ul className="gtk__list">
        {points.map((point, i) => (
          <li key={i} className={`gtk__item ${point.type === "warn" ? "gtk__item--warn" : "gtk__item--ok"}`}>
            <span className="gtk__item-icon">
              {point.type === "warn" ? "⏱" : "✓"}
            </span>
            <span>{point.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoodToKnow;
