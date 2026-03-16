import { Card, StepHeading, Counter } from "../ui.jsx";
import "./StepLivingRoom.css";

export function StepLivingRoom({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading
        title="Living room"
        subtitle="Does your property have a living room with sleeping options?"
      />
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 24 }}>🛋</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Sofa bed</span>
          </div>
          <Counter
            value={data.livingRoom.sofaBed}
            onChange={(v) =>
              set("livingRoom", { ...data.livingRoom, sofaBed: v })
            }
          />
        </div>
      </Card>
    </div>
  );
}
