import { Card, StepHeading, FormField, TextInput, InfoBox } from "../ui.jsx";
import "./StepPropertyName.css";

export function StepPropertyName({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading title="What's the name of your place?" />
      <Card>
        <FormField label="Property name" required>
          <TextInput
            value={data.propertyName}
            onChange={(v) => set("propertyName", v)}
            placeholder="e.g. Oceanview Suite"
            autoFocus
          />
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
