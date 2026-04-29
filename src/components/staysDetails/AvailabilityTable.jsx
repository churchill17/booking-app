import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadSearch } from "../../utils/searchStorage";
import "./AvailabilityTable.css";

const formatPrice = (price, currency) => {
  if (!price && price !== 0) return "";
  const num = Number(price);
  if (isNaN(num) || num === 0) return "";
  return `${currency || "NGN"} ${num.toLocaleString()}`;
};

const AvailabilityTable = ({
  rooms,
  taxesIncluded,
  currency = "NGN",
  propertyId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const reserveRoom = (roomId) => {
    console.log("roomId:", roomId, typeof roomId);
    const src = new URLSearchParams(location.search);
    const saved = loadSearch();
    const fwd = new URLSearchParams();

    // URL params take priority; fall back to localStorage saved search
    const checkIn = src.get("checkIn") ||
      (saved?.checkIn instanceof Date ? saved.checkIn.toISOString() : saved?.checkIn) || "";
    const checkOut = src.get("checkOut") ||
      (saved?.checkOut instanceof Date ? saved.checkOut.toISOString() : saved?.checkOut) || "";
    const adults = src.get("adults") || saved?.adults || "1";
    const children = src.get("children") || saved?.children || "0";
    const rooms = src.get("rooms") || saved?.rooms || "1";

    if (checkIn) fwd.set("checkIn", checkIn);
    if (checkOut) fwd.set("checkOut", checkOut);
    fwd.set("adults", String(adults));
    fwd.set("children", String(children));
    fwd.set("rooms", String(rooms));

    navigate(`/booking/${propertyId}/${roomId}?${fwd.toString()}`);
  };

  if (!Array.isArray(rooms) || rooms.length === 0) {
    return (
      <section className="availability">
        <div className="availability__header">
          <h2 className="availability__title">Availability</h2>
        </div>
        <p style={{ padding: "1.5rem", color: "#888", textAlign: "center" }}>
          No room details available for this property.
        </p>
      </section>
    );
  }

  return (
    <section className="availability">
      <div className="availability__header">
        <h2 className="availability__title">Availability</h2>
        <span className="availability__currency">Prices in {currency} ⓘ</span>
        <a href="#" className="availability__price-match">
          🏷 We Price Match
        </a>
      </div>

      <div className="availability__table-wrapper">
        <table className="availability__table">
          <thead>
            <tr>
              <th>Room type</th>
              <th>Guests</th>
              <th>Size</th>
              <th>Features</th>
              <th>Amenities</th>
              <th>Today's price</th>
              <th>Your choices</th>
              <th>Select amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="availability__room-row">
                <td className="availability__room-cell">
                  <a href="#" className="availability__room-name">
                    {room.name}
                  </a>
                  {room.availability && (
                    <div className="availability__stock">
                      <span className="availability__dot" />
                      {room.availability} left
                    </div>
                  )}
                  {room.bedType && (
                    <div className="availability__room-bed">
                      {room.bedType
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                  )}
                </td>
                <td className="availability__guests-cell">
                  {Number(room.guests) > 0
                    ? `👤 ${room.guests} guest${Number(room.guests) !== 1 ? "s" : ""}`
                    : "—"}
                </td>
                <td>{room.size || "—"}</td>
                <td>
                  {Array.isArray(room.features)
                    ? room.features.map((f) => (
                        <span key={f} className="availability__feature-tag">
                          {f}
                        </span>
                      ))
                    : room.features}
                </td>
                <td>
                  {Array.isArray(room.amenities)
                    ? room.amenities.map((a) => (
                        <span key={a} className="availability__feature-tag">
                          {a}
                        </span>
                      ))
                    : room.amenities}
                </td>
                <td className="availability__price-cell">
                  {room.originalPrice &&
                    room.originalPrice !== room.currentPrice && (
                      <div className="availability__original-price">
                        {formatPrice(room.originalPrice, currency)}
                      </div>
                    )}
                  <div className="availability__current-price">
                    {formatPrice(
                      room.currentPrice || room.originalPrice,
                      currency,
                    ) || "—"}
                  </div>
                  <div className="availability__price-note">
                    {room.pricingType === "per_stay" ? "per stay" : "per night"}
                    {" · "}
                    {taxesIncluded ? "taxes included" : "excl. taxes"}
                  </div>
                  {room.discount && (
                    <span className="availability__badge availability__badge--discount">
                      {room.discount}
                    </span>
                  )}
                  {room.deal && (
                    <span className="availability__badge availability__badge--deal">
                      {room.deal}
                    </span>
                  )}
                </td>
                <td className="availability__choices-cell">
                  {Array.isArray(room.choices)
                    ? room.choices.map((choice, i) => (
                        <div key={i} className="availability__choice">
                          {choice.includes("Continental") && <span>🍳</span>}
                          {choice.includes("cancel") && <span>✗</span>}
                          {choice.includes("prepayment") && <span>✓</span>}
                          {choice.includes("left") && (
                            <span style={{ color: "#e25c5c" }}>•</span>
                          )}
                          <span>{choice}</span>
                        </div>
                      ))
                    : room.choices}
                </td>
                <td className="availability__select-cell">
                  <select className="availability__select">
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="availability__reserve-col">
                    <button
                      className="availability__reserve-btn"
                      onClick={() => reserveRoom(room.id)}
                    >
                      I'll reserve
                    </button>
                    <p className="availability__reserve-note">
                      • It only takes 2 minutes
                    </p>
                    <p className="availability__reserve-note">
                      • You won't be charged yet
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AvailabilityTable;
