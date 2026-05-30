import React, { useState } from "react";
import "./AdminHost.css";
import { useParams, useNavigate } from "react-router-dom";

const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

function fmtDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function fmtPrice(v, currency = "NGN") {
  const n = Number(v || 0);
  return n > 0 ? ngn.format(n) : "—";
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f0ede8" }}>
        <i className={`ti ${icon}`} style={{ fontSize: 18, color: "#1a3a5c" }} aria-hidden="true" />
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a2b40" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, full = false, accent = false }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: accent ? "#15803d" : "#1a2b40", fontWeight: accent ? 600 : 400 }}>{value}</div>
    </div>
  );
}

function FieldGrid({ children, cols = 3 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "14px 20px" }}>
      {children}
    </div>
  );
}

function Pill({ children, color = "#e8f0fe", textColor = "#1a3a5c" }) {
  if (!children) return null;
  return (
    <span style={{ display: "inline-block", background: color, color: textColor, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 500, marginRight: 6, marginBottom: 6 }}>
      {children}
    </span>
  );
}

function PillList({ items, color, textColor }) {
  const arr = normalizeArr(items);
  if (!arr.length) return <span style={{ fontSize: 13, color: "#9a9890" }}>None listed</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
      {arr.map((item, i) => <Pill key={item + i} color={color} textColor={textColor}>{item}</Pill>)}
    </div>
  );
}

function normalizeArr(v, depth = 0) {
  if (!v || depth > 6) return [];
  if (Array.isArray(v)) {
    const out = [];
    for (const item of v) {
      if (typeof item === "string") {
        const t = item.trim();
        if (t.startsWith("[") || t.startsWith('"')) {
          try { out.push(...normalizeArr(JSON.parse(t), depth + 1)); continue; } catch {}
        }
        if (t) out.push(t);
      } else if (typeof item === "object" && item !== null) {
        if (item.text) out.push(item.text);
        else if (item.name) out.push(item.name);
      }
    }
    return [...new Set(out)];
  }
  if (typeof v === "string") {
    const t = v.trim();
    if (t.startsWith("[") || t.startsWith('"')) {
      try { return normalizeArr(JSON.parse(t), depth + 1); } catch {}
    }
    return t ? t.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }
  return [];
}

function InfoCard({ children, style = {} }) {
  return (
    <div style={{ background: "#faf9f6", border: "1px solid #e8e5de", borderRadius: 10, padding: 16, ...style }}>
      {children}
    </div>
  );
}

function PolicyChip({ label, value, ok }) {
  const bg    = ok === true ? "#f0fdf4" : ok === false ? "#fff0f0" : "#f5f4f1";
  const color = ok === true ? "#15803d" : ok === false ? "#c0392b" : "#5a5a52";
  return (
    <div style={{ background: bg, border: `1px solid ${ok === true ? "#bbf7d0" : ok === false ? "#fcd0cc" : "#e8e5de"}`, borderRadius: 8, padding: "10px 14px", minWidth: 110 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color }}>{value || "—"}</div>
    </div>
  );
}

export default function AdminPropertyDetails({ listings = [] }) {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [maskAccount, setMaskAccount] = useState(true);

  const property = listings.find((item) => String(item.id) === String(id));

  if (!property) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#9a9890" }}>
        <i className="ti ti-building-off" style={{ fontSize: 48, display: "block", marginBottom: 12, opacity: 0.4 }} aria-hidden="true" />
        Property not found.{" "}
        <button className="ap-btn ap-btn--ghost" style={{ marginTop: 12 }} onClick={() => navigate(-1)}>
          <i className="ti ti-arrow-left" /> Go back
        </button>
      </div>
    );
  }

  const r = property.raw || {};

  // Collect all images
  const images = [
    property.mainImage,
    ...(Array.isArray(property.images) ? property.images.map((img) => img?.image_url || img) : []),
  ].filter(Boolean);

  const heroImage    = images[0];
  const galleryImgs  = images.slice(1, 6);

  const hostFullName = [property.firstName, property.lastName].filter(Boolean).join(" ") || property.hostName || "—";
  const bankDetails  = r.bank_details || r.bankDetails || null;

  const accountDisplay = bankDetails?.account_number
    ? maskAccount
      ? "•••• •••• " + String(bankDetails.account_number).slice(-4)
      : bankDetails.account_number
    : null;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>

      {/* Back */}
      <button
        className="ap-btn ap-btn--ghost"
        style={{ marginBottom: 20 }}
        onClick={() => navigate(-1)}
      >
        <i className="ti ti-arrow-left" aria-hidden="true" /> Back to properties
      </button>

      {/* Hero */}
      <div style={{ borderRadius: 16, overflow: "hidden", position: "relative", height: 300, background: "#1a2b40", marginBottom: 12 }}>
        {heroImage && (
          <img src={heroImage} alt={property.propertyName} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,28,46,0.85) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: 22, left: 24, right: 24 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            {property.type && (
              <span style={{ background: "#1a3a5c", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
                {property.type}
              </span>
            )}
            <span style={{
              background: property.isApproved ? "#15803d" : "#b45309",
              color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600,
            }}>
              {property.isApproved ? "Approved" : "Pending approval"}
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display', serif" }}>
            {property.propertyName}
          </h1>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 5 }}>
            <i className="ti ti-map-pin" style={{ marginRight: 4 }} aria-hidden="true" />
            {[property.address, property.city, property.country].filter(Boolean).join(", ") || "Location not set"}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {galleryImgs.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 2 }}>
          {galleryImgs.map((img, i) => (
            <img key={img + i} src={img} alt="" style={{ width: 140, height: 90, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
          ))}
        </div>
      )}

      {/* Quick stats bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24, background: "#fff", borderRadius: 12, border: "1px solid #e8e5de", padding: "16px 20px", alignItems: "center" }}>
        {[
          { icon: "ti-star", label: "Rating",   value: `${property.avgRating ?? "—"} / 5` },
          { icon: "ti-message-circle", label: "Reviews",  value: String(property.totalReviews ?? 0) },
          { icon: "ti-calendar-event", label: "Bookings", value: String(property.totalBookings ?? 0) },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 20, borderRight: "1px solid #f0ede8" }}>
            <i className={`ti ${s.icon}`} style={{ fontSize: 18, color: "#1a3a5c" }} aria-hidden="true" />
            <div>
              <div style={{ fontSize: 11, color: "#9a9890", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2b40" }}>{s.value}</div>
            </div>
          </div>
        ))}
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px" }}>From</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1a2b40" }}>
            {fmtPrice(property.currentPrice || property.originalPrice)}
          </div>
          <div style={{ fontSize: 12, color: "#9a9890" }}>
            {(property.pricingType || "per_night").replace(/_/g, " ")}
          </div>
        </div>
      </div>

      {/* Main content card */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e5de", padding: "28px 28px 12px" }}>

        {/* Check-in / Check-out / Policies */}
        {(property.checkInFrom || property.checkOutFrom || property.smokingAllowed !== undefined) && (
          <Section title="Check-in & policies" icon="ti-door-enter">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {property.checkInFrom && (
                <PolicyChip label="Check-in"   value={`${property.checkInFrom} – ${property.checkInUntil || ""}`} />
              )}
              {property.checkOutFrom && (
                <PolicyChip label="Check-out"  value={`${property.checkOutFrom} – ${property.checkOutUntil || ""}`} />
              )}
              {property.smokingAllowed !== undefined && (
                <PolicyChip label="Smoking"    value={property.smokingAllowed ? "Allowed" : "Not allowed"} ok={Boolean(property.smokingAllowed)} />
              )}
              {property.lastMinuteBookings !== undefined && (
                <PolicyChip label="Last minute" value={property.lastMinuteBookings ? "Allowed" : "Not allowed"} ok={Boolean(property.lastMinuteBookings)} />
              )}
              {property.cancellation && (
                <PolicyChip label="Cancellation" value={property.cancellation} />
              )}
            </div>
          </Section>
        )}

        {/* About property */}
        {(property.aboutProperty || r.about_property) && (
          <Section title="About this property" icon="ti-info-circle">
            <p style={{ color: "#444", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
              {property.aboutProperty || r.about_property}
            </p>
          </Section>
        )}

        {/* Rooms */}
        {property.rooms?.length > 0 && (
          <Section title={`Rooms (${property.rooms.length})`} icon="ti-door">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {property.rooms.map((room, i) => (
                <InfoCard key={room.id || i}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1a2b40" }}>{room.name || `Room ${i + 1}`}</div>
                      <div style={{ fontSize: 12, color: "#9a9890", marginTop: 2 }}>
                        {[room.bedType && `Bed: ${room.bedType}`, room.guests && `${room.guests} guests`].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {room.originalPrice && room.originalPrice !== room.currentPrice && (
                        <div style={{ fontSize: 12, textDecoration: "line-through", color: "#9a9890" }}>
                          {fmtPrice(room.originalPrice)}
                        </div>
                      )}
                      {room.currentPrice && (
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#15803d" }}>
                          {fmtPrice(room.currentPrice)}
                        </div>
                      )}
                    </div>
                  </div>
                  {normalizeArr(room.features).length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Features</div>
                      <PillList items={room.features} color="#e8f0fe" textColor="#1a3a5c" />
                    </div>
                  )}
                  {normalizeArr(room.amenities).length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Amenities</div>
                      <PillList items={room.amenities} color="#f0fdf4" textColor="#15803d" />
                    </div>
                  )}
                </InfoCard>
              ))}
            </div>
          </Section>
        )}

        {/* Popular facilities */}
        {property.popularFacilities?.length > 0 && (
          <Section title="Popular facilities" icon="ti-building-community">
            <PillList items={property.popularFacilities} color="#e8f0fe" textColor="#1a3a5c" />
          </Section>
        )}

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <Section title="Amenities" icon="ti-checkbox">
            <PillList items={property.amenities} color="#f3e8ff" textColor="#7e22ce" />
          </Section>
        )}

        {/* Highlights */}
        {property.highlights?.length > 0 && (
          <Section title="Highlights" icon="ti-star">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {property.highlights.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "6px 12px" }}>
                  {h.icon && <span style={{ fontSize: 16 }}>{h.icon}</span>}
                  <span style={{ fontSize: 13, color: "#065f46", fontWeight: 500 }}>{h.text || h}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* House rules */}
        {(property.childrenPolicy || property.petsPolicy || property.cotPolicy || property.ageRestriction || property.finePrint || property.parties) && (
          <Section title="House rules" icon="ti-file-text">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 14 }}>
              {property.childrenPolicy && (
                <InfoCard>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", marginBottom: 3 }}>Children</div>
                  <div style={{ fontSize: 13, color: "#1a2b40" }}>{property.childrenPolicy}</div>
                </InfoCard>
              )}
              {property.petsPolicy && (
                <InfoCard>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", marginBottom: 3 }}>Pets</div>
                  <div style={{ fontSize: 13, color: "#1a2b40" }}>{property.petsPolicy}</div>
                </InfoCard>
              )}
              {property.cotPolicy && (
                <InfoCard>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", marginBottom: 3 }}>Cot policy</div>
                  <div style={{ fontSize: 13, color: "#1a2b40" }}>{property.cotPolicy}</div>
                </InfoCard>
              )}
              {property.ageRestriction && (
                <InfoCard>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", marginBottom: 3 }}>Age restriction</div>
                  <div style={{ fontSize: 13, color: "#1a2b40" }}>{property.ageRestriction}</div>
                </InfoCard>
              )}
              {property.parties && (
                <InfoCard>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", marginBottom: 3 }}>Parties</div>
                  <div style={{ fontSize: 13, color: "#1a2b40" }}>{property.parties}</div>
                </InfoCard>
              )}
            </div>
            {property.finePrint && (
              <InfoCard>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", marginBottom: 6 }}>Fine print</div>
                <div style={{ fontSize: 13, color: "#444", lineHeight: 1.65 }}>{property.finePrint}</div>
              </InfoCard>
            )}
          </Section>
        )}

        {/* FAQs */}
        {property.faqs?.length > 0 && (
          <Section title="FAQs" icon="ti-help-circle">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {property.faqs.map((faq, i) => (
                <InfoCard key={i}>
                  <div style={{ fontWeight: 700, color: "#1a3a5c", marginBottom: 4, fontSize: 13 }}>{faq.question}</div>
                  <div style={{ color: "#444", fontSize: 13, lineHeight: 1.6 }}>{faq.answer}</div>
                </InfoCard>
              ))}
            </div>
          </Section>
        )}

        {/* Pricing details */}
        {(property.cleaningFee || property.weekendRate || property.taxesIncluded !== undefined) && (
          <Section title="Pricing details" icon="ti-currency-naira">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {property.cleaningFee && (
                <InfoCard>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", marginBottom: 3 }}>Cleaning fee</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1a2b40" }}>{fmtPrice(property.cleaningFee)}</div>
                </InfoCard>
              )}
              {property.weekendRate && (
                <InfoCard>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", marginBottom: 3 }}>Weekend rate</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1a2b40" }}>{fmtPrice(property.weekendRate)}</div>
                </InfoCard>
              )}
              {property.taxesIncluded !== undefined && (
                <InfoCard>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", marginBottom: 3 }}>Taxes</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: property.taxesIncluded ? "#15803d" : "#c0392b" }}>
                    {property.taxesIncluded ? "Included" : "Not included"}
                  </div>
                </InfoCard>
              )}
            </div>
          </Section>
        )}

        {/* ── HOST INFORMATION ─────────────────────────────────────────── */}
        <Section title="Host information" icon="ti-user-circle">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Identity */}
            <InfoCard>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 12 }}>Identity</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #1a3a5c, #2d6b9f)", color: "#fff", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {(property.firstName || property.hostName || "H")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1a2b40" }}>{hostFullName}</div>
                  {property.email && <div style={{ fontSize: 12, color: "#9a9890" }}>{property.email}</div>}
                </div>
              </div>
              <FieldGrid cols={1}>
                {property.email    && <Field label="Email"  value={property.email} />}
                {property.phone    && <Field label="Phone"  value={property.phone} />}
                {r.middle_name     && <Field label="Middle name" value={r.middle_name} />}
              </FieldGrid>
            </InfoCard>

            {/* Legal address */}
            <InfoCard>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 12 }}>Legal address</div>
              <FieldGrid cols={1}>
                <Field label="Address line 1" value={property.addressLine1} />
                <Field label="Address line 2" value={property.addressLine2} />
                <Field label="City"           value={property.city || r.host_city} />
                <Field label="Country"        value={property.country || r.host_country} />
                {r.zip_code        && <Field label="Zip / postal code" value={r.zip_code} />}
                {r.apartment       && <Field label="Apartment / suite"  value={r.apartment} />}
              </FieldGrid>
            </InfoCard>
          </div>

          {/* Legal verification */}
          {(property.informationCertified || r.terms_accepted) && (
            <InfoCard style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>Verification</div>
              <FieldGrid cols={2}>
                {property.informationCertified && <Field label="Information certified" value={property.informationCertified} />}
                {r.terms_accepted              && <Field label="Terms accepted"         value={r.terms_accepted} />}
              </FieldGrid>
            </InfoCard>
          )}
        </Section>

        {/* ── BANK / PAYOUT DETAILS ─────────────────────────────────────── */}
        <Section title="Bank & payout details" icon="ti-building-bank">
          {bankDetails ? (
            <InfoCard>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px 20px" }}>
                <Field label="Bank name"      value={bankDetails.bank_name || bankDetails.bankName} />
                <Field label="Account name"   value={bankDetails.account_name || bankDetails.accountName} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>Account number</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13.5, color: "#1a2b40", fontFamily: "monospace" }}>
                      {accountDisplay || "—"}
                    </span>
                    {bankDetails.account_number && (
                      <button
                        onClick={() => setMaskAccount(!maskAccount)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#1a3a5c", padding: 0, fontSize: 15 }}
                        title={maskAccount ? "Show" : "Hide"}
                      >
                        <i className={`ti ${maskAccount ? "ti-eye" : "ti-eye-off"}`} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
                {(bankDetails.bank_code || bankDetails.bankCode) && (
                  <Field label="Bank code" value={bankDetails.bank_code || bankDetails.bankCode} />
                )}
              </div>
              {(bankDetails.paystack_subaccount_code || bankDetails.paystackSubaccountCode) && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #e8e5de" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Paystack subaccount</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 13, color: "#1a2b40" }}>
                      {bankDetails.paystack_subaccount_code || bankDetails.paystackSubaccountCode}
                    </span>
                    <span className="ap-badge ap-badge--approved">
                      <i className="ti ti-circle-check" style={{ fontSize: 11, marginRight: 3 }} />Linked
                    </span>
                  </div>
                </div>
              )}
            </InfoCard>
          ) : (
            <InfoCard>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b45309", fontSize: 13 }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: 16 }} aria-hidden="true" />
                No bank details on file for this host. Paystack payouts are unavailable until bank details are added.
              </div>
            </InfoCard>
          )}
        </Section>

        {/* ── PAYMENT VERIFICATION ─────────────────────────────────────── */}
        <Section title="Payment verification" icon="ti-shield-check">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <PolicyChip
              label="Payment verified"
              value={r.payment_verified == 1 ? "Verified" : "Not verified"}
              ok={r.payment_verified == 1}
            />
            <PolicyChip
              label="First stay confirmed"
              value={r.first_stay_confirmed == 1 ? "Confirmed" : "Pending"}
              ok={r.first_stay_confirmed == 1}
            />
            {r.first_stay_booking_id && (
              <PolicyChip label="First stay booking ID" value={`#${r.first_stay_booking_id}`} />
            )}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "#9a9890", lineHeight: 1.6 }}>
            Payment verification unlocks Paystack online payment for future bookings. Unverified properties are pay-at-property only.
          </div>
        </Section>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 14, paddingBottom: 4, display: "flex", justifyContent: "space-between", color: "#9a9890", fontSize: 12 }}>
          <span>Property ID: {property.id}</span>
          <span>Listed on {fmtDate(property.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}