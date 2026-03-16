import { Card, StepHeading, BedRow } from "../ui.jsx";
import "./StepOtherSpaces.css";

export function StepOtherSpaces({ data, set }) {
  const o = data.otherSpaces;
  const upd = (k, v) => set("otherSpaces", { ...o, [k]: v });
  return (
    <div className="animate-in">
      <StepHeading
        title="Other spaces"
        subtitle="Any beds in other areas of the property?"
      />
      <Card>
        <BedRow
          label="Single bed"
          sub="90–130 cm wide"
          value={o.single}
          onChange={(v) => upd("single", v)}
        />
        <BedRow
          label="Double bed"
          sub="131–150 cm wide"
          value={o.double}
          onChange={(v) => upd("double", v)}
        />
        <BedRow
          label="Large bed (King size)"
          sub="151–180 cm wide"
          value={o.king}
          onChange={(v) => upd("king", v)}
        />
        <BedRow
          label="Extra-large double bed (Super-king size)"
          sub="181–210 cm wide"
          value={o.superKing}
          onChange={(v) => upd("superKing", v)}
        />
      </Card>
    </div>
  );
}
