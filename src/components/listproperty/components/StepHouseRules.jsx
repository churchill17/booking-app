import { C } from "../ui.constants.js";
import {
  Card,
  StepHeading,
  FormField,
  SelectInput,
  RadioGroup,
  Toggle,
} from "../ui.jsx";
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
        {[
          ["Smoking allowed", "smokingAllowed"],
          ["Parties / events allowed", "partiesAllowed"],
        ].map(([label, key]) => (
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
        <div style={{ paddingTop: 14 }}>
          <div
            style={{ fontWeight: 600, marginBottom: 10, color: C.midnightBlue }}
          >
            Do you allow pets?
          </div>
          <RadioGroup
            options={["Yes", "Upon request", "No"]}
            value={data.pets}
            onChange={(v) => set("pets", v)}
          />
        </div>
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
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
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
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
