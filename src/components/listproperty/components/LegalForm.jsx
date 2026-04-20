import { useState } from "react";
import { C } from "../ui.constants.js";
import { Card, FormField, TextInput, SelectInput, PrimaryBtn } from "../ui.jsx";
import "./LegalForm.css";

const COUNTRIES = [
  "Benin",
  "Burkina Faso",
  "Cape Verde",
  "Cote d'Ivoire",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Liberia",
  "Mali",
  "Mauritania",
  "Niger",
  "Nigeria",
  "Senegal",
  "Sierra Leone",
  "Togo",
];

const DIAL_CODES = [
  { country: "Benin", flag: "🇧🇯", code: "+229" },
  { country: "Burkina Faso", flag: "🇧🇫", code: "+226" },
  { country: "Cape Verde", flag: "🇨🇻", code: "+238" },
  { country: "Côte d'Ivoire", flag: "🇨🇮", code: "+225" },
  { country: "Gambia", flag: "🇬🇲", code: "+220" },
  { country: "Ghana", flag: "🇬🇭", code: "+233" },
  { country: "Guinea", flag: "🇬🇳", code: "+224" },
  { country: "Guinea-Bissau", flag: "🇬🇼", code: "+245" },
  { country: "Liberia", flag: "🇱🇷", code: "+231" },
  { country: "Mali", flag: "🇲🇱", code: "+223" },
  { country: "Mauritania", flag: "🇲🇷", code: "+222" },
  { country: "Niger", flag: "🇳🇪", code: "+227" },
  { country: "Nigeria", flag: "🇳🇬", code: "+234" },
  { country: "Senegal", flag: "🇸🇳", code: "+221" },
  { country: "Sierra Leone", flag: "🇸🇱", code: "+232" },
  { country: "Togo", flag: "🇹🇬", code: "+228" },
];

const FAQ_ITEMS = [
  {
    icon: "📅",
    q: "Can I decide when I get bookings?",
    a: "Yes. The best way to do this is to keep your calendar up-to-date. Close any dates you don't want a booking on. If you have bookings on other sites, close these dates as well.",
  },
  {
    icon: "✅",
    q: "Are bookings confirmed straight away?",
    a: "Yes. They're confirmed as soon as a guest makes a booking.",
  },
  {
    icon: "👥",
    q: "Can I choose who stays at my place?",
    a: "No. If a date is open in your calendar, all guests using our site can book it.",
  },
];

const NOT_READY_OPTIONS = [
  "My property isn't ready to accept guests",
  "I want to connect my channel manager",
  "I want to update my calendar",
  "I have more details to add (photos, facilities, pricing, etc.)",
  "Something else",
];

const ERROR_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  country: "Country / Region",
  addressLine1: "Address line 1",
  city: "City",
  agree1: "Business certification",
  agree2: "General Delivery Terms",
};

/* ── Styled checkbox agreement card ── */
function AgreementCard({ checked, onChange, children, error }) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: "100%",
          textAlign: "left",
          background: checked ? "#e8f5f3" : C.white,
          border: `2px solid ${checked ? C.teal : C.border}`,
          borderRadius: 12,
          padding: "14px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          transition: "all 0.2s",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            border: `2px solid ${checked ? C.teal : C.border}`,
            background: checked ? C.teal : C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
            transition: "all 0.2s",
          }}
        >
          {checked && (
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path
                d="M1 4l3.5 3.5L11 1"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span style={{ fontSize: 14, color: C.midnightBlue, lineHeight: 1.6 }}>
          {children}
        </span>
      </button>
      {error && (
        <p style={{ fontSize: 12, color: C.error, margin: "4px 0 0 6px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Section header with number badge ── */
function SectionHeader({ number, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
        paddingBottom: 14,
        borderBottom: `1px solid #f0ece6`,
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: C.teal,
          color: C.white,
          fontSize: 13,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <span style={{ fontWeight: 700, fontSize: 17, color: C.midnightBlue }}>
        {children}
      </span>
    </div>
  );
}

/* ── Individual FAQ card ── */
function FaqCard({ icon, q, a }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "14px 16px",
        background: "#f7f5f2",
        borderRadius: 12,
        borderLeft: `4px solid ${C.teal}`,
      }}
    >
      <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1.3 }}>
        {icon}
      </span>
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: C.midnightBlue,
            marginBottom: 4,
          }}
        >
          {q}
        </div>
        <p
          style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, margin: 0 }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function LegalForm({ onBack, onSubmit, data = {}, setField }) {
  const [form, setForm] = useState({
    firstName: data.firstName || "",
    middleName: data.middleName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phone: data.phone || "",
    country: data.legalCountry || "",
    addressLine1: data.addressLine1 || "",
    addressLine2: data.addressLine2 || "",
    city: data.legalCity || "",
    zipCode: data.legalZipCode || "",
  });
  const [dialCode, setDialCode] = useState(data.dialCode || "+234");
  const [agree1, setAgree1] = useState(data.agree1 || false);
  const [agree2, setAgree2] = useState(data.agree2 || false);
  const [errors, setErrors] = useState({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showNotReadyModal, setShowNotReadyModal] = useState(false);
  const [notReadyReasons, setNotReadyReasons] = useState([]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    // Map form keys that differ from draft keys
    const draftKey = k === "country" ? "legalCountry" : k === "city" ? "legalCity" : k === "zipCode" ? "legalZipCode" : k;
    setField?.(draftKey, v);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!form.country) e.country = "Required";
    if (!form.addressLine1.trim()) e.addressLine1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!agree1) e.agree1 = "You must certify this information";
    if (!agree2) e.agree2 = "You must accept the terms";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validationSummaryItems = Object.entries(errors).map(([key, msg]) => {
    return `${ERROR_LABELS[key] || key}: ${msg}`;
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) {
      setShowValidationSummary(true);
      return;
    }
    setShowValidationSummary(false);
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        agreements: { informationCertified: agree1, termsAccepted: agree2 },
      });
    } catch (error) {
      setSubmitError(
        error?.message || "Could not submit your listing. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleNotReadyReason = (reason) => {
    setNotReadyReasons((cur) =>
      cur.includes(reason) ? cur.filter((r) => r !== reason) : [...cur, reason],
    );
  };

  return (
    <div className="lp-legal">
      <div className="lp-legal__inner">
        {/* ── Hero finish-line banner ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #19907e 0%, #0f6b5c 100%)",
            borderRadius: 16,
            padding: "24px 24px 22px",
            marginBottom: 24,
            color: C.white,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>🏁</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>
              You're almost live!
            </div>
            <div style={{ fontSize: 14, opacity: 0.88 }}>
              One last step — confirm your legal details and open your property
              for bookings.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Validation summary ── */}
          {showValidationSummary && validationSummaryItems.length > 0 && (
            <div className="lp-legal__validation-summary" role="alert">
              <strong>Please complete the required fields to continue.</strong>
              <ul className="lp-legal__validation-list">
                {validationSummaryItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Personal info ── */}
          <Card>
            <SectionHeader number="1">Personal details</SectionHeader>
            <FormField
              label="First name as stated on ID"
              required
              error={errors.firstName}
            >
              <TextInput
                value={form.firstName}
                onChange={(v) => set("firstName", v)}
              />
            </FormField>
            <FormField label="Middle name(s) as stated on ID">
              <TextInput
                value={form.middleName}
                onChange={(v) => set("middleName", v)}
              />
            </FormField>
            <FormField
              label="Last name as stated on ID"
              required
              error={errors.lastName}
            >
              <TextInput
                value={form.lastName}
                onChange={(v) => set("lastName", v)}
              />
            </FormField>
            <FormField label="Email" required error={errors.email}>
              <TextInput
                value={form.email}
                onChange={(v) => set("email", v)}
                type="email"
              />
            </FormField>
            <FormField label="Phone number" required error={errors.phone}>
              <div className="lp-legal__phone-wrapper">
                <select
                  className="lp-legal__phone-prefix"
                  value={dialCode}
                  onChange={(e) => { setDialCode(e.target.value); setField?.("dialCode", e.target.value); }}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                    outline: "none",
                  }}
                >
                  {DIAL_CODES.map(({ flag, code }) => (
                    <option key={code} value={code}>
                      {flag} {code}
                    </option>
                  ))}
                </select>
                <input
                  className="lp-legal__phone-input"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="800 000 0000"
                  type="tel"
                />
              </div>
            </FormField>
          </Card>

          {/* ── Address ── */}
          <Card>
            <SectionHeader number="2">Primary residence</SectionHeader>
            <FormField label="Country" required error={errors.country}>
              <SelectInput
                value={form.country}
                onChange={(v) => set("country", v)}
                options={COUNTRIES}
                placeholder="Select country"
              />
            </FormField>
            <FormField
              label="Address line 1"
              required
              error={errors.addressLine1}
            >
              <TextInput
                value={form.addressLine1}
                onChange={(v) => set("addressLine1", v)}
              />
            </FormField>
            <FormField label="Address line 2">
              <TextInput
                value={form.addressLine2}
                onChange={(v) => set("addressLine2", v)}
              />
            </FormField>
            <div className="lp-legal__address-grid">
              <FormField label="City" required error={errors.city}>
                <TextInput value={form.city} onChange={(v) => set("city", v)} />
              </FormField>
              <FormField label="Post code / Zip code">
                <TextInput
                  value={form.zipCode}
                  onChange={(v) => set("zipCode", v)}
                />
              </FormField>
            </div>
          </Card>

          {/* ── FAQs ── */}
          <Card>
            <SectionHeader number="3">Before you go live</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FAQ_ITEMS.map((item) => (
                <FaqCard key={item.q} icon={item.icon} q={item.q} a={item.a} />
              ))}
            </div>
          </Card>

          {/* ── Agreements ── */}
          <Card>
            <SectionHeader number="4">Your agreements</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <AgreementCard
                checked={agree1}
                onChange={(v) => { setAgree1(v); setField?.("agree1", v); }}
                error={errors.agree1}
              >
                I certify that this is a legitimate accommodation business with
                all necessary licenses and permits, which can be shown upon
                first request. Staylist reserves the right to verify and
                investigate any details provided in this registration.
              </AgreementCard>
              <AgreementCard
                checked={agree2}
                onChange={(v) => { setAgree2(v); setField?.("agree2", v); }}
                error={errors.agree2}
              >
                I have read, accepted, and agreed to the{" "}
                <a href="#" style={{ color: C.teal, fontWeight: 600 }}>
                  General Delivery Terms
                </a>
                .
              </AgreementCard>
            </div>

            {/* Trust row */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginTop: 20,
                paddingTop: 16,
                borderTop: `1px solid #f0ece6`,
                flexWrap: "wrap",
              }}
            >
              {[
                "🔒 Secure & encrypted",
                "✓ No hidden fees",
                "📋 Cancel anytime",
              ].map((item) => (
                <span
                  key={item}
                  style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Submit */}
            <div style={{ marginTop: 20 }}>
              <PrimaryBtn
                disabled={submitting}
                fullWidth
                style={{
                  fontSize: 17,
                  padding: "17px",
                  letterSpacing: "0.01em",
                }}
              >
                {submitting ? "Submitting…" : "Submit"}
              </PrimaryBtn>
              <button
                className="lp-legal__not-ready"
                type="button"
                onClick={() => setShowNotReadyModal(true)}
              >
                I'm not ready yet
              </button>
              {submitError && (
                <p
                  style={{
                    color: C.error,
                    fontSize: 13,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  {submitError}
                </p>
              )}
            </div>
          </Card>
        </form>
      </div>

      {/* ── Not ready modal ── */}
      {showNotReadyModal && (
        <div
          className="lp-legal__modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lp-not-ready-title"
        >
          <div className="lp-legal__modal-card">
            <button
              type="button"
              className="lp-legal__modal-close"
              onClick={() => setShowNotReadyModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 id="lp-not-ready-title" className="lp-legal__modal-title">
              Is there a reason you don't want to open for bookings?
            </h2>
            <div className="lp-legal__modal-options">
              {NOT_READY_OPTIONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => toggleNotReadyReason(reason)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: `1.5px solid ${notReadyReasons.includes(reason) ? C.teal : C.border}`,
                    background: notReadyReasons.includes(reason)
                      ? "#e8f5f3"
                      : C.white,
                    color: C.midnightBlue,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      border: `2px solid ${notReadyReasons.includes(reason) ? C.teal : C.border}`,
                      background: notReadyReasons.includes(reason)
                        ? C.teal
                        : C.white,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {notReadyReasons.includes(reason) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 3.5l2.5 2.5L9 1"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {reason}
                </button>
              ))}
            </div>
            <PrimaryBtn
              onClick={() => {
                setShowNotReadyModal(false);
                onBack();
              }}
              fullWidth
              style={{ fontSize: 16, padding: "15px" }}
            >
              Submit and continue registering
            </PrimaryBtn>
          </div>
        </div>
      )}
    </div>
  );
}
