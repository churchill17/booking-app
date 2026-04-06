import { C } from "../ui.constants.js";
import { Card, StepHeading, Counter, Checkbox, RadioGroup } from "../ui.jsx";
import "./StepGuestDetails.css";

export function StepGuestDetails({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading title="Guest & room details" />
      <Card>
        {/* Guest count and exclude infants section removed as requested */}
        {/* Removed 'Do you allow children?' and 'Do you offer cots?' sections */}
        <div style={{ borderTop: "1px solid #f0ece6", paddingTop: 16 }}>
          <div
            style={{ fontWeight: 600, marginBottom: 4, color: C.midnightBlue }}
          >
            Do you offer last-minute bookings for your property?
          </div>
          <RadioGroup
            options={["Yes", "No"]}
            value={data.lastMinuteBookings ? "Yes" : "No"}
            onChange={(v) => set("lastMinuteBookings", v === "Yes")}
          />
        </div>
      </Card>
    </div>
  );
}
