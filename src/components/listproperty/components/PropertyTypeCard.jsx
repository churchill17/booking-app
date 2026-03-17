import { useState } from "react";
import { C } from "../ui.constants.js";
import { PrimaryBtn } from "../ui.jsx";
import "./PropertyTypeCard.css";

const PROP_TYPES = [
  {
    id: "apartment",
    icon: "🏢",
    title: "Apartment",
    desc: "Furnished and self-catering accommodation, where guests rent the entire place.",
    badge: "Quick start",
  },
  {
    id: "home",
    icon: "🏠",
    title: "Homes",
    desc: "Properties like apartments, holiday homes, villas, etc.",
  },
  {
    id: "hotel",
    icon: "🏨",
    title: "Hotel, B&Bs, and more",
    desc: "Properties like hotels, B&Bs, guest houses, hostels, aparthotels, etc.",
  },
  {
    id: "alt",
    icon: "⛺",
    title: "Alternative places",
    desc: "Properties like boats, campsites, luxury tents, etc.",
  },
];

export default function PropertyTypeCard({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="lp-type-page">
      <div className="lp-type-page__inner">
        <div className="lp-type-page__heading">
          <h1>List your property and start welcoming guests in no time!</h1>
          <p>To get started, choose the type of property you want to list.</p>
        </div>

        <div className="lp-type-page__grid">
          {PROP_TYPES.map((t, i) => (
            <div
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`lp-type-card${selected === t.id ? " lp-type-card--selected" : ""}`}
              style={{ animation: `fadeSlideUp 0.4s ${i * 0.06}s both` }}
            >
              {t.badge && (
                <div className="lp-type-card__badge">⚡ {t.badge}</div>
              )}
              <div className="lp-type-card__icon">{t.icon}</div>
              <h3 className="lp-type-card__title">{t.title}</h3>
              <p className="lp-type-card__desc">{t.desc}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(t.id);
                }}
                className={`lp-type-card__btn${selected === t.id ? " lp-type-card__btn--selected" : ""}`}
              >
                List your property
              </button>
            </div>
          ))}
        </div>

        {selected && (
          <div className="lp-type-page__continue">
            <PrimaryBtn
              onClick={() => onSelect(selected)}
              style={{
                padding: "var(--lp-continue-btn-padding, 15px 48px)",
                fontSize: "var(--lp-continue-btn-font-size, 16px)",
              }}
            >
              Continue with {PROP_TYPES.find((t) => t.id === selected)?.title} →
            </PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}
