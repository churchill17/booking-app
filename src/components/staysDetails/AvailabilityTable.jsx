import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadSearch, saveSearch } from "../../utils/searchStorage";
import CalendarField from "../common/Main/Hero/CalendarField";
import GuestsField from "../common/Main/Hero/GuestsField";
import "./AvailabilityTable.css";

// ── SVG Icons ──────────────────────────────────────────────────
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconUser = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);
const IconBed = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/>
    <path d="M2 17h20"/><path d="M6 8v9"/>
  </svg>
);
const IconCheck = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconAlert = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconStar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconSize = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);
const IconTag = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────
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

const fmtDate = (d) =>
  d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

// Always produces a correct integer from two Date objects or date strings
const calcNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1;
  const ci = checkIn instanceof Date ? checkIn : new Date(checkIn);
  const co = checkOut instanceof Date ? checkOut : new Date(checkOut);
  if (isNaN(ci.getTime()) || isNaN(co.getTime())) return 1;
  return Math.max(1, Math.round((co - ci) / 86400000));
};

// ── Score a room to find the best match for the search ────────
const scoreRoom = (room, adults, children) => {
  const totalGuests = adults + children;
  const maxGuests = Number(room.guests) || 0;
  const price = Number(room.currentPrice || room.originalPrice || 0);
  let score = 0;
  if (maxGuests >= totalGuests) score += 50;
  if (room.allowChildren !== false || children === 0) score += 20;
  if (price > 0) score += Math.max(0, 30 - price / 10000);
  if (room.discount) score += 10;
  return score;
};

// ── Recommended Card ──────────────────────────────────────────
const RecommendedCard = ({ room, nights, adults, children, currency, taxesIncluded, onReserve }) => {
  if (!room) return null;
  const pricePerNight = Number(room.currentPrice || room.originalPrice || 0);
  const totalPrice    = pricePerNight * nights;
  const features      = Array.isArray(room.features)  ? room.features  : [];
  const amenities     = Array.isArray(room.amenities) ? room.amenities : [];

  const guestLine = [
    `${adults} adult${adults !== 1 ? "s" : ""}`,
    children > 0 ? `${children} child${children !== 1 ? "ren" : ""}` : null,
    `${nights} night${nights !== 1 ? "s" : ""}`,
  ].filter(Boolean).join(", ");

  return (
    <div className="rec-card">
      <div className="rec-card__badge">
        <IconStar /> Suggested for you
      </div>
      <div className="rec-card__body">
        <div className="rec-card__left">
          <div className="rec-card__guest-line">{guestLine}</div>
          <div className="rec-card__room-name">{room.name}</div>
          <div className="rec-card__meta-row">
            {room.bedType && (
              <span className="rec-card__bed">
                <IconBed />
                {room.bedType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
            {room.size && (
              <span className="rec-card__size">
                <IconSize /> {room.size}
              </span>
            )}
          </div>
          {(features.length > 0 || amenities.length > 0) && (
            <div className="rec-card__choices">
              {features.length > 0 && (
                <div className="rec-card__choice-group">
                  <span className="rec-card__choice-label">Features</span>
                  <ul className="rec-card__choice-list">
                    {features.map((f, i) => (
                      <li key={i}><span className="rec-card__check"><IconCheck /></span>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {amenities.length > 0 && (
                <div className="rec-card__choice-group">
                  <span className="rec-card__choice-label">Amenities</span>
                  <ul className="rec-card__choice-list">
                    {amenities.map((a, i) => (
                      <li key={i}><span className="rec-card__check"><IconCheck /></span>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="rec-card__right">
          <div className="rec-card__price-label">
            {nights} night{nights !== 1 ? "s" : ""}
          </div>
          <div className="rec-card__price">{formatPrice(totalPrice, currency)}</div>
          <div className="rec-card__per-night">
            {formatPrice(pricePerNight, currency)} / night
          </div>
          <div className="rec-card__tax">
            {taxesIncluded ? "Taxes included" : "Excl. taxes & charges"}
          </div>
          <button className="rec-card__reserve-btn" type="button" onClick={onReserve}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────
const AvailabilityTable = ({ rooms, taxesIncluded, currency = "NGN", propertyId, preSelectRoomId }) => {
  const [selectedAmounts, setSelectedAmounts] = useState({});
  const navigate  = useNavigate();
  const location  = useLocation();
  const src       = new URLSearchParams(location.search);
  const saved     = loadSearch();

  const initCIDate   = parseDate(src.get("checkIn")  || saved?.checkIn);
  const initCODate   = parseDate(src.get("checkOut") || saved?.checkOut);
  const initAdults   = parseInt(src.get("adults"),   10) || saved?.adults   || 2;
  const initChildren = parseInt(src.get("children"), 10) || saved?.children || 0;
  const initRooms    = parseInt(src.get("rooms"),    10) || saved?.rooms    || 1;
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

  const [searchApplied, setSearchApplied] = useState(hasInitDates);
  const [isLoading,     setIsLoading]     = useState(false);
  const [showModal,     setShowModal]     = useState(false);

  const isDirty =
    toDateStr(localCheckIn)  !== toDateStr(appliedCheckIn)  ||
    toDateStr(localCheckOut) !== toDateStr(appliedCheckOut) ||
    localAdults !== appliedAdults || localChildren !== appliedChildren || localRooms !== appliedRooms;

  const btnLabel = isLoading ? "Loading..." : isDirty ? "Apply changes" : "Change search";

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

  const totalGuests = appliedAdults + appliedChildren;
  const nights      = calcNights(appliedCheckIn, appliedCheckOut);

  // Best room recommendation — only shown after search applied
  const recommendedRoom =
    Array.isArray(rooms) && rooms.length > 0 && searchApplied
      ? rooms.reduce((best, r) =>
          scoreRoom(r, appliedAdults, appliedChildren) >
          scoreRoom(best, appliedAdults, appliedChildren) ? r : best
        )
      : null;

  const effectiveAmounts = (preSelectRoomId && !selectedAmounts[preSelectRoomId])
    ? { ...selectedAmounts, [preSelectRoomId]: 1 }
    : selectedAmounts;

  const cartItems = (rooms || [])
    .map(r => ({ room: r, qty: effectiveAmounts[r.id] || 0 }))
    .filter(item => item.qty > 0);

  const cartTotal = cartItems.reduce((sum, { room, qty }) => {
    return sum + Number(room.currentPrice || room.originalPrice || 0) * qty * nights;
  }, 0);

  const hasCapacityIssue = cartItems.some(({ room }) => {
    const max = Number(room.guests);
    return max > 0 && totalGuests > max;
  });
  const childrenViolation = cartItems.some(
    ({ room }) => room.allowChildren === false && appliedChildren > 0
  );
  const hasAnyIssue = hasCapacityIssue || childrenViolation;
  const effectiveSearchApplied = searchApplied || !!preSelectRoomId;

  // Reserve button on recommended card — selects that room and scrolls to it
  const handleRecommendedReserve = () => {
    if (!recommendedRoom) return;
    setSelectedAmounts(prev => ({ ...prev, [recommendedRoom.id]: 1 }));
    setTimeout(() => {
      document.getElementById(`room-row-${recommendedRoom.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const reserveAll = () => {
    if (cartItems.length === 0 || hasAnyIssue) return;
    saveSearch({
      destination: "",
      checkIn:  appliedCheckIn,
      checkOut: appliedCheckOut,
      adults:   appliedAdults,
      children: appliedChildren,
      rooms:    appliedRooms,
    });
    const fwd = new URLSearchParams();
    const ci = toDateStr(appliedCheckIn);
    const co = toDateStr(appliedCheckOut);
    if (ci) fwd.set("checkIn", ci);
    if (co) fwd.set("checkOut", co);
    fwd.set("adults",   String(appliedAdults));
    fwd.set("children", String(appliedChildren));
    fwd.set("rooms",    String(appliedRooms));
    fwd.set("rooms_json", encodeURIComponent(JSON.stringify(
      cartItems.map(({ room, qty }) => ({
        id: room.id, name: room.name, qty,
        currentPrice:  Number(room.currentPrice  || room.originalPrice || 0),
        originalPrice: Number(room.originalPrice || room.currentPrice  || 0),
        discount: room.discount || "",
        features: room.features || [],
      }))
    )));
    navigate(`/booking/${propertyId}/${cartItems[0].room.id}?${fwd.toString()}`);
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

  // Price column header — reflects actual nights from dates
  const priceColHeader = nights === 1 ? "Price for 1 night" : `Price for ${nights} nights`;

  return (
    <section className="availability">

      {/* Header */}
      <div className="availability__header">
        <h2 className="availability__title">Availability</h2>
        {effectiveSearchApplied && (
          <div className="avail-header-meta">
            <span className="avail-meta-pill">
              <IconTag /> Prices in {currency}
            </span>
            <span className="avail-meta-pill avail-meta-pill--teal">
              We Price Match
            </span>
          </div>
        )}
      </div>

      {/* No-dates prompt */}
      {!effectiveSearchApplied && (
        <div className="availability__no-dates">
          <span className="availability__no-dates-icon"><IconCalendar /></span>
          Select your check-in and check-out dates to see prices and availability
        </div>
      )}

      {/* Search bar */}
      <div className="avail-search-wrap">
        <div className="search-container avail-search-container">
          <CalendarField
            checkIn={localCheckIn}   setCheckIn={setLocalCheckIn}
            checkOut={localCheckOut} setCheckOut={setLocalCheckOut}
          />
          <GuestsField
            adults={localAdults}     setAdults={setLocalAdults}
            children={localChildren} setChildren={setLocalChildren}
            rooms={localRooms}       setRooms={setLocalRooms}
          />
          <button type="button" className="search-btn avail-search-btn"
            onClick={handleSearch} disabled={isLoading}>
            {btnLabel}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="avail-applying-banner">
          <span className="avail-applying-spinner" />
          Checking availability for your dates...
        </div>
      )}

      {/* Recommended card — above table, only after search applied */}
      {!isLoading && effectiveSearchApplied && recommendedRoom && (
        <RecommendedCard
          room={recommendedRoom}
          nights={nights}
          adults={appliedAdults}
          children={appliedChildren}
          currency={currency}
          taxesIncluded={taxesIncluded}
          onReserve={handleRecommendedReserve}
        />
      )}

      {!isLoading && (
        <div className="availability__grid">
          <div className="availability__grid-table">
            <div className="availability__table-wrapper">
              <table className="availability__table">
                <thead>
                  <tr>
                    <th className="at-col-room">Room type</th>
                    <th className="at-col-sleeps">Sleeps</th>
                    {effectiveSearchApplied && <th className="at-col-size">Room size</th>}
                    {effectiveSearchApplied && <th className="at-col-choices">Your choices</th>}
                    {effectiveSearchApplied && (
                      <th className="at-col-price">{priceColHeader}</th>
                    )}
                    <th className="at-col-select">
                      {effectiveSearchApplied ? "Select rooms" : ""}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => {
                    const roomMaxGuests   = Number(room.guests) || 0;
                    const selectedQty     = effectiveAmounts[room.id] || 0;
                    const exceedsCapacity = roomMaxGuests > 0 && totalGuests > roomMaxGuests && selectedQty > 0;
                    const childrenBlocked = room.allowChildren === false && appliedChildren > 0 && selectedQty > 0;
                    const pricePerRoom    = Number(room.currentPrice || room.originalPrice || 0);
                    const totalForStay    = pricePerRoom * nights;
                    const origForStay     = Number(room.originalPrice || 0) * nights;
                    const hasDiscount     = origForStay > 0 && totalForStay > 0 && totalForStay < origForStay;
                    const isRecommended   = recommendedRoom && room.id === recommendedRoom.id;
                    const features        = Array.isArray(room.features)  ? room.features  : [];
                    const amenities       = Array.isArray(room.amenities) ? room.amenities : [];

                    return (
                      <tr
                        id={`room-row-${room.id}`}
                        key={room.id}
                        className={[
                          "availability__room-row",
                          selectedQty > 0 ? "availability__room-row--selected" : "",
                          exceedsCapacity || childrenBlocked ? "availability__room-row--warning" : "",
                          isRecommended && effectiveSearchApplied ? "availability__room-row--recommended" : "",
                        ].filter(Boolean).join(" ")}
                      >
                        {/* Room type */}
                        <td className="at-cell-room">
                          {isRecommended && effectiveSearchApplied && (
                            <div className="at-recommended-badge">
                              <IconStar /> Suggested for you
                            </div>
                          )}
                          <span className="at-room-name">{room.name}</span>
                          {room.bedType && (
                            <div className="at-room-bed">
                              <IconBed />
                              {room.bedType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          )}
                          {effectiveSearchApplied && room.availability && (
                            <div className="at-room-stock">
                              <span className="at-stock-dot" />
                              Only {room.availability} left at this price
                            </div>
                          )}
                        </td>

                        {/* Sleeps */}
                        <td className="at-cell-sleeps">
                          <div className="at-sleeps">
                            {roomMaxGuests > 0
                              ? Array.from({ length: Math.min(roomMaxGuests, 5) }).map((_, i) => (
                                  <span key={i} className="at-person-icon"><IconUser /></span>
                                ))
                              : <span className="at-dash">—</span>}
                            {roomMaxGuests > 5 && (
                              <span className="at-sleeps-extra">+{roomMaxGuests - 5}</span>
                            )}
                          </div>
                          {roomMaxGuests > 0 && (
                            <div className="at-sleeps-label">
                              {roomMaxGuests} guest{roomMaxGuests !== 1 ? "s" : ""}
                            </div>
                          )}
                          {exceedsCapacity && (
                            <div className="at-capacity-warning">
                              <IconAlert />
                              Max {roomMaxGuests} — you selected {totalGuests}
                            </div>
                          )}
                          {childrenBlocked && (
                            <div className="at-capacity-warning">
                              <IconAlert />
                              No children allowed in this room
                            </div>
                          )}
                        </td>

                        {/* Room size */}
                        {effectiveSearchApplied && (
                          <td className="at-cell-size">
                            {room.size
                              ? <span className="at-size">{room.size}</span>
                              : <span className="at-dash">—</span>}
                          </td>
                        )}

                        {/* Your choices — Features then Amenities as labelled bullet groups */}
                        {effectiveSearchApplied && (
                          <td className="at-cell-choices">
                            {features.length === 0 && amenities.length === 0 ? (
                              <span className="at-dash">—</span>
                            ) : (
                              <>
                                {features.length > 0 && (
                                  <div className="at-choices-group">
                                    <span className="at-choices-label">Features</span>
                                    <ul className="at-choices-list">
                                      {features.map((f, i) => (
                                        <li key={i} className="at-choice">
                                          <span className="at-choice-icon"><IconCheck /></span>
                                          {f}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {amenities.length > 0 && (
                                  <div className="at-choices-group">
                                    <span className="at-choices-label">Amenities</span>
                                    <ul className="at-choices-list">
                                      {amenities.map((a, i) => (
                                        <li key={i} className="at-choice">
                                          <span className="at-choice-icon"><IconCheck /></span>
                                          {a}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                        )}

                        {/* Price */}
                        {effectiveSearchApplied && (
                          <td className="at-cell-price">
                            {hasDiscount && (
                              <div className="at-price-original">
                                {formatPrice(origForStay, currency)}
                              </div>
                            )}
                            <div className="at-price-total">
                              {formatPrice(totalForStay, currency) || "—"}
                            </div>
                            <div className="at-price-breakdown">
                              {formatPrice(pricePerRoom, currency)} / night
                            </div>
                            <div className="at-price-tax">
                              {taxesIncluded ? "Taxes included" : "Excl. taxes & charges"}
                            </div>
                            {room.discount && (
                              <span className="at-badge at-badge--discount">{room.discount}% off</span>
                            )}
                            {room.deal && (
                              <span className="at-badge at-badge--deal">{room.deal}</span>
                            )}
                          </td>
                        )}

                        {/* Select */}
                        <td className="at-cell-select">
                          {effectiveSearchApplied ? (
                            <select
                              className={`at-select${exceedsCapacity || childrenBlocked ? " at-select--warning" : ""}`}
                              value={selectedQty}
                              onChange={(e) =>
                                setSelectedAmounts(prev => ({ ...prev, [room.id]: Number(e.target.value) }))
                              }
                            >
                              {[0, 1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n}>
                                  {n === 0 ? "0" : `${n} — ${formatPrice(pricePerRoom * n * nights, currency)}`}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <button className="avail-show-prices-btn" onClick={() => setShowModal(true)}>
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

          {/* Reservation panel */}
          {effectiveSearchApplied && (
            <div className="availability__grid-panel">
              <div className="availability__panel-th">Your reservation</div>
              <div className="availability__panel-body">
                <div className="availability__panel-sticky">
                  {cartItems.length > 0 ? (
                    <div className="abp">
                      {appliedCheckIn && appliedCheckOut && (
                        <div className="abp__dates">
                          <div className="abp__date-row">
                            <span className="abp__date-label">Check-in</span>
                            <span className="abp__date-val">{fmtDate(appliedCheckIn)}</span>
                          </div>
                          <div className="abp__date-row">
                            <span className="abp__date-label">Check-out</span>
                            <span className="abp__date-val">{fmtDate(appliedCheckOut)}</span>
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
                      {cartItems.map(({ room, qty }) => {
                        const price = Number(room.currentPrice || room.originalPrice || 0);
                        return (
                          <div key={room.id} className="abp__cart-item">
                            <div className="abp__cart-name">
                              {qty}× {room.name}
                              <div className="abp__cart-meta">{nights} night{nights !== 1 ? "s" : ""}</div>
                            </div>
                            <div className="abp__cart-price">
                              {formatPrice(price * qty * nights, currency)}
                            </div>
                          </div>
                        );
                      })}
                      <div className="abp__divider" />
                      <div className="abp__total-row">
                        <span className="abp__total-label">Total</span>
                        <span className="abp__total-price">{formatPrice(cartTotal, currency)}</span>
                      </div>
                      <div className="abp__taxes">
                        {taxesIncluded ? "Includes taxes & charges" : "Excludes taxes & charges"}
                      </div>
                      {hasCapacityIssue && (
                        <div className="abp__error">
                          <IconAlert /> Guest count exceeds room capacity.
                        </div>
                      )}
                      {childrenViolation && (
                        <div className="abp__error">
                          <IconAlert /> A selected room does not allow children.
                        </div>
                      )}
                      <button className="abp__reserve-btn" onClick={reserveAll} disabled={hasAnyIssue}>
                        {hasAnyIssue ? "Resolve issues first" : "Reserve"}
                      </button>
                      <div className="abp__note">It only takes 2 minutes</div>
                      <div className="abp__note">No charge today</div>
                    </div>
                  ) : (
                    <div className="abp abp--empty">
                      <div className="abp__empty-hint">
                        Select rooms above to start your reservation
                      </div>
                      <button className="abp__reserve-btn" disabled>Reserve</button>
                      <div className="abp__note">It only takes 2 minutes</div>
                      <div className="abp__note">No charge today</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="avail-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="avail-modal" onClick={e => e.stopPropagation()}>
            <div className="avail-modal__title">Select your dates</div>
            <div className="avail-modal__body">
              Please enter your check-in and check-out dates to see available rooms and prices.
            </div>
            <button className="avail-modal__ok" onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AvailabilityTable;