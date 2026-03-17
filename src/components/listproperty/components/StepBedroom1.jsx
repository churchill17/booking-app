import { C } from "../ui.constants.js";
import { Card, StepHeading, BedRow } from "../ui.jsx";
import "./StepBedroom1.css";

export function StepBedroom1({ data, set }) {
  const b = data.bedroom1;
  const upd = (k, v) => set("bedroom1", { ...b, [k]: v });
  return (
    <div className="animate-in">
      <StepHeading
        title="Bedroom 1"
        subtitle="Which beds are available in this room?"
      />
      <Card>
        <BedRow
          label="Single bed"
          sub="90–130 cm wide"
          value={b.single}
          onChange={(v) => upd("single", v)}
        />
        <BedRow
          label="Double bed"
          sub="131–150 cm wide"
          value={b.double}
          onChange={(v) => upd("double", v)}
        />
        <BedRow
          label="Large bed (King size)"
          sub="151–180 cm wide"
          value={b.king}
          onChange={(v) => upd("king", v)}
        />
        <BedRow
          label="Extra-large double bed (Super-king size)"
          sub="181–210 cm wide"
          value={b.superKing}
          onChange={(v) => upd("superKing", v)}
        />
        <button
          style={{
            marginTop: 14,
            color: C.teal,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "inherit",
            padding: 0,
          }}
        >
          › More bed options
        </button>
      </Card>
    </div>
  );
}
