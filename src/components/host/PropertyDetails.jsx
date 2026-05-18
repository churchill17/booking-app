import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBankDetails } from "./services/hostApi";
import "./PropertyDetails.css";

// ── SVG Icon system — fast, no external deps ──────────────────
const I = {
  Back: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  MapPin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  MessageCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  TrendingUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Bed: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
  Wifi: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Phone: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/></svg>,
  CreditCard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  DollarSign: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Info: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  List: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};

// ── Helpers ───────────────────────────────────────────────────
function toStringArr(v, depth = 0) {
  if (!v || depth > 8) return [];
  if (Array.isArray(v)) {
    const items = [];
    for (const item of v) {
      if (typeof item !== "string") continue;
      const t = item.trim();
      if (t.startsWith("[") || t.startsWith('"')) {
        try { items.push(...toStringArr(JSON.parse(t), depth + 1)); continue; } catch {}
      }
      if (t) items.push(item);
    }
    return [...new Set(items)];
  }
  if (typeof v === "string") {
    const t = v.trim();
    if (t.startsWith("[") || t.startsWith('"')) {
      try { return toStringArr(JSON.parse(t), depth + 1); } catch {}
    }
    return t ? t.split(",").map(s => s.trim()).filter(Boolean) : [];
  }
  return [];
}

const fmt = (n, currency = "NGN") =>
  n ? `${currency} ${Number(n).toLocaleString()}` : null;

// ── Sub-components ────────────────────────────────────────────
const Chip = ({ children, color = "teal" }) => (
  <span className={`pd2-chip pd2-chip--${color}`}>{children}</span>
);

const SectionCard = ({ icon: Icon, title, children, accent }) => (
  <div className="pd2-section" style={accent ? { borderLeftColor: accent } : {}}>
    <div className="pd2-section__head">
      <span className="pd2-section__icon">{Icon && <Icon />}</span>
      <h3 className="pd2-section__title">{title}</h3>
    </div>
    <div className="pd2-section__body">{children}</div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, valueColor }) => (
  value ? (
    <div className="pd2-info-row">
      <span className="pd2-info-row__icon">{Icon && <Icon />}</span>
      <span className="pd2-info-row__label">{label}</span>
      <span className="pd2-info-row__value" style={valueColor ? { color: valueColor } : {}}>{value}</span>
    </div>
  ) : null
);

const PolicyBadge = ({ label, allowed }) => (
  <div className={`pd2-policy-badge ${allowed ? "pd2-policy-badge--yes" : "pd2-policy-badge--no"}`}>
    <span className="pd2-policy-badge__icon">{allowed ? <I.Check /> : <I.X />}</span>
    <span>{label}</span>
  </div>
);

const FAQ = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`pd2-faq ${open ? "pd2-faq--open" : ""}`}>
      <button className="pd2-faq__q" onClick={() => setOpen(o => !o)}>
        <span>{question}</span>
        <span className="pd2-faq__chevron">{open ? <I.ChevronUp /> : <I.ChevronDown />}</span>
      </button>
      {open && <div className="pd2-faq__a">{answer}</div>}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────
export default function PropertyDetails({ listings = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bankDetails, setBankDetails] = useState(null);
  const [showAccount, setShowAccount] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const property = listings.find(item => String(item.id) === String(id));

  useEffect(() => {
    getBankDetails().then(setBankDetails).catch(() => {});
  }, []);

  if (!property) {
    return (
      <div className="pd2-empty">
        <I.Home />
        <p>Property not found.</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  // Images
  const images = [
    ...(property.images?.length > 0
      ? property.images.map(img => img.image_url || img)
      : []),
    property.mainImage,
  ].filter(Boolean);

  const currency = property.currency || "NGN";
  const currentPrice = Number(property.currentPrice || property.originalPrice || 0);
  const originalPrice = Number(property.originalPrice || 0);
  const hasDiscount = originalPrice > 0 && currentPrice > 0 && currentPrice < originalPrice;
  const discountPct = hasDiscount ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;

  const accommodations = toStringArr(property.accommodations);
  const dining = toStringArr(property.descriptionDining);
  const locationDesc = toStringArr(property.locationDescription || property.location);

  return (
    <div className="pd2-page">

      {/* Back */}
      <button className="pd2-back" onClick={() => navigate(-1)}>
        <I.Back /> Back to listings
      </button>

      {/* ── Hero ── */}
      <div className="pd2-hero">
        {images.length > 0 && (
          <div className="pd2-hero__main-img">
            <img src={images[activeImg]} alt={property.propertyName} />
            <div className="pd2-hero__overlay" />
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="pd2-hero__thumbs">
            {images.slice(0, 6).map((img, i) => (
              <button
                key={i}
                className={`pd2-hero__thumb ${i === activeImg ? "pd2-hero__thumb--active" : ""}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        )}

        {/* Hero content */}
        <div className="pd2-hero__content">
          <div className="pd2-hero__badges">
            {property.type && <span className="pd2-badge pd2-badge--type">{property.type}</span>}
            <span className={`pd2-badge ${property.isApproved ? "pd2-badge--approved" : "pd2-badge--pending"}`}>
              {property.status || (property.isApproved ? "Approved" : "Pending")}
            </span>
          </div>
          <h1 className="pd2-hero__title">{property.propertyName}</h1>
          <div className="pd2-hero__location">
            <I.MapPin />
            {[property.address, property.city, property.country].filter(Boolean).join(", ")}
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="pd2-stats">
        <div className="pd2-stat">
          <span className="pd2-stat__icon pd2-stat__icon--star"><I.Star /></span>
          <div>
            <div className="pd2-stat__val">{property.avgRating ? Number(property.avgRating).toFixed(1) : "—"}</div>
            <div className="pd2-stat__label">Rating</div>
          </div>
        </div>
        <div className="pd2-stat">
          <span className="pd2-stat__icon pd2-stat__icon--msg"><I.MessageCircle /></span>
          <div>
            <div className="pd2-stat__val">{property.totalReviews ?? "—"}</div>
            <div className="pd2-stat__label">Reviews</div>
          </div>
        </div>
        <div className="pd2-stat">
          <span className="pd2-stat__icon pd2-stat__icon--trend"><I.TrendingUp /></span>
          <div>
            <div className="pd2-stat__val">{property.totalBookings ?? "—"}</div>
            <div className="pd2-stat__label">Bookings</div>
          </div>
        </div>
        <div className="pd2-stat pd2-stat--price">
          {hasDiscount && (
            <div className="pd2-stat__original">{fmt(originalPrice, currency)}</div>
          )}
          <div className="pd2-stat__price">{fmt(currentPrice, currency) || "—"}</div>
          <div className="pd2-stat__label">
            {(property.pricingType || "per_night").replace("_", " ")}
            {hasDiscount && <span className="pd2-stat__discount">−{discountPct}%</span>}
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="pd2-layout">

        {/* ── LEFT COLUMN ── */}
        <div className="pd2-left">

          {/* Check-in / out */}
          {(property.checkInFrom || property.checkOutFrom) && (
            <SectionCard icon={I.Clock} title="Check-in & Check-out">
              <div className="pd2-checkinout">
                {property.checkInFrom && (
                  <div className="pd2-checkinout__item pd2-checkinout__item--in">
                    <div className="pd2-checkinout__label">Check-in</div>
                    <div className="pd2-checkinout__time">
                      {property.checkInFrom}{property.checkInUntil ? ` – ${property.checkInUntil}` : ""}
                    </div>
                  </div>
                )}
                {property.checkOutFrom && (
                  <div className="pd2-checkinout__item pd2-checkinout__item--out">
                    <div className="pd2-checkinout__label">Check-out</div>
                    <div className="pd2-checkinout__time">
                      {property.checkOutFrom}{property.checkOutUntil ? ` – ${property.checkOutUntil}` : ""}
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Property policies */}
          <SectionCard icon={I.Shield} title="Property Policies">
            <div className="pd2-policies">
              {typeof property.smokingAllowed !== "undefined" && (
                <PolicyBadge label="Smoking" allowed={property.smokingAllowed} />
              )}
              {typeof property.lastMinuteBookings !== "undefined" && (
                <PolicyBadge label="Last-minute bookings" allowed={property.lastMinuteBookings} />
              )}
              {typeof property.excludeInfants !== "undefined" && (
                <PolicyBadge label="Infants welcome" allowed={!property.excludeInfants} />
              )}
              {property.childrenPolicy && (
                <div className="pd2-policy-text">
                  <strong>Children:</strong> {property.childrenPolicy}
                </div>
              )}
              {property.petsPolicy && (
                <div className="pd2-policy-text">
                  <strong>Pets:</strong> {property.petsPolicy}
                </div>
              )}
              {property.cancellation && (
                <div className="pd2-policy-text">
                  <strong>Cancellation:</strong> {property.cancellation}
                </div>
              )}
              {property.cotPolicy && (
                <div className="pd2-policy-text">
                  <strong>Cots:</strong> {property.cotPolicy}
                </div>
              )}
              {property.ageRestriction && (
                <div className="pd2-policy-text">
                  <strong>Age restriction:</strong> {property.ageRestriction}
                </div>
              )}
              {property.parties && (
                <div className="pd2-policy-text">
                  <strong>Parties:</strong> {property.parties}
                </div>
              )}
              {property.finePrint && (
                <div className="pd2-fineprint">
                  <I.Info /> {property.finePrint}
                </div>
              )}
            </div>
          </SectionCard>

          {/* Rooms */}
          {property.rooms?.length > 0 && (
            <SectionCard icon={I.Bed} title="Rooms">
              <div className="pd2-rooms">
                {property.rooms.map((room, i) => {
                  const rCurrent = Number(room.currentPrice || 0);
                  const rOriginal = Number(room.originalPrice || 0);
                  const rDiscount = rOriginal > 0 && rCurrent > 0 && rCurrent < rOriginal;
                  return (
                    <div key={room.id || i} className="pd2-room">
                      <div className="pd2-room__header">
                        <div className="pd2-room__name">{room.name || `Room ${i + 1}`}</div>
                        <div className="pd2-room__price-wrap">
                          {rDiscount && (
                            <span className="pd2-room__original">{fmt(rOriginal, currency)}</span>
                          )}
                          <span className="pd2-room__price">
                            {fmt(rCurrent || rOriginal, currency) || "Price on request"}
                          </span>
                          {rDiscount && room.discount && (
                            <span className="pd2-room__discount-badge">{room.discount}% off</span>
                          )}
                        </div>
                      </div>
                      <div className="pd2-room__meta">
                        {room.bedType && (
                          <span className="pd2-room__meta-item"><I.Bed /> {room.bedType}</span>
                        )}
                        {room.guests && (
                          <span className="pd2-room__meta-item"><I.Users /> {room.guests} guests</span>
                        )}
                        {room.size && (
                          <span className="pd2-room__meta-item">{room.size}</span>
                        )}
                        {room.availability && (
                          <span className="pd2-room__meta-item pd2-room__meta-item--avail">
                            {room.availability} available
                          </span>
                        )}
                      </div>
                      {room.deal && (
                        <div className="pd2-room__deal"><I.Zap /> {room.deal}</div>
                      )}
                      {Array.isArray(room.features) && room.features.length > 0 && (
                        <div className="pd2-room__chips">
                          {room.features.map(f => <Chip key={f} color="blue">{f}</Chip>)}
                        </div>
                      )}
                      {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                        <div className="pd2-room__chips">
                          {room.amenities.map(a => <Chip key={a} color="teal">{a}</Chip>)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {/* Facilities */}
          {property.popularFacilities?.length > 0 && (
            <SectionCard icon={I.Wifi} title="Popular Facilities">
              <div className="pd2-chips-wrap">
                {property.popularFacilities.map(f => (
                  <Chip key={f} color="teal">{f}</Chip>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <SectionCard icon={I.Check} title="Amenities">
              <div className="pd2-chips-wrap">
                {property.amenities.map(a => (
                  <Chip key={a} color="blue">{a}</Chip>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Descriptions */}
          {(accommodations.length > 0 || dining.length > 0 || locationDesc.length > 0) && (
            <SectionCard icon={I.List} title="About This Property">
              {accommodations.length > 0 && (
                <div className="pd2-desc-block">
                  <div className="pd2-desc-block__label">Accommodations</div>
                  <div className="pd2-chips-wrap">
                    {accommodations.map(a => <Chip key={a} color="blue">{a}</Chip>)}
                  </div>
                </div>
              )}
              {dining.length > 0 && (
                <div className="pd2-desc-block">
                  <div className="pd2-desc-block__label">Dining</div>
                  <div className="pd2-chips-wrap">
                    {dining.map(d => <Chip key={d} color="amber">{d}</Chip>)}
                  </div>
                </div>
              )}
              {locationDesc.length > 0 && (
                <div className="pd2-desc-block">
                  <div className="pd2-desc-block__label">Location</div>
                  <div className="pd2-chips-wrap">
                    {locationDesc.map(l => <Chip key={l} color="purple">{l}</Chip>)}
                  </div>
                </div>
              )}
            </SectionCard>
          )}

          {/* Highlights */}
          {property.highlights?.length > 0 && (
            <SectionCard icon={I.Zap} title="Highlights">
              <div className="pd2-highlights">
                {property.highlights.map((h, i) => (
                  <div key={i} className="pd2-highlight">
                    {h.icon && <span className="pd2-highlight__icon">{h.icon}</span>}
                    <span className="pd2-highlight__text">{h.text}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* FAQs */}
          {property.faqs?.length > 0 && (
            <SectionCard icon={I.MessageCircle} title="Frequently Asked Questions">
              <div className="pd2-faqs">
                {property.faqs.map((faq, i) => (
                  <FAQ key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="pd2-right">

          {/* Payment methods */}
          {property.paymentMethods?.length > 0 && (
            <SectionCard icon={I.CreditCard} title="Payment Methods">
              <div className="pd2-chips-wrap">
                {property.paymentMethods.map(pm => (
                  <Chip key={pm} color="teal">{pm}</Chip>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Pricing */}
          <SectionCard icon={I.DollarSign} title="Pricing">
            <div className="pd2-pricing">
              <InfoRow icon={I.Tag} label="Room price" value={fmt(currentPrice, currency)} />
              {hasDiscount && (
                <InfoRow icon={I.Tag} label="Original price" value={fmt(originalPrice, currency)} />
              )}
              {property.cleaningFee && (
                <InfoRow icon={I.Tag} label="Cleaning fee" value={fmt(property.cleaningFee, currency)} />
              )}
              <InfoRow
                icon={I.Info}
                label="Taxes"
                value={property.taxesIncluded ? "Included" : "Not included"}
                valueColor={property.taxesIncluded ? "#19907e" : "#c0392b"}
              />
              {property.pricingType && (
                <InfoRow icon={I.Info} label="Pricing type" value={property.pricingType.replace("_", " ")} />
              )}
            </div>
          </SectionCard>

          {/* Host info */}
          {(property.firstName || property.email || property.phone) && (
            <SectionCard icon={I.Users} title="Host Information">
              <div className="pd2-host">
                <div className="pd2-host__avatar">
                  {(property.firstName || property.email || "H")[0].toUpperCase()}
                </div>
                <div className="pd2-host__name">
                  {[property.firstName, property.middleName, property.lastName].filter(Boolean).join(" ") || "Host"}
                </div>
                <div className="pd2-host__details">
                  <InfoRow icon={I.Mail} label="Email" value={property.email} />
                  <InfoRow icon={I.Phone} label="Phone" value={property.phone} />
                  {property.addressLine1 && (
                    <InfoRow icon={I.Home} label="Address" value={[property.addressLine1, property.addressLine2].filter(Boolean).join(", ")} />
                  )}
                  {property.legalCity && (
                    <InfoRow icon={I.MapPin} label="City" value={property.legalCity} />
                  )}
                </div>
              </div>
            </SectionCard>
          )}

          {/* Bank details */}
          <SectionCard icon={I.Building} title="Bank / Payout Details">
            {bankDetails ? (
              <div className="pd2-bank">
                <InfoRow icon={I.Building} label="Bank" value={bankDetails.bank_name} />
                <InfoRow icon={I.Users} label="Account name" value={bankDetails.account_name} />
                <div className="pd2-bank__number-row">
                  <span className="pd2-info-row__icon"><I.CreditCard /></span>
                  <span className="pd2-info-row__label">Account number</span>
                  <span className="pd2-bank__number">
                    {showAccount
                      ? bankDetails.account_number
                      : "••••••" + bankDetails.account_number?.slice(-4)}
                  </span>
                  <button
                    className="pd2-bank__toggle"
                    onClick={() => setShowAccount(s => !s)}
                    title={showAccount ? "Hide" : "Show"}
                  >
                    {showAccount ? <I.EyeOff /> : <I.Eye />}
                  </button>
                </div>
                {bankDetails.paystack_subaccount_code && (
                  <div className="pd2-bank__subaccount">
                    <I.Shield /> Paystack subaccount active
                  </div>
                )}
              </div>
            ) : (
              <div className="pd2-bank__empty">
                No bank details saved yet. Add them in the listing wizard.
              </div>
            )}
          </SectionCard>

          {/* Listed date */}
          <div className="pd2-listed-date">
            <I.Calendar />
            Listed {property.createdAt
              ? new Date(property.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}