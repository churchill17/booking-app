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
  { code: "₦", name: "Nigerian Naira (₦)" },
  { code: "$", name: "US Dollar ($)" },
  { code: "£", name: "British Pound (£)" },
  { code: "€", name: "Euro (€)" },
  { code: "₵", name: "Ghanaian Cedi (₵)" },
  { code: "KSh", name: "Kenyan Shilling (KSh)" },
  { code: "R", name: "South African Rand (R)" },
  { code: "AED", name: "UAE Dirham (AED)" },
  { code: "CA$", name: "Canadian Dollar (CA$)" },
  { code: "A$", name: "Australian Dollar (A$)" },
  { code: "₹", name: "Indian Rupee (₹)" },
  { code: "S$", name: "Singapore Dollar (S$)" },
  { code: "RM", name: "Malaysian Ringgit (RM)" },
  { code: "CHF", name: "Swiss Franc (CHF)" },
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

      <InfoBox>
        💡 Per-room base prices are set in the Rooms step. Use the discounted price here if you want to show a reduced rate on your overall listing.
      </InfoBox>
    </div>
  );
}
