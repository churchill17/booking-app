/**
 * searchRecommendations.js
 *
 * Scores and ranks fetched property listings based on the user's current
 * search context (nights, adults, children, rooms).
 *
 * Results are computed fresh from already-fetched backend data and are
 * intentionally NOT cached in localStorage — property prices and availability
 * change frequently, so stale cache would mislead users.
 */

/** Score a single property. Higher = better match. */
function scoreProperty(property, { nights, adults, children, rooms }) {
  const rating    = Number(property.avgRating || property.score || 0);
  const current   = Number(property.currentPrice  || property.current_price  || 0);
  const original  = Number(property.originalPrice || property.original_price || current);
  const reviews   = Number(property.reviewCount   || property.total_reviews  || 0);
  const guests    = Math.max(1, adults + children);
  const totalCost = current * Math.max(1, nights) * Math.max(1, rooms);

  let score = 0;

  // Rating carries the most weight (0–10 scale → 0–100 pts)
  score += rating * 10;

  // Value for money: cost per guest per night (lower = better)
  if (current > 0 && totalCost > 0) {
    const perGuestPerNight = totalCost / (guests * Math.max(1, nights));
    // Award up to 30 pts; 5 000 NGN/guest/night earns full 30, scales down above that
    score += Math.max(0, 30 - perGuestPerNight / 5000 * 30);
  }

  // Discount bonus (up to 20 pts)
  if (original > 0 && current > 0 && current < original) {
    const discountFraction = (original - current) / original;
    score += discountFraction * 20;
  }

  // Review volume (trust signal, up to 10 pts)
  score += Math.min(reviews / 50, 10);

  // Amenity richness (up to 5 pts)
  const facilities = [
    ...(Array.isArray(property.popularFacilities) ? property.popularFacilities : []),
    ...(Array.isArray(property.amenities)          ? property.amenities          : []),
  ];
  score += Math.min(facilities.length * 0.5, 5);

  return score;
}

/** Total price for the whole stay. */
export function calcTotalPrice(property, nights, rooms) {
  const perNight = Number(
    property.currentPrice  || property.current_price  ||
    property.originalPrice || property.original_price || 0
  );
  return perNight * Math.max(1, nights) * Math.max(1, rooms);
}

/** Human-readable reason shown on the top-pick card. */
function buildRecommendationReason(property, { nights, adults, children, rooms }) {
  const parts = [];

  const rating = Number(property.avgRating || property.score || 0);
  if      (rating >= 9.0) parts.push("Exceptional rating");
  else if (rating >= 8.5) parts.push("Highly rated");
  else if (rating >= 8.0) parts.push("Great reviews");

  const current  = Number(property.currentPrice  || property.current_price  || 0);
  const original = Number(property.originalPrice || property.original_price || current);
  if (original > 0 && current > 0 && current < original) {
    const pct = Math.round(((original - current) / original) * 100);
    if (pct >= 5) parts.push(`${pct}% off`);
  }

  const allFacilities = [
    ...(Array.isArray(property.popularFacilities) ? property.popularFacilities : []),
    ...(Array.isArray(property.amenities)          ? property.amenities          : []),
  ].map(String);

  if (allFacilities.some(f => /breakfast/i.test(f)))          parts.push("Breakfast included");
  else if (allFacilities.some(f => /wi.?fi|internet/i.test(f))) parts.push("Free WiFi");
  else if (allFacilities.some(f => /pool/i.test(f)))             parts.push("Pool access");

  const nightStr    = `${nights} night${nights    !== 1 ? "s"   : ""}`;
  const adultStr    = `${adults} adult${adults    !== 1 ? "s"   : ""}`;
  const childStr    = children > 0 ? ` · ${children} child${children !== 1 ? "ren" : ""}` : "";
  const roomStr     = rooms    > 1 ? ` · ${rooms} rooms` : "";
  parts.push(`${nightStr} · ${adultStr}${childStr}${roomStr}`);

  return parts.join(" · ");
}

/**
 * Rank an array of properties by recommendation score.
 * Returns a new array (original is not mutated) with two extra fields on each item:
 *   - recommended {boolean}         — true only for the highest-scored property
 *   - recommendationReason {string} — human-readable reason (non-empty only when recommended)
 *   - _totalPrice {number}          — total cost for the stay (used by PropertyCard)
 */
export function rankProperties(properties, searchContext) {
  if (!Array.isArray(properties) || !properties.length) return properties;

  const ctx = {
    nights:   searchContext.nights   ?? 1,
    adults:   searchContext.adults   ?? 1,
    children: searchContext.children ?? 0,
    rooms:    searchContext.rooms    ?? 1,
  };

  const scored = properties.map(p => ({
    ...p,
    _score:      scoreProperty(p, ctx),
    _totalPrice: calcTotalPrice(p, ctx.nights, ctx.rooms),
  }));

  scored.sort((a, b) => b._score - a._score);

  return scored.map((p, i) => ({
    ...p,
    recommended:         i === 0,
    recommendationReason: i === 0 ? buildRecommendationReason(p, ctx) : "",
  }));
}
