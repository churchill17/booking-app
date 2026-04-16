import {
  Card,
  StepHeading,
  FormField,
  TextInput,
  InfoBox,
} from "../ui.jsx";
import { C } from "../ui.constants.js";
import "./StepProperty.css";

const PROPERTY_TYPES = [
  { value: "Hotel",        emoji: "🏨" },
  { value: "Resort",       emoji: "🌴" },
  { value: "Apartment",    emoji: "🏢" },
  { value: "Guest House",  emoji: "🏡" },
  { value: "Villas",       emoji: "🏰" },
  { value: "Home",         emoji: "🏠" },
  { value: "Boat",         emoji: "⛵" },
  { value: "Campsite",     emoji: "⛺" },
  { value: "Luxury Tent",  emoji: "🏕️" },
  { value: "Holiday Home", emoji: "🌅" },
  { value: "Villa",        emoji: "🏖️" },
];

export function StepProperty({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading title="What's the name and type of your property?" />
      <Card>
        <FormField label="Property name" required>
          <TextInput
            value={data.propertyName}
            onChange={(v) => set("propertyName", v)}
            placeholder="e.g. Oceanview Suite"
            autoFocus
          />
        </FormField>

        <FormField label="Property type" required>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: 10,
              marginTop: 4,
            }}
          >
            {PROPERTY_TYPES.map(({ value, emoji }) => {
              const isSelected = data.propertyType === value;
              return (
                <button
                  key={value}
                  onClick={() => set("propertyType", value)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "14px 8px",
                    border: `2px solid ${isSelected ? C.teal : C.border}`,
                    borderRadius: 10,
                    background: isSelected ? "#e8f5f3" : C.white,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                    outline: "none",
                    boxShadow: isSelected
                      ? "0 0 0 3px rgba(25,144,126,0.12)"
                      : "none",
                  }}
                >
                  <span style={{ fontSize: 26, lineHeight: 1 }}>{emoji}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? C.teal : C.midnightBlue,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </FormField>
      </Card>

      <InfoBox>
        <strong>💡 Tips for a great name:</strong>
        <ul style={{ marginTop: 6, paddingLeft: 18, lineHeight: 2 }}>
          <li>Keep it short and catchy</li>
          <li>Avoid abbreviations</li>
          <li>Stick to the facts</li>
        </ul>
      </InfoBox>
    </div>
  );
}
