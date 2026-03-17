import { C } from "../ui.constants.js";
import { Card, StepHeading, RadioGroup } from "../ui.jsx";
import "./StepChannelManager.css";

export function StepChannelManager({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading title="Do you use a tool to manage your listings?" />
      <Card>
        <h3 style={{ fontWeight: 700, marginBottom: 8, color: C.midnightBlue }}>
          What is a channel manager?
        </h3>
        <p
          style={{
            color: C.warmGray,
            fontSize: 14,
            lineHeight: 1.65,
            marginBottom: 20,
          }}
        >
          A channel manager is a tool (like SiteMinder or Guesty) that
          automatically updates your rates, availability, and bookings across
          all the travel sites you list on. This prevents double bookings and
          saves you time.
        </p>
        <div style={{ borderTop: "1px solid #f0ece6", paddingTop: 16 }}>
          <RadioGroup
            options={[
              "Yes, I use a tool to manage my listings",
              "No, I will manage my listing directly on Staylist",
            ]}
            value={
              data.usesChannelManager
                ? "Yes, I use a tool to manage my listings"
                : "No, I will manage my listing directly on Staylist"
            }
            onChange={(v) => set("usesChannelManager", v.startsWith("Yes"))}
          />
        </div>
      </Card>
    </div>
  );
}
