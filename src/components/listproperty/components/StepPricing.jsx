import {
  Card,
  StepHeading,
  FormField,
  TextInput,
  SelectInput,
  InfoBox,
  Toggle,
} from "../ui.jsx";

const CURRENCIES = ["NGN", "GHS", "XOF", "USD", "EUR", "GBP"];

export function StepPricing({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading title="Set your pricing" />
      <Card>
        {/* Removed Original price per night and Currency */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
            marginTop: 8,
          }}
        >
          {/* Removed Current price and Taxes included in price */}
          <FormField label="Currency" required>
            <SelectInput
              value={data.currency}
              onChange={(value) => set("currency", value)}
              options={CURRENCIES}
              placeholder="Select currency"
            />
          </FormField>
          <FormField label="Weekend price (optional)">
            <TextInput
              type="number"
              value={data.weekendRate}
              onChange={(value) => set("weekendRate", value)}
              placeholder="e.g. 145"
            />
          </FormField>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            gap: 16,
            marginTop: 8,
          }}
        >
          <FormField label="Cleaning fee (optional)">
            <TextInput
              type="number"
              value={data.cleaningFee}
              onChange={(value) => set("cleaningFee", value)}
              placeholder="e.g. 25"
            />
          </FormField>
        </div>

        {/* Removed duplicate Taxes included in price section */}
      </Card>
      <InfoBox>
        Guests will see this as your base current price before taxes and any
        extra charges are applied.
      </InfoBox>
    </div>
  );
}
