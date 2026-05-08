import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadSearch, saveSearch, getDefaultDates } from "../../utils/searchStorage";
import "./AvailabilityTable.css";

const formatPrice = (price, currency) => {
  if (!price && price !== 0) return "";
  const num = Number(price);
  if (isNaN(num) || num === 0) return "";
  return `${currency || "NGN"} ${num.toLocaleString()}`;
};

function toDateValue(d) {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
}

function Counter({ label, value, onChange, min = 0 }) {
  return (
    <div className="asp-counter">
      <span className="asp-counter-label">{label}</span>
      <div className="asp-counter-controls">
        <button type="button" className="asp-counter-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
        <span className="asp-counter-value">{value}</span>
        <button type="button" className="asp-counter-btn" onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

function AvailSearchPanel({ checkIn, setCheckIn, checkOut, setCheckOut, adults, setAdults, children, setChildren, rooms, setRooms, onApply }) {
  const today  = new Date().toISOString().split("T")[0];
  const minOut = checkIn ? toDateValue(new Date(new Date(checkIn).getTime() + 86400000)) : today;
  return (
    <div className="asp">
      <h3 className="asp-title">Update your search</h3>
      <div className="asp-dates-row">
        <div className="asp-date-field">
          <label className="asp-date-label">Check-in</label>
          <input type="date" className="asp-date-input" value={toDateValue(checkIn)} min={today} onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : null)} />
        </div>
        <span className="asp-date-arrow">→</span>
        <div className="asp-date-field">
          <label className="asp-date-label">Check-out</label>
          <input type="date" className="asp-date-input" value={toDateValue(checkOut)} min={minOut} onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : null)} />
        </div>
      </div>
      <div className="asp-divider" />
      <div className="asp-guests-row">
        <Counter label="Adults"   value={adults}   onChange={setAdults}   min={1} />
        <Counter label="Children" value={children} onChange={setChildren} min={0} />
        <Counter label="Rooms"    value={rooms}    onChange={setRooms}    min={1} />
      </div>
      <button className="asp-apply-btn" type="button" onClick={onApply}>Apply changes →</button>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */
const AvailabilityTable = ({ rooms, taxesIncluded, currency = "NGN", propertyId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const src      = new URLSearchParams(location.search);

  const saved = loadSearch();
  const { checkIn: initIn, checkOut: initOut } = getDefaultDates(saved);

  const checkInStr  = src.get("checkIn")  || "";
  const checkOutStr = src.get("checkOut") || "";
  const adultsVal   = parseInt(src.get("adults"),   10) || saved?.adults   || 2;
  const childrenVal = parseInt(src.get("children"), 10) || saved?.children || 0;
  const roomsVal    = parseInt(src.get("rooms"),    10) || saved?.rooms    || 1;

  const [applying,   setApplying]   = useState(false);
  const [checkIn,    setCheckIn]    = useState(checkInStr  ? new Date(checkInStr)  : initIn);
  const [checkOut,   setCheckOut]   = useState(checkOutStr ? new Date(checkOutStr) : initOut);
  const [adults,     setAdults]     = useState(adultsVal);
  const [children,   setChildren]   = useState(childrenVal);
  const [roomsCount, setRoomsCount] = useState(roomsVal);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (checkIn)  params.set("checkIn",  checkIn  instanceof Date ? checkIn.toISOString()  : checkIn);
    if (checkOut) params.set("checkOut", checkOut instanceof Date ? checkOut.toISOString() : checkOut);
    params.set("adults",   String(adults));
    params.set("children", String(children));
    params.set("rooms",    String(roomsCount));
    saveSearch({ destination: saved?.destination || "", checkIn, checkOut, adults, children, rooms: roomsCount });
    setApplying(true);
    setTimeout(() => navigate(`/stays/${propertyId}?${params.toString()}`), 400);
  };

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

      {/* ── Search panel ── */}
      <AvailSearchPanel
        checkIn={checkIn}      setCheckIn={setCheckIn}
        checkOut={checkOut}    setCheckOut={setCheckOut}
        adults={adults}        setAdults={setAdults}
        children={children}    setChildren={setChildren}
        rooms={roomsCount}     setRooms={setRoomsCount}
        onApply={handleApply}
      />

      {/* ── Loading banner ── */}
      {applying && (
        <div className="avail-applying-banner">
          <span className="avail-applying-spinner" />
          Loading availability and prices…
        </div>
      )}

      {/* ── Room table ── */}
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
              <th></th>
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
                  <select className="availability__select">
                    {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </td>
                <td>
                  <div className="availability__reserve-col">
                    <button className="availability__reserve-btn" onClick={() => reserveRoom(room.id)}>
                      I'll reserve
                    </button>
                    <p className="availability__reserve-note">• It only takes 2 minutes</p>
                    <p className="availability__reserve-note">• You won't be charged yet</p>
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
