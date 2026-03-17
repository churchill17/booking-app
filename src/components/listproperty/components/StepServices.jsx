import { C } from "../ui.constants.js";
import { Card, StepHeading, RadioGroup } from "../ui.jsx";
import "./StepServices.css";

export function StepServices({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading title="Services at your property" />
      <Card>
        <div
          style={{
            fontWeight: 700,
            marginBottom: 14,
            color: C.midnightBlue,
            fontSize: 16,
          }}
        >
          Breakfast
        </div>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>
          Do you serve guests breakfast?
        </div>
        <RadioGroup
          options={["Yes", "No"]}
          value={data.breakfast ? "Yes" : "No"}
          onChange={(v) => set("breakfast", v === "Yes")}
        />
      </Card>
      <Card>
        <div
          style={{
            fontWeight: 700,
            marginBottom: 14,
            color: C.midnightBlue,
            fontSize: 16,
          }}
        >
          Parking
        </div>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>
          Is parking available to guests?
        </div>
        <RadioGroup
          options={["Yes, free", "Yes, paid", "No"]}
          value={data.parking}
          onChange={(v) => set("parking", v)}
        />
      </Card>
    </div>
  );
}
