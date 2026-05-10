import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadSearch } from "../../utils/searchStorage";
import "./AvailabilityTable.css";

const formatPrice = (price, currency) => {
  if (!price && price !== 0) return "";
  const num = Number(price);
  if (isNaN(num) || num === 0) return "";
  return `${currency || "NGN"} ${num.toLocaleString()}`;
};

/* ── Main component ───────────────────────────────────────── */
const AvailabilityTable = ({ rooms, taxesIncluded, currency = "NGN", propertyId }) => {
  const [selectedAmounts, setSelectedAmounts] = useState({});
  const [activeRoomId, setActiveRoomId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const src      = new URLSearchParams(location.search);

  const saved = loadSearch();

  const checkInStr  = src.get("checkIn")  || "";
  const checkOutStr = src.get("checkOut") || "";
  const adultsVal   = parseInt(src.get("adults"),   10) || saved?.adults   || 2;
  const childrenVal = parseInt(src.get("children"), 10) || saved?.children || 0;
  const roomsVal    = parseInt(src.get("rooms"),    10) || saved?.rooms    || 1;

  const selectedRoom   = activeRoomId ? rooms.find((r) => String(r.id) === activeRoomId) : null;
  const selectedAmount = activeRoomId ? (selectedAmounts[activeRoomId] || 0) : 0;

  const reserveRoom = (roomId) => {
    const fwd = new URLSearchParams();
    const ci = checkInStr  || (saved?.checkIn  instanceof Date ? saved.checkIn.toISOString()  : saved?.checkIn  || "");
    const co = checkOutStr || (saved?.checkOut instanceof Date ? saved.checkOut.toISOString() : saved?.checkOut || "");
    if (ci) fwd.set("checkIn", ci);
    if (co) fwd.set("checkOut", co);
    fwd.set("adults",   String(adultsVal));
    fwd.set("children", String(childrenVal));
    fwd.set("rooms",    String(roomsVal));
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
        <a href="#" className="availability__price-match">🏷 We Price Match</a>
      </div>

      {/* ── Grid: scrollable table  +  sticky panel column ── */}
      <div className="availability__grid">

        {/* Left: 7-column table with its own horizontal scroll */}
        <div className="availability__grid-table">
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
                  <th>Select amount</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="availability__room-row">
                    <td className="availability__room-cell">
                      <a href="#" className="availability__room-name">{room.name}</a>
                      {room.availability && (
                        <div className="availability__stock">
                          <span className="availability__dot" />
                          {room.availability} left
                        </div>
                      )}
                      {room.bedType && (
                        <div className="availability__room-bed">
                          {room.bedType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                        ? room.features.map((f) => <span key={f} className="availability__feature-tag">{f}</span>)
                        : room.features}
                    </td>
                    <td>
                      {Array.isArray(room.amenities)
                        ? room.amenities.map((a) => <span key={a} className="availability__feature-tag">{a}</span>)
                        : room.amenities}
                    </td>
                    <td className="availability__price-cell">
                      {room.originalPrice && room.originalPrice !== room.currentPrice && (
                        <div className="availability__original-price">
                          {formatPrice(room.originalPrice, currency)}
                        </div>
                      )}
                      <div className="availability__current-price">
                        {formatPrice(room.currentPrice || room.originalPrice, currency) || "—"}
                      </div>
                      <div className="availability__price-note">
                        {room.pricingType === "per_stay" ? "per stay" : "per night"}
                        {" · "}
                        {taxesIncluded ? "taxes included" : "excl. taxes"}
                      </div>
                      {room.discount && <span className="availability__badge availability__badge--discount">{room.discount}</span>}
                      {room.deal    && <span className="availability__badge availability__badge--deal">{room.deal}</span>}
                    </td>
                    <td className="availability__select-cell">
                      <select
                        className="availability__select"
                        value={selectedAmounts[room.id] || 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSelectedAmounts((prev) => ({ ...prev, [room.id]: val }));
                          if (val > 0) {
                            setActiveRoomId(String(room.id));
                          } else {
                            setActiveRoomId((prev) => {
                              if (prev !== String(room.id)) return prev;
                              const fallback = Object.keys(selectedAmounts).find(
                                (id) => id !== String(room.id) && selectedAmounts[id] > 0
                              );
                              return fallback || null;
                            });
                          }
                        }}
                      >
                        {[0, 1, 2, 3].map((n) => (
                          <option key={n} value={n}>
                            {n === 0
                              ? "0"
                              : `${n} - ${formatPrice(room.currentPrice || room.originalPrice, currency)}`}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: panel column — header matches <th>, body is sticky */}
        <div className="availability__grid-panel">
          <div className="availability__panel-th">Your reservation</div>
          <div className="availability__panel-body">
            <div className="availability__panel-sticky">
              {selectedRoom ? (
                /* ── Booking summary panel ── */
                <div className="abp">
                  <div className="abp__rooms-line">
                    {selectedAmount} room{selectedAmount > 1 ? "s" : ""} for
                  </div>
                  {selectedRoom.originalPrice && selectedRoom.originalPrice !== selectedRoom.currentPrice && (
                    <div className="abp__original-price">
                      {formatPrice(selectedRoom.originalPrice * selectedAmount, currency)}
                    </div>
                  )}
                  <div className="abp__current-price">
                    {formatPrice((selectedRoom.currentPrice || selectedRoom.originalPrice) * selectedAmount, currency)}
                  </div>
                  <div className="abp__taxes">Includes taxes and charges</div>

                  <button className="abp__reserve-btn" onClick={() => reserveRoom(selectedRoom.id)}>
                    {selectedRoom.discount ? `Reserve with ${selectedRoom.discount}` : "Reserve"}
                  </button>
                  <div className="abp__step-note">You'll be taken to the next step</div>
                  <div className="abp__note">It only takes 2 minutes</div>
                  <div className="abp__note">You won't be charged yet</div>

                  {selectedRoom.features?.length > 0 && (
                    <div className="abp__package">
                      <div className="abp__package-title">Your package:</div>
                      {selectedRoom.features.map((f) => (
                        <div key={f} className="abp__package-item">{f}</div>
                      ))}
                    </div>
                  )}

                  <div className="abp__cancel-note">Total cost to cancel</div>
                  <div className="abp__prepay-note">No prepayment needed – pay at the property</div>

                  {selectedRoom.discount && (
                    <div className="abp__discount-note">
                      {selectedRoom.discount} applied to the price before taxes and charges
                    </div>
                  )}

                  {selectedRoom.availability && (
                    <div className="abp__stock">• We have {selectedRoom.availability} left</div>
                  )}
                </div>
              ) : (
                /* ── Default (qty = 0): single prompt card ── */
                <div className="abp">
                  <button className="abp__reserve-btn" disabled>
                    I'll reserve
                  </button>
                  <div className="abp__note">It only takes 2 minutes</div>
                  <div className="abp__note">You won't be charged yet</div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AvailabilityTable;
