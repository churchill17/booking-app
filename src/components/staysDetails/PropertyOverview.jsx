import React from "react";
import "./PropertyOverview.css";

/** Unwraps arrays, comma strings, or multi-serialised JSON → plain string[]. */
function toPillArray(v, depth = 0) {
  if (!v || depth > 8) return [];
  if (Array.isArray(v)) {
    const out = [];
    for (const item of v) {
      if (typeof item !== "string") continue;
      const t = item.trim();
      if (t.startsWith("[") || t.startsWith('"')) {
        try {
          out.push(...toPillArray(JSON.parse(t), depth + 1));
          continue;
        } catch {
          /* plain */
        }
      }
      if (t) out.push(item);
    }
    return [...new Set(out)];
  }
  if (typeof v === "string") {
    const t = v.trim();
    if (t.startsWith("[") || t.startsWith('"')) {
      try {
        return toPillArray(JSON.parse(t), depth + 1);
      } catch {
        /* fall through */
      }
    }
    return t
      ? t
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  }
  return [];
}

const PillList = ({ items }) => {
  const arr = toPillArray(items);
  if (!arr.length) return null;
  return (
    <div className="property-overview__pill-list">
      {arr.map((item, i) => (
        <span key={item + i} className="property-overview__pill">
          {item}
        </span>
      ))}
    </div>
  );
};

const DescBlock = ({ label, value }) => {
  const arr = toPillArray(value);
  if (!arr.length) return null;
  return (
    <div className="property-overview__desc-block">
      <strong className="property-overview__desc-label">{label}</strong>
      <PillList items={arr} />
    </div>
  );
};

const CardPreviewBanner = ({ card, onReserve }) => {
  if (!card) return null;
  return (
    <div className="card-preview-banner">
      {card.image && (
        <img
          src={card.image}
          alt={card.name}
          className="card-preview-banner__img"
        />
      )}
      <div className="card-preview-banner__body">
        <div className="card-preview-banner__top">
          <div>
            <span className="card-preview-banner__name">{card.name}</span>
            {card.cityLabel && (
              <span className="card-preview-banner__location">
                📍 {card.cityLabel}
              </span>
            )}
          </div>
          {card.score > 0 && (
            <div className="card-preview-banner__score-wrap">
              <span className="card-preview-banner__score">
                {Number(card.score).toFixed(1)}
              </span>
              {card.ratingLabel && (
                <span className="card-preview-banner__rating-label">
                  {card.ratingLabel}
                </span>
              )}
              {card.reviewCount > 0 && (
                <span className="card-preview-banner__reviews">
                  {card.reviewCount.toLocaleString()} reviews
                </span>
              )}
            </div>
          )}
        </div>

        <div className="card-preview-banner__mid">
          {card.dealText && (
            <span className="card-preview-banner__deal">{card.dealText}</span>
          )}
          {card.roomName && (
            <span className="card-preview-banner__room">{card.roomName}</span>
          )}
          {(card.bedType || card.roomSize) && (
            <span className="card-preview-banner__room-meta">
              {card.bedType && `🛏 ${card.bedType}`}
              {card.bedType && card.roomSize && " · "}
              {card.roomSize && `📐 ${card.roomSize}`}
            </span>
          )}
          {card.perks && card.perks.length > 0 && (
            <ul className="card-preview-banner__perks">
              {card.perks.map((p) => (
                <li key={p} className="card-preview-banner__perk">
                  ✓ {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-preview-banner__bottom">
          <div className="card-preview-banner__context">
            {card.nights} night{card.nights !== 1 ? "s" : ""}, {card.adults}{" "}
            adult{card.adults !== 1 ? "s" : ""}
            {card.children > 0
              ? `, ${card.children} child${card.children !== 1 ? "ren" : ""}`
              : ""}
          </div>
          {card.strikePrice && (
            <span className="card-preview-banner__strike">
              {card.strikePrice}
            </span>
          )}
          <span className="card-preview-banner__price">
            {card.displayPrice}{" "}
            <span className="card-preview-banner__per-night">/ night</span>
          </span>
          {card.displayTotal && card.nights > 1 && (
            <span className="card-preview-banner__total">
              {card.displayTotal} total
            </span>
          )}
          <span className="card-preview-banner__tax">{card.taxNote}</span>
        </div>
      </div>

      <div className="card-preview-banner__reserve">
        <button
          type="button"
          className="card-preview-banner__reserve-btn"
          onClick={onReserve}
        >
          Reserve
        </button>
      </div>
    </div>
  );
};

const PropertyOverview = ({
  accommodations,
  dining,
  location,
  highlights = [],
  popularFacilities = [],
  coupleLocationScore,
  cardPreview,
  onCardReserve,
  contactEmail = "",
  contactPhone = "",
}) => {
  return (
    <div className="property-overview-wrapper">
      <CardPreviewBanner card={cardPreview} onReserve={onCardReserve} />

      <section className="property-overview">
        <div className="property-overview__main">
          <h2 className="property-overview__section-title">
            About this property
          </h2>

          <div className="property-overview__desc">
            <DescBlock
              label="Comfortable Accommodations"
              value={accommodations}
            />
            <DescBlock label="Dining Experience" value={dining} />
            <DescBlock label="Prime Location" value={location} />
            {coupleLocationScore > 0 && (
              <p className="property-overview__couple-note">
                Couples particularly like the location — they rated it{" "}
                <strong>{coupleLocationScore}</strong> for a two-person trip.
              </p>
            )}
          </div>

          <div className="property-overview__facilities">
            <h3 className="property-overview__sub-title">
              Most popular facilities
            </h3>
            <div className="property-overview__facility-tags">
              {popularFacilities.map((f) => (
                <span key={f} className="property-overview__tag">
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="property-overview__highlights">
          <h3 className="property-overview__sub-title">Property highlights</h3>
          <p className="property-overview__perfect">
            Perfect for a 1-night stay!
          </p>
          {highlights.map((h, i) => (
            <div key={i} className="property-overview__highlight-item">
              <span className="property-overview__highlight-icon">
                {h.icon}
              </span>
              <span>{h.text}</span>
            </div>
          ))}

          <div className="property-overview__cta-box">
            <button
              className="btn-reserve-full"
              onClick={() =>
                document
                  .getElementById("info-prices")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Reserve
            </button>
          </div>

          {(contactEmail || contactPhone) && (
            <div className="property-overview__contact">
              <h4 className="property-overview__contact-title">
                Contact Property
              </h4>
              {contactEmail && (
                <p className="property-overview__contact-item">
                  ✉ <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </p>
              )}
              {contactPhone && (
                <p className="property-overview__contact-item">
                  📞 <a href={`tel:${contactPhone}`}>{contactPhone}</a>
                </p>
              )}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
};

export default PropertyOverview;
