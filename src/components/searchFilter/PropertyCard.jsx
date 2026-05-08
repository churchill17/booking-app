import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadSearch } from "../../utils/searchStorage";
import Stars from "./Stars";
import "./PropertyCard.css";

function getRatingLabel(score) {
  const n = Number(score);
  if (!n) return "";
  if (n >= 9.0) return "Exceptional";
  if (n >= 8.5) return "Superb";
  if (n >= 8.0) return "Very Good";
  if (n >= 7.0) return "Good";
  if (n >= 6.0) return "Pleasant";
  return "Review score";
}

function fmtPrice(amount, currency = "NGN") {
  const n = Number(amount);
  if (!n) return "";
  return `${currency} ${n.toLocaleString()}`;
}

export default function PropertyCard({ property, index = 0, recommended = false, recommendationReason = "" }) {
  const [wished, setWished] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ── Search context from URL (falls back to saved search) ───────
  const src      = new URLSearchParams(location.search);
  const saved    = loadSearch();
  const adults   = parseInt(src.get("adults"),   10) || saved?.adults   || 1;
  const children = parseInt(src.get("children"), 10) || saved?.children || 0;
  const roomsVal = parseInt(src.get("rooms"),    10) || saved?.rooms    || 1;
  const checkIn  = src.get("checkIn");
  const checkOut = src.get("checkOut");
  const nights   = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 1;

  const goToProperty = () => {
    const fwd = new URLSearchParams();
    ["checkIn", "checkOut", "adults", "children", "rooms"].forEach((k) => {
      if (src.get(k)) fwd.set(k, src.get(k));
    });
    navigate(`/stays/${property.id}?${fwd.toString()}`);
  };

  // ── Pricing ──────────────────────────────────────────────────
  const currency      = property.currency || "NGN";
  const originalPrice = Number(property.originalPrice || property.original_price || 0);
  const currentPrice  = Number(property.currentPrice  || property.current_price  || originalPrice);
  const hasDiscount   = originalPrice > 0 && currentPrice > 0 && currentPrice < originalPrice;
  const displayPrice  = fmtPrice(currentPrice || originalPrice, currency);
  const strikePrice   = hasDiscount ? fmtPrice(originalPrice, currency) : "";
  const taxNote       = property.taxesIncluded
    ? "Includes taxes and charges"
    : "Excludes taxes and charges";
  // Total for entire stay: ranking engine may have pre-computed this as _totalPrice
  const totalStay     = property._totalPrice || (currentPrice || originalPrice) * nights * roomsVal;
  const displayTotal  = totalStay > 0 ? fmtPrice(totalStay, currency) : "";

  // ── Rating ───────────────────────────────────────────────────
  const score       = property.avgRating || property.score || 0;
  const ratingLabel = property.ratingLabel || getRatingLabel(score);
  const reviewCount = property.reviewCount || 0;

  // ── Location ─────────────────────────────────────────────────
  const cityLabel = [property.city, property.country].filter(Boolean).join(", ");
  const image     = property.mainImage || property.image || "";

  // ── First room ───────────────────────────────────────────────
  const room     = (property.rooms || [])[0] || {};
  const roomName = room.name || property.roomType || "";
  const bedType  = room.bedType || room.bed_type || "";
  const roomSize = room.size || "";
  const urgency  = room.availability || property.availability || "";
  const dealText = room.deal || (property.lastMinuteBookings ? "Last Minute Deal" : "");

  // ── Perks ────────────────────────────────────────────────────
  const allPerks = [
    ...(Array.isArray(property.amenities)         ? property.amenities         : []),
    ...(Array.isArray(property.popularFacilities) ? property.popularFacilities : []),
  ].map(String);

  const hasBreakfast      = allPerks.some(p => /breakfast/i.test(p));
  const hasFreeCancellation = allPerks.some(p => /free.cancel|cancel.*free/i.test(p));
  const hasNoPrepayment   = allPerks.some(p => /no.prepay|pay.*property|pay at/i.test(p));
  const hasFreePark       = allPerks.some(p => /free.park/i.test(p));
  const hasPool           = allPerks.some(p => /pool/i.test(p));
  const hasWifi           = allPerks.some(p => /wi.?fi|internet/i.test(p));
  const hasSpa            = allPerks.some(p => /\bspa\b/i.test(p));

  const perks = [
    hasBreakfast        && "Breakfast included",
    hasFreeCancellation && "Free cancellation",
    hasNoPrepayment     && "No prepayment needed – pay at the property",
    hasFreePark         && "Free parking",
    hasPool             && "Swimming pool",
    hasWifi             && "Free WiFi",
    hasSpa              && "Spa",
  ].filter(Boolean).slice(0, 5);

  return (
    <div
      className={`pc${recommended ? " pc--recommended" : ""}`}
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={goToProperty}
    >
      {/* ── Recommended banner (top pick only) ── */}
      {recommended && (
        <div className="pc__rec-banner">
          <span className="pc__rec-icon">★</span>
          Our top pick for your search
        </div>
      )}

      {/* ── Image ── */}
      <div className="pc__img-wrap">
        {image ? (
          <img src={image} alt={property.name} className="pc__img" />
        ) : (
          <div className="pc__img-placeholder">🏨</div>
        )}
        <button
          className={`pc__wish ${wished ? "pc__wish--active" : ""}`}
          onClick={(e) => { e.stopPropagation(); setWished(w => !w); }}
          title="Save to wishlist"
        >
          {wished ? "♥" : "♡"}
        </button>
      </div>

      {/* ── Body ── */}
      <div className="pc__body">

        {/* Top: name + score */}
        <div className="pc__top">
          <div className="pc__name-wrap">
            <span className="pc__name">{property.name || property.propertyName}</span>
            <Stars count={property.stars} />
            <div className="pc__location">📍 {cityLabel}</div>
          </div>
          {score > 0 && (
            <div className="pc__score-wrap">
              <span className="pc__score">{Number(score).toFixed(1)}</span>
              {ratingLabel && <span className="pc__rating-label">{ratingLabel}</span>}
              {reviewCount > 0 && (
                <span className="pc__reviews">{reviewCount.toLocaleString()} reviews</span>
              )}
            </div>
          )}
        </div>

        {/* Mid: deal + room + perks + urgency */}
        <div className="pc__mid">
          {dealText && <span className="pc__deal-badge">{dealText}</span>}

          {roomName && <div className="pc__room-name">{roomName}</div>}

          {(bedType || roomSize) && (
            <div className="pc__room-meta">
              {bedType   && <span>🛏 {bedType}</span>}
              {roomSize  && <span>📐 {roomSize}</span>}
            </div>
          )}

          {perks.length > 0 && (
            <ul className="pc__perks">
              {perks.map(p => <li key={p} className="pc__perk">✓ {p}</li>)}
            </ul>
          )}

          {recommendationReason && (
            <div className="pc__rec-reason">{recommendationReason}</div>
          )}

          {urgency && <div className="pc__urgency">🔥 {urgency}</div>}
        </div>

        {/* Bottom: price + button */}
        <div className="pc__bottom">
          <div className="pc__price-section">
            <div className="pc__context">
              {nights} night{nights !== 1 ? "s" : ""}, {adults} adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}
            </div>
            {strikePrice && <div className="pc__original-price">{strikePrice}</div>}
            <div className="pc__current-price">{displayPrice} <span className="pc__per-night">/ night</span></div>
            {displayTotal && nights > 1 && (
              <div className="pc__total-price">{displayTotal} total</div>
            )}
            <div className="pc__taxes">{taxNote}</div>
          </div>
          <button
            className="pc__avail-btn"
            onClick={(e) => { e.stopPropagation(); goToProperty(); }}
          >
            See availability →
          </button>
        </div>

      </div>
    </div>
  );
}
