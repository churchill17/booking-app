import React from "react";
import { C } from "../ui.constants.js";
import { Card, StepHeading, FormField, RadioGroup, InfoBox } from "../ui.jsx";

const CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira (₦)" },
  { code: "USD", name: "US Dollar ($)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GHS", name: "Ghanaian Cedi (₵)" },
  { code: "KES", name: "Kenyan Shilling (KSh)" },
  { code: "ZAR", name: "South African Rand (R)" },
  { code: "AED", name: "UAE Dirham (AED)" },
  { code: "CAD", name: "Canadian Dollar (CA$)" },
  { code: "AUD", name: "Australian Dollar (A$)" },
  { code: "INR", name: "Indian Rupee (₹)" },
  { code: "SGD", name: "Singapore Dollar (S$)" },
  { code: "MYR", name: "Malaysian Ringgit (RM)" },
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
