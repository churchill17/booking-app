import { C } from "../ui.constants.js";
import {
  Card,
  StepHeading,
  FormField,
  SelectInput,
  RadioGroup,
  Toggle,
  TextInput,
  PrimaryBtn,
} from "../ui.jsx";

import React, { useState } from "react";
function ArrayInput({ label, items = [], onChange, placeholder }) {
  const [input, setInput] = useState("");
  const splitInput = (text) =>
    text
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  return (
    <FormField label={label}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            placeholder || "Enter values (comma or newline separated)"
          }
          rows={1}
          style={{
            width: "100%",
            minHeight: 36,
            maxHeight: 36,
            resize: "none",
            padding: "8px 12px",
            fontSize: 16,
            border: "1px solid #ccc",
            borderRadius: 4,
            background: "#fff",
            marginBottom: 8,
            fontFamily: "inherit",
            boxSizing: "border-box",
            outline: "none",
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}
        />
        <PrimaryBtn
          style={{
            width: "100%",
            marginTop: 4,
            boxSizing: "border-box",
            padding: "10px 0",
            fontSize: 16,
          }}
          onClick={() => {
            if (input.trim()) {
              const newItems = splitInput(input);
              onChange([...items, ...newItems]);
              setInput("");
            }
          }}
        >
          Add
        </PrimaryBtn>
      </div>
      <ul style={{ paddingLeft: 18 }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 4 }}>
            {item}
            <button
              style={{
                marginLeft: 8,
                color: "red",
                border: "none",
                background: "none",
              }}
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </FormField>
  );
}
import "./StepHouseRules.css";

const timeSlots = (s, e) => {
  const a = [];
  for (let h = s; h <= e; h++) a.push(`${String(h).padStart(2, "0")}:00`);
  return a;
};

export function StepHouseRules({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading
        title="House rules"
        subtitle="Set expectations for your guests."
      />
      <Card>
        <FormField label="Cancellation Policy">
          <TextInput
            value={data.cancellation || ""}
            onChange={(v) => set("cancellation", v)}
            placeholder="e.g. Cancellation and prepayment policies vary according to accommodation type. Please check what conditions may apply to each option when making your selection."
          />
        </FormField>
        <FormField label="Children Policy">
          <TextInput
            value={data.children || ""}
            onChange={(v) => set("children", v)}
            placeholder="e.g. Children of any age are welcome."
          />
        </FormField>
        <FormField label="Cot Policy">
          <TextInput
            value={data.cotPolicy || ""}
            onChange={(v) => set("cotPolicy", v)}
            placeholder="e.g. Cots and extra beds are not available at this property."
          />
        </FormField>
        <FormField label="Age Restriction">
          <TextInput
            value={data.ageRestriction || ""}
            onChange={(v) => set("ageRestriction", v)}
            placeholder="e.g. The minimum age for check-in is 18"
          />
        </FormField>
        <FormField label="Pets Policy">
          <TextInput
            value={data.petsPolicy || ""}
            onChange={(v) => set("petsPolicy", v)}
            placeholder="e.g. Pets are not allowed."
          />
        </FormField>
        <ArrayInput
          label="Payment Methods"
          items={data.paymentMethods || []}
          onChange={(arr) => set("paymentMethods", arr)}
          placeholder="e.g. Visa, Mastercard, ATM card, Cash"
        />
        <FormField label="Parties Policy">
          <TextInput
            value={data.parties || ""}
            onChange={(v) => set("parties", v)}
            placeholder="e.g. Parties/events are not allowed"
          />
        </FormField>
        <FormField label="Fine Print">
          <TextInput
            value={data.finePrint || ""}
            onChange={(v) => set("finePrint", v)}
            placeholder="e.g. This property will not accommodate hen, stag or similar parties."
          />
        </FormField>
        {[["Smoking allowed", "smokingAllowed"]].map(([label, key]) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #f0ece6",
            }}
          >
            <span style={{ fontSize: 15, color: C.midnightBlue }}>{label}</span>
            <Toggle checked={data[key]} onChange={(v) => set(key, v)} />
          </div>
        ))}
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
          Check-in / Check-out
        </div>
        <div className="lp-step-house-rules__time-grid lp-step-house-rules__time-grid--top">
          {[
            ["Check-in from", "checkInFrom", 12, 22],
            ["Check-in until", "checkInUntil", 12, 23],
          ].map(([label, key, s, e]) => (
            <FormField key={key} label={label}>
              <SelectInput
                value={data[key]}
                onChange={(v) => set(key, v)}
                options={timeSlots(s, e)}
              />
            </FormField>
          ))}
        </div>
        <div className="lp-step-house-rules__time-grid">
          {[
            ["Check-out from", "checkOutFrom", 6, 12],
            ["Check-out until", "checkOutUntil", 8, 14],
          ].map(([label, key, s, e]) => (
            <FormField key={key} label={label}>
              <SelectInput
                value={data[key]}
                onChange={(v) => set(key, v)}
                options={timeSlots(s, e)}
              />
            </FormField>
          ))}
        </div>
      </Card>
    </div>
  );
}
