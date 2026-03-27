import {
  Card,
  StepHeading,
  FormField,
  TextInput,
  InfoBox,
  SelectInput,
} from "../ui.jsx";
import "./StepProperty.css";

export function StepProperty({ data, set }) {
  const propertyTypeOptions = [
    "Hotel",
    "Resort",
    "Apartment",
    "Guest House",
    "Villas",
    "Home",
    "Boat",
    "Campsite",
    "Luxury Tent",
    "Holiday Home",
    "Villa",
  ];
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
          <SelectInput
            value={data.propertyType}
            onChange={(v) => set("propertyType", v)}
            options={propertyTypeOptions.map((type) => ({
              label: type,
              value: type,
            }))}
            placeholder="Select property type"
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
