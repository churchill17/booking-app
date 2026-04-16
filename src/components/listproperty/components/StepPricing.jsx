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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
            marginTop: 8,
          }}
        >
          <FormField label="Base price per night" required>
            <TextInput
              type="number"
              value={data.originalPrice}
              onChange={(value) => set("originalPrice", value)}
              placeholder="e.g. 120"
            />
          </FormField>
          <FormField label="Currency" required>
            <SelectInput
              value={data.currency}
              onChange={(value) => set("currency", value)}
              options={CURRENCIES}
              placeholder="Select currency"
            />
          </FormField>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
            marginTop: 8,
          }}
        >
          <FormField label="Current price (if discounted)">
            <TextInput
              type="number"
              value={data.currentPrice}
              onChange={(value) => set("currentPrice", value)}
              placeholder="e.g. 99"
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
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
          <FormField label="Discount label (optional)">
            <TextInput
              value={data.discount}
              onChange={(value) => set("discount", value)}
              placeholder="e.g. 20% off"
            />
          </FormField>
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15 }}>Taxes included in price</span>
          <Toggle
            checked={data.taxesIncluded}
            onChange={(value) => set("taxesIncluded", value)}
          />
        </div>
      </Card>
      <InfoBox>
        Guests will see this as your base price per night before any extra
        charges are applied. Set a current price if you want to show a
        discounted rate.
      </InfoBox>
    </div>
  );
}