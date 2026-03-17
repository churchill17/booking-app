import {
  Card,
  StepHeading,
  FormField,
  TextInput,
  SelectInput,
  InfoBox,
} from "../ui.jsx";
import "./StepLocation.css";

const COUNTRIES = [
  "Benin",
  "Burkina Faso",
  "Cape Verde",
  "Cote d'Ivoire",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Liberia",
  "Mali",
  "Mauritania",
  "Niger",
  "Nigeria",
  "Senegal",
  "Sierra Leone",
  "Togo",
];

export function StepLocation({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading
        title="Where is your property?"
        subtitle="Your exact address is only shared with confirmed guests."
      />
      <Card>
        <FormField label="Find your address">
          <TextInput
            value={data.address}
            onChange={(v) => set("address", v)}
            placeholder="Start typing your address"
          />
        </FormField>
        <FormField label="Apartment or floor number (optional)">
          <TextInput
            value={data.apartment}
            onChange={(v) => set("apartment", v)}
            placeholder="Apartment, building, floor, etc."
          />
        </FormField>
        <FormField label="Country" required>
          <SelectInput
            value={data.country}
            onChange={(v) => set("country", v)}
            options={COUNTRIES}
            placeholder="Select country"
          />
        </FormField>
        <div className="lp-step-location__grid">
          <FormField label="City" required>
            <TextInput
              value={data.city}
              onChange={(v) => set("city", v)}
              placeholder="Port Harcourt"
            />
          </FormField>
          <FormField label="Post code / Zip code">
            <TextInput
              value={data.zipCode}
              onChange={(v) => set("zipCode", v)}
              placeholder="500102"
            />
          </FormField>
        </div>
      </Card>
      {data.city && data.country && (
        <InfoBox>
          📍 Property pinned to{" "}
          <strong>
            {data.city}, {data.country}
            {data.zipCode ? `, ${data.zipCode}` : ""}
          </strong>
        </InfoBox>
      )}
    </div>
  );
}
