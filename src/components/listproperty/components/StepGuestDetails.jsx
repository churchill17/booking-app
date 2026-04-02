import { C } from "../ui.constants.js";
import { Card, StepHeading, Counter, Checkbox, RadioGroup } from "../ui.jsx";
import "./StepGuestDetails.css";

export function StepGuestDetails({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading title="Guest & room details" />
      <Card>
        {/* Guest count and exclude infants section removed as requested */}
        <div
          style={{
            borderTop: "1px solid #f0ece6",
            paddingTop: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{ fontWeight: 600, marginBottom: 10, color: C.midnightBlue }}
          >
            How many bathrooms are there?
          </div>
          <Counter
            value={data.bathrooms}
            onChange={(v) => set("bathrooms", v)}
            min={1}
          />
        </div>
        <div
          style={{
            borderTop: "1px solid #f0ece6",
            paddingTop: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{ fontWeight: 600, marginBottom: 10, color: C.midnightBlue }}
          >
            Do you allow children?
          </div>
          <RadioGroup
            options={["Yes", "No"]}
            value={data.allowChildren ? "Yes" : "No"}
            onChange={(v) => set("allowChildren", v === "Yes")}
          />
        </div>
        <div style={{ borderTop: "1px solid #f0ece6", paddingTop: 16 }}>
          <div
            style={{ fontWeight: 600, marginBottom: 4, color: C.midnightBlue }}
          >
            Do you offer cots?
          </div>
          <p style={{ color: C.warmGray, fontSize: 13, marginBottom: 10 }}>
            Cots sleep most infants 0–3 and can be made available on request.
          </p>
          <RadioGroup
            options={["Yes", "No"]}
            value={data.offerCots ? "Yes" : "No"}
            onChange={(v) => set("offerCots", v === "Yes")}
          />
        </div>
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
