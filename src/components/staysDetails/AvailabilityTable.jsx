import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadSearch } from "../../utils/searchStorage";
import CalendarField from "../common/Main/Hero/CalendarField";
import GuestsField from "../common/Main/Hero/GuestsField";
import "./AvailabilityTable.css";

const formatPrice = (price, currency) => {
  if (!price && price !== 0) return "";
  const num = Number(price);
  if (isNaN(num) || num === 0) return "";
  return `${currency || "NGN"} ${num.toLocaleString()}`;
};

const toDateStr = (d) => {
  if (!d) return "";
  if (d instanceof Date) return d.toISOString().split("T")[0];
  if (typeof d === "string") return d.split("T")[0];
  return "";
};

const parseDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const AvailabilityTable = ({ rooms, taxesIncluded, currency = "NGN", propertyId, preSelectRoomId }) => {
  const [selectedAmounts, setSelectedAmounts] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const src      = new URLSearchParams(location.search);
  const saved    = loadSearch();

  // ── Read from URL first, then localStorage ──
  const initCIDate   = parseDate(src.get("checkIn")  || saved?.checkIn);
  const initCODate   = parseDate(src.get("checkOut") || saved?.checkOut);
  const initAdults   = parseInt(src.get("adults"),   10) || saved?.adults   || 2;
  const initChildren = parseInt(src.get("children"), 10) || saved?.children || 0;
  const initRooms    = parseInt(src.get("rooms"),    10) || saved?.rooms    || 1;

  // ── If dates already exist from URL/search, show prices immediately ──
  const hasInitDates = !!(initCIDate && initCODate);

  const [localCheckIn,  setLocalCheckIn]  = useState(initCIDate);
  const [localCheckOut, setLocalCheckOut] = useState(initCODate);
  const [localAdults,   setLocalAdults]   = useState(initAdults);
  const [localChildren, setLocalChildren] = useState(initChildren);
  const [localRooms,    setLocalRooms]    = useState(initRooms);

  const [appliedCheckIn,  setAppliedCheckIn]  = useState(initCIDate);
  const [appliedCheckOut, setAppliedCheckOut] = useState(initCODate);
  const [appliedAdults,   setAppliedAdults]   = useState(initAdults);
  const [appliedChildren, setAppliedChildren] = useState(initChildren);
  const [appliedRooms,    setAppliedRooms]    = useState(initRooms);

  // ── Start with prices shown if dates came from search ──
  const [searchApplied, setSearchApplied] = useState(hasInitDates);
  const [isLoading,     setIsLoading]     = useState(false);
  const [showModal,     setShowModal]     = useState(false);

  const isDirty =
    toDateStr(localCheckIn)  !== toDateStr(appliedCheckIn)  ||
    toDateStr(localCheckOut) !== toDateStr(appliedCheckOut) ||
    localAdults   !== appliedAdults   ||
    localChildren !== appliedChildren ||
    localRooms    !== appliedRooms;

  const btnLabel = isLoading ? "Loading…" : isDirty ? "Apply changes" : "Change search";

  const handleSearch = () => {
    if (!localCheckIn || !localCheckOut) { setShowModal(true); return; }
    setIsLoading(true);
    setTimeout(() => {
      setAppliedCheckIn(localCheckIn);
      setAppliedCheckOut(localCheckOut);
      setAppliedAdults(localAdults);
      setAppliedChildren(localChildren);
      setAppliedRooms(localRooms);
      setSearchApplied(true);
      setSelectedAmounts({});
      setIsLoading(false);
    }, 800);
  };

  // ── Total guests currently applied ──
  const totalGuests = appliedAdults + appliedChildren;

  // ── Cart: all rooms with qty > 0 ──
  const effectiveAmounts = (preSelectRoomId && !selectedAmounts[preSelectRoomId])
    ? { ...selectedAmounts, [preSelectRoomId]: 1 }
    : selectedAmounts;

  const cartItems = rooms
    .map(r => ({ room: r, qty: effectiveAmounts[r.id] || 0 }))
    .filter(item => item.qty > 0);

  const cartTotal = cartItems.reduce((sum, { room, qty }) => {
    const price = Number(room.currentPrice || room.originalPrice || 0);
    return sum + price * qty;
  }, 0);

  // ── Check if any selected room exceeds guest capacity ──
  const capacityViolations = cartItems.filter(({ room }) => {
    const maxGuests = Number(room.guests);
    return maxGuests > 0 && totalGuests > maxGuests;
  });
  const hasCapacityIssue = capacityViolations.length > 0;

  const effectiveSearchApplied = searchApplied || !!preSelectRoomId;

  // ── Nights calculation for cart panel ──
  const nights = appliedCheckIn && appliedCheckOut
    ? Math.max(1, Math.round((appliedCheckOut - appliedCheckIn) / 86400000))
    : 1;

  // ── Navigate to booking with all selections ──
  const reserveAll = () => {
    if (cartItems.length === 0 || hasCapacityIssue) return;
    const fwd = new URLSearchParams();
    const ci = toDateStr(appliedCheckIn);
    const co = toDateStr(appliedCheckOut);
    if (ci) fwd.set("checkIn",  ci);
    if (co) fwd.set("checkOut", co);
    fwd.set("adults",   String(appliedAdults));
    fwd.set("children", String(appliedChildren));
    fwd.set("rooms",    String(appliedRooms));

    const roomSelections = cartItems.map(({ room, qty }) => ({
      id:            room.id,
      name:          room.name,
      qty,
      currentPrice:  Number(room.currentPrice  || room.originalPrice || 0),
      originalPrice: Number(room.originalPrice || room.currentPrice  || 0),
      discount:      room.discount || "",
      features:      room.features || [],
    }));
    fwd.set("rooms_json", encodeURIComponent(JSON.stringify(roomSelections)));

    const primaryRoomId = cartItems[0].room.id;
    navigate(`/booking/${propertyId}/${primaryRoomId}?${fwd.toString()}`);
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
        {effectiveSearchApplied && (
          <>
            <span className="availability__currency">Prices in {currency} ⓘ</span>
            <a href="#" className="availability__price-match">🏷 We Price Match</a>
          </>
        )}
      </div>

      {!effectiveSearchApplied && (
        <div className="availability__no-dates">
          <span className="availability__no-dates-icon">📅</span>
          Select dates to see this property's availability and prices
        </div>
      )}

      {/* ── Search bar ── */}
      <div className="avail-search-wrap">
        <div className="search-container avail-search-container">
          <CalendarField
            checkIn={localCheckIn}
            setCheckIn={setLocalCheckIn}
            checkOut={localCheckOut}
            setCheckOut={setLocalCheckOut}
          />
          <GuestsField
            adults={localAdults}
            setAdults={setLocalAdults}
            children={localChildren}
            setChildren={setLocalChildren}
            rooms={localRooms}
            setRooms={setLocalRooms}
          />
          <button
            type="button"
            className="search-btn avail-search-btn"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {btnLabel}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="avail-applying-banner">
          <span className="avail-applying-spinner" />
          Checking availability…
        </div>
      )}

      {!isLoading && (
        <div className="availability__grid">
          <div className="availability__grid-table">
            <div className="availability__table-wrapper">
              <table className="availability__table">
                <thead>
                  <tr>
                    <th>Room type</th>
                    <th>Guests</th>
                    {effectiveSearchApplied && <th>Size</th>}
                    {effectiveSearchApplied && <th>Features</th>}
                    {effectiveSearchApplied && <th>Amenities</th>}
                    {effectiveSearchApplied && <th>Today's price</th>}
                    <th>{effectiveSearchApplied ? "Select amount" : ""}</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => {
                    const roomMaxGuests = Number(room.guests) || 0;
                    const selectedQty   = effectiveAmounts[room.id] || 0;
                    const exceedsCapacity = roomMaxGuests > 0 && totalGuests > roomMaxGuests && selectedQty > 0;
                    const pricePerRoom  = Number(room.currentPrice || room.originalPrice || 0);

                    return (
                      <tr
                        key={room.id}
                        className={[
                          "availability__room-row",
                          selectedQty > 0 ? "availability__room-row--selected" : "",
                          exceedsCapacity ? "availability__room-row--warning" : "",
                        ].filter(Boolean).join(" ")}
                      >
                        <td className="availability__room-cell">
                          <a href="#" className="availability__room-name">{room.name}</a>
                          {effectiveSearchApplied && room.availability && (
                            <div className="availability__stock">
                              <span className="availability__dot" />{room.availability} left
                            </div>
                          )}
                          {room.bedType && (
                            <div className="availability__room-bed">
                              {room.bedType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          )}
                        </td>

                        {/* Guests capacity cell */}
                        <td className="availability__guests-cell">
                          {roomMaxGuests > 0
                            ? `👤 ${roomMaxGuests} guest${roomMaxGuests !== 1 ? "s" : ""}`
                            : "—"}
                          {/* Capacity warning inline */}
                          {exceedsCapacity && (
                            <div className="availability__capacity-warning">
                              ⚠ Max {roomMaxGuests} guest{roomMaxGuests !== 1 ? "s" : ""}.
                              You selected {totalGuests} — please reduce guests or pick another room.
                            </div>
                          )}
                        </td>

                        {effectiveSearchApplied && <td>{room.size || "—"}</td>}
                        {effectiveSearchApplied && (
                          <td>
                            {Array.isArray(room.features)
                              ? room.features.map(f => <span key={f} className="availability__feature-tag">{f}</span>)
                              : room.features}
                          </td>
                        )}
                        {effectiveSearchApplied && (
                          <td>
                            {Array.isArray(room.amenities)
                              ? room.amenities.map(a => <span key={a} className="availability__feature-tag">{a}</span>)
                              : room.amenities}
                          </td>
                        )}
                        {effectiveSearchApplied && (
                          <td className="availability__price-cell">
                            {room.originalPrice && Number(room.originalPrice) !== Number(room.currentPrice) && (
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
                            {room.discount && (
                              <span className="availability__badge availability__badge--discount">
                                {room.discount}% off
                              </span>
                            )}
                            {room.deal && (
                              <span className="availability__badge availability__badge--deal">
                                {room.deal}
                              </span>
                            )}
                          </td>
                        )}

                        {/* Select amount dropdown with multiplied prices */}
                        <td className="availability__select-cell">
                          {effectiveSearchApplied ? (
                            <select
                              className={`availability__select${exceedsCapacity ? " availability__select--warning" : ""}`}
                              value={selectedQty}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setSelectedAmounts(prev => ({ ...prev, [room.id]: val }));
                              }}
                            >
                              {[0, 1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n}>
                                  {n === 0
                                    ? "0"
                                    : `${n} — ${formatPrice(pricePerRoom * n, currency)}`}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <button
                              className="avail-show-prices-btn"
                              onClick={() => setShowModal(true)}
                            >
                              Show prices
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Reservation panel ── */}
          {effectiveSearchApplied && (
            <div className="availability__grid-panel">
              <div className="availability__panel-th">Your reservation</div>
              <div className="availability__panel-body">
                <div className="availability__panel-sticky">
                  {cartItems.length > 0 ? (
                    <div className="abp">
                      {/* Dates summary */}
                      {appliedCheckIn && appliedCheckOut && (
                        <div className="abp__dates">
                          <div className="abp__date-row">
                            <span className="abp__date-label">Check-in</span>
                            <span className="abp__date-val">
                              {appliedCheckIn.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="abp__date-row">
                            <span className="abp__date-label">Check-out</span>
                            <span className="abp__date-val">
                              {appliedCheckOut.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="abp__date-row">
                            <span className="abp__date-label">Duration</span>
                            <span className="abp__date-val">{nights} night{nights !== 1 ? "s" : ""}</span>
                          </div>
                          <div className="abp__date-row">
                            <span className="abp__date-label">Guests</span>
                            <span className="abp__date-val">
                              {appliedAdults} adult{appliedAdults !== 1 ? "s" : ""}
                              {appliedChildren > 0 ? `, ${appliedChildren} child${appliedChildren !== 1 ? "ren" : ""}` : ""}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="abp__divider" />

                      {/* Room lines */}
                      {cartItems.map(({ room, qty }) => {
                        const price = Number(room.currentPrice || room.originalPrice || 0);
                        const roomTotal = price * qty * nights;
                        return (
                          <div key={room.id} className="abp__cart-item">
                            <div className="abp__cart-name">{qty}× {room.name}</div>
                            <div className="abp__cart-price">
                              {formatPrice(roomTotal, currency)}
                            </div>
                          </div>
                        );
                      })}

                      <div className="abp__divider" />

                      <div className="abp__total-row">
                        <span className="abp__rooms-line">Total</span>
                        <span className="abp__current-price">
                          {formatPrice(cartTotal * nights, currency)}
                        </span>
                      </div>
                      <div className="abp__taxes">
                        {taxesIncluded ? "Includes taxes and charges" : "Excludes taxes and charges"}
                      </div>

                      {/* Capacity warning banner */}
                      {hasCapacityIssue && (
                        <div className="abp__capacity-error">
                          ⚠ One or more rooms can't accommodate {totalGuests} guests.
                          Please adjust your guest count or room selection.
                        </div>
                      )}

                      <button
                        className="abp__reserve-btn"
                        onClick={reserveAll}
                        disabled={hasCapacityIssue}
                        style={hasCapacityIssue ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                      >
                        {hasCapacityIssue ? "Resolve guest issues to reserve" : "Reserve"}
                      </button>
                      <div className="abp__step-note">You'll be taken to the next step</div>
                      <div className="abp__note">It only takes 2 minutes</div>
                      <div className="abp__note">You won't be charged yet</div>
                      <div className="abp__prepay-note">No prepayment needed – pay at the property</div>
                    </div>
                  ) : (
                    <div className="abp">
                      <p style={{ fontSize: "0.85rem", color: "#888", textAlign: "center", margin: "0 0 12px" }}>
                        Select a room amount to begin your reservation
                      </p>
                      <button className="abp__reserve-btn" disabled>I'll reserve</button>
                      <div className="abp__note">It only takes 2 minutes</div>
                      <div className="abp__note">You won't be charged yet</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="avail-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="avail-modal" onClick={e => e.stopPropagation()}>
            <div className="avail-modal__title">ibooknova says</div>
            <div className="avail-modal__body">
              To see available rooms and prices please enter your check-in and check-out dates
            </div>
            <button className="avail-modal__ok" onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AvailabilityTable;