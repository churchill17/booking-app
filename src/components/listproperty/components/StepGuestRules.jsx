import React, { useState } from "react";
import { C } from "../ui.constants.js";
import {
  Card,
  StepHeading,
  FormField,
  RadioGroup,
  Toggle,
  PrimaryBtn,
} from "../ui.jsx";

/* ─── Policy preset options ──────────────────────────────────────── */
const POLICIES = [
  {
    key: "cancellation",
    icon: "🔄",
    title: "Cancellation",
    options: [
      "Free cancellation up to 48 hours before check-in",
      "Free cancellation up to 24 hours before check-in",
      "Free cancellation up to 7 days before check-in",
      "Non-refundable — no cancellations",
      "50% refund for cancellations 48+ hours before check-in",
    ],
  },
  {
    key: "children",
    icon: "👶",
    title: "Children",
    options: [
      "Children of all ages are welcome",
      "Children aged 12 and above are welcome",
      "Children aged 16 and above are welcome",
      "Children under 5 stay free",
      "We do not accommodate children",
    ],
  },
  {
    key: "cotPolicy",
    icon: "🛏️",
    title: "Cots & extra beds",
    options: [
      "Cots available on request, no charge",
      "Cots available for a small fee",
      "Extra beds available on request",
      "Cots and extra beds are not available",
    ],
  },
  {
    key: "ageRestriction",
    icon: "🪪",
    title: "Age restriction",
    options: [
      "No age restriction",
      "Minimum check-in age is 18",
      "Minimum check-in age is 21",
      "Under-18s must be accompanied by an adult",
      "Valid ID required at check-in",
    ],
  },
  {
    key: "petsPolicy",
    icon: "🐾",
    title: "Pets",
    options: [
      "Pets are not allowed",
      "Pets are welcome — please enquire",
      "Small pets welcome (under 10 kg)",
      "Dogs are welcome",
      "Service animals are always welcome",
    ],
  },
  {
    key: "parties",
    icon: "🎉",
    title: "Parties & events",
    options: [
      "Parties and events are not permitted",
      "Quiet gatherings of up to 10 guests permitted",
      "Events permitted with prior approval",
      "No loud music after 22:00",
    ],
  },
  {
    key: "finePrint",
    icon: "📋",
    title: "Fine print",
    options: [
      "A security deposit is required at check-in",
      "Valid government-issued ID required at check-in",
      "Guests are responsible for any damages caused",
      "Quiet hours are from 22:00 to 08:00",
      "Lost key replacement fee applies",
    ],
  },
];

/* ─── Single policy picker card ──────────────────────────────────── */
function PolicyPicker({ icon, title, fieldKey, options, value, set }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState("");

  const isCustom = value && !options.includes(value);

  const select = (opt) => {
    set(fieldKey, opt);
    setShowCustom(false);
    setCustomText("");
  };

  const confirmCustom = () => {
    if (customText.trim()) {
      set(fieldKey, customText.trim());
      setShowCustom(false);
    }
  };

  return (
    <div
      style={{
        background: C.white,
        border: `1.5px solid ${value ? C.teal : C.border}`,
        borderRadius: 12,
        padding: "14px 16px",
        transition: "border-color 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          fontWeight: 700,
          color: C.midnightBlue,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
        {title}
        {value && (
          <span
            style={{
              marginLeft: "auto",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: C.teal,
              color: C.white,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            ✓
          </span>
        )}
      </div>

      {/* Selected value preview */}
      {value && (
        <div
          style={{
            fontSize: 12,
            color: C.teal,
            fontWeight: 600,
            background: "var(--oceanBlueLight)",
            borderRadius: 8,
            padding: "6px 10px",
            lineHeight: 1.4,
          }}
        >
          {value}
        </div>
      )}

      {/* Option chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => (active ? set(fieldKey, "") : select(opt))}
              style={{
                padding: "5px 11px",
                borderRadius: 20,
                border: `1.5px solid ${active ? C.teal : C.border}`,
                background: active ? "var(--oceanBlueLight)" : "#f7f5f2",
                color: active ? C.teal : C.textMid,
                fontSize: 12,
                fontWeight: active ? 700 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                lineHeight: 1.4,
                textAlign: "left",
              }}
            >
              {opt}
            </button>
          );
        })}

        {/* Custom chip */}
        <button
          type="button"
          onClick={() => {
            setShowCustom((v) => !v);
            if (!showCustom && isCustom) setCustomText(value);
          }}
          style={{
            padding: "5px 11px",
            borderRadius: 20,
            border: `1.5px solid ${isCustom ? C.teal : C.border}`,
            background: isCustom ? "var(--oceanBlueLight)" : "#f7f5f2",
            color: isCustom ? C.teal : C.textLight,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            lineHeight: 1.4,
          }}
        >
          ✏️ Custom…
        </button>
      </div>

      {/* Custom text input */}
      {showCustom && (
        <div style={{ display: "flex", gap: 6 }}>
          <input
            autoFocus
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmCustom()}
            placeholder={`Custom ${title.toLowerCase()} policy…`}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: `1.5px solid ${C.teal}`,
              borderRadius: 8,
              fontSize: 13,
              fontFamily: "inherit",
              boxSizing: "border-box",
              outline: "none",
              color: C.midnightBlue,
            }}
          />
          <button
            type="button"
            onClick={confirmCustom}
            style={{
              padding: "8px 14px",
              background: C.teal,
              color: C.white,
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Payment methods tag input ──────────────────────────────────── */
const PAYMENT_OPTIONS = [
  "Cash", "Visa", "Mastercard", "Verve", "Bank Transfer",
  "PayPal", "Flutterwave", "Paystack", "Crypto", "Cheque",
];

function PaymentMethods({ items = [], onChange }) {
  const [custom, setCustom] = useState("");

  const toggle = (method) => {
    if (items.includes(method)) {
      onChange(items.filter((m) => m !== method));
    } else {
      onChange([...items, method]);
    }
  };

  const addCustom = () => {
    const t = custom.trim();
    if (t && !items.includes(t)) onChange([...items, t]);
    setCustom("");
  };

  return (
    <FormField label="Accepted payment methods" required>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        {PAYMENT_OPTIONS.map((opt) => {
          const active = items.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: `1.5px solid ${active ? C.teal : C.border}`,
                background: active ? "var(--oceanBlueLight)" : C.white,
                color: active ? C.teal : C.textMid,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {active && "✓ "}{opt}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder="Other payment method…"
          style={{
            flex: 1,
            padding: "10px 14px",
            border: `1.5px solid ${C.border}`,
            borderRadius: 8,
            fontSize: 14,
            fontFamily: "inherit",
            boxSizing: "border-box",
            outline: "none",
            color: C.midnightBlue,
          }}
          onFocus={(e) => (e.target.style.borderColor = C.teal)}
          onBlur={(e) => (e.target.style.borderColor = C.border)}
        />
        <PrimaryBtn onClick={addCustom}>+ Add</PrimaryBtn>
      </div>
      {items.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 13, color: C.teal, fontWeight: 600 }}>
          {items.length} method{items.length !== 1 ? "s" : ""} selected
        </div>
      )}
    </FormField>
  );
}

/* ─── Styled time input ──────────────────────────────────────────── */
function TimeField({ label, sublabel, value, onChange, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          border: `1.5px solid ${focused ? C.teal : C.border}`,
          borderRadius: 10,
          background: C.white,
          transition: "border-color 0.2s",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>
        <input
          type="time"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            border: "none",
            outline: "none",
            fontSize: 18,
            fontWeight: 700,
            color: C.midnightBlue,
            fontFamily: "inherit",
            background: "transparent",
            flex: 1,
            cursor: "pointer",
            minWidth: 0,
          }}
        />
      </div>
      {sublabel && (
        <span style={{ fontSize: 11, color: C.textLight }}>{sublabel}</span>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export function StepGuestRules({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading
        title="Guest rules & policies"
        subtitle="Tap to set each policy. Guests see these before booking."
      />

      {/* Guest preferences */}
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 14, color: C.midnightBlue, fontSize: 15 }}>
          Guest preferences
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: C.midnightBlue, fontSize: 14 }}>
            Exclude infants (0–2 yrs) from total guest count?
          </div>
          <RadioGroup
            options={["Yes", "No"]}
            value={data.excludeInfants ? "Yes" : "No"}
            onChange={(v) => set("excludeInfants", v === "Yes")}
          />
        </div>
        <div style={{ borderTop: "1px solid #f0ece6", paddingTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: C.midnightBlue, fontSize: 14 }}>
            Do you offer last-minute bookings?
          </div>
          <RadioGroup
            options={["Yes", "No"]}
            value={data.lastMinuteBookings ? "Yes" : "No"}
            onChange={(v) => set("lastMinuteBookings", v === "Yes")}
          />
        </div>
      </Card>

      {/* Policy picker grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {POLICIES.map((p) => (
          <PolicyPicker
            key={p.key}
            icon={p.icon}
            title={p.title}
            fieldKey={p.key}
            options={p.options}
            value={data[p.key] || ""}
            set={set}
          />
        ))}
      </div>

      {/* Payment methods + smoking */}
      <Card>
        <PaymentMethods
          items={data.paymentMethods || []}
          onChange={(arr) => set("paymentMethods", arr)}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0 2px",
            borderTop: "1px solid #f0ece6",
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: C.midnightBlue }}>
            🚬 Smoking allowed
          </span>
          <Toggle
            checked={data.smokingAllowed}
            onChange={(v) => set("smokingAllowed", v)}
          />
        </div>
      </Card>

      {/* Check-in / Check-out */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Check-in card */}
        <div
          style={{
            background: "var(--oceanBlueLight)",
            border: `1.5px solid var(--oceanBlueBorder)`,
            borderRadius: 14,
            padding: "18px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: C.teal, color: C.white,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}
            >
              🛬
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.midnightBlue }}>Check-in</div>
              <div style={{ fontSize: 11, color: C.textLight }}>When guests may arrive</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <TimeField
              label="From"
              sublabel="Earliest arrival"
              value={data.checkInFrom}
              onChange={(v) => set("checkInFrom", v)}
              icon="🔓"
            />
            <TimeField
              label="Until"
              sublabel="Latest arrival accepted"
              value={data.checkInUntil}
              onChange={(v) => set("checkInUntil", v)}
              icon="🌙"
            />
          </div>
        </div>

        {/* Check-out card */}
        <div
          style={{
            background: "#fdf8f2",
            border: `1.5px solid #e8d8c0`,
            borderRadius: 14,
            padding: "18px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#b3aca9", color: C.white,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}
            >
              🛫
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.midnightBlue }}>Check-out</div>
              <div style={{ fontSize: 11, color: C.textLight }}>When guests must depart</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <TimeField
              label="From"
              sublabel="Earliest guests may leave"
              value={data.checkOutFrom}
              onChange={(v) => set("checkOutFrom", v)}
              icon="🌅"
            />
            <TimeField
              label="Until"
              sublabel="Checkout deadline"
              value={data.checkOutUntil}
              onChange={(v) => set("checkOutUntil", v)}
              icon="🔒"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
