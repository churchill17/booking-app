import React, { useState } from "react";
import { C } from "../ui.constants.js";
import { Card, StepHeading, FormField, RadioGroup, InfoBox } from "../ui.jsx";

const inputStyle = (focused) => ({
  width: "100%",
  padding: "11px 14px",
  border: `1.5px solid ${focused ? C.teal : C.border}`,
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "inherit",
  boxSizing: "border-box",
  outline: "none",
  color: C.midnightBlue,
  background: C.white,
  transition: "border-color 0.2s",
});

function PriceInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={inputStyle(focused)}
    />
  );
}

const CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira (₦)" },
  { code: "USD", name: "US Dollar ($)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GHS", name: "Ghanaian Cedi (₵)" },
  { code: "KES", name: "Kenyan Shilling (KSh)" },
  { code: "ZAR", name: "South African Rand (R)" },
  { code: "AED", name: "UAE Dirham (د.إ)" },
  { code: "CAD", name: "Canadian Dollar (CA$)" },
  { code: "AUD", name: "Australian Dollar (A$)" },
  { code: "INR", name: "Indian Rupee (₹)" },
  { code: "SGD", name: "Singapore Dollar (S$)" },
  { code: "MYR", name: "Malaysian Ringgit (RM)" },
  { code: "CHF", name: "Swiss Franc (Fr)" },
];


export function StepPricing({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading
        title="Set your pricing"
        subtitle="Configure your currency and any discounted rate for your listing."
      />

      <Card>
        <FormField label="Currency" required>
          <select
            value={data.currency || "NGN"}
            onChange={(e) => set("currency", e.target.value)}
            style={{
              width: "100%",
              padding: "11px 36px 11px 14px",
              border: `1.5px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 15,
              fontFamily: "inherit",
              color: C.midnightBlue,
              background: C.white,
              appearance: "none",
              WebkitAppearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b3aca9' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
              boxSizing: "border-box",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = C.teal)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
          >
            {CURRENCIES.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </FormField>
      </Card>

      <Card>
        <div
          style={{
            fontWeight: 700,
            marginBottom: 8,
            color: C.midnightBlue,
            fontSize: 16,
          }}
        >
          Taxes included in price
        </div>
        <div style={{ color: C.textMid, marginBottom: 12, fontSize: 14 }}>
          Are taxes already included in your listed room prices?
        </div>
        <RadioGroup
          options={["Yes, taxes included", "No, taxes added at checkout"]}
          value={
            data.taxesIncluded
              ? "Yes, taxes included"
              : "No, taxes added at checkout"
          }
          onChange={(v) => set("taxesIncluded", v === "Yes, taxes included")}
        />
      </Card>

      <Card>
        <div
          style={{
            fontWeight: 700,
            marginBottom: 16,
            color: C.midnightBlue,
            fontSize: 16,
          }}
        >
          Listing Price
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FormField label="Original Price" required>
            <PriceInput
              value={data.originalPrice || ""}
              placeholder="e.g. 50000"
              onChange={(v) => {
                set("originalPrice", v);
                const disc = parseFloat(data.discount);
                if (v && !isNaN(disc)) {
                  set(
                    "currentPrice",
                    (parseFloat(v) * (1 - disc / 100)).toFixed(2)
                  );
                }
              }}
            />
          </FormField>

          <FormField label="Discount (%)">
            <PriceInput
              value={data.discount || ""}
              placeholder="e.g. 10"
              onChange={(v) => {
                set("discount", v);
                const orig = parseFloat(data.originalPrice);
                if (!isNaN(orig) && v) {
                  set(
                    "currentPrice",
                    (orig * (1 - parseFloat(v) / 100)).toFixed(2)
                  );
                }
              }}
            />
          </FormField>

          <FormField label="Current Price">
            <PriceInput
              value={data.currentPrice || ""}
              placeholder="Auto-calculated or enter manually"
              onChange={(v) => set("currentPrice", v)}
            />
          </FormField>
        </div>
      </Card>

      <InfoBox>
        💡 Per-room base prices are set in the Rooms step. Use the discounted price here if you want to show a reduced rate on your overall listing.
      </InfoBox>
    </div>
  );
}
