import {
  Card,
  StepHeading,
  FormField,
  TextInput,
  SelectInput,
  InfoBox,
  Toggle,
} from "../ui.jsx";

const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "GHS", "XOF"];

export function StepPricing({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading
        title="Set your pricing"
        subtitle="Tell guests what one night at your property costs."
      />
      <Card>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 0.8fr)",
            gap: 16,
          }}
        >
          <FormField label="Original price per night" required>
            <TextInput
              type="number"
              value={data.originalPrice}
              onChange={(value) => set("originalPrice", value)}
              placeholder="e.g. 120"
              autoFocus
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
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
            marginTop: 8,
          }}
        >
          <FormField label="Current price (optional)">
            <TextInput
              type="number"
              value={data.currentPrice}
              onChange={(value) => set("currentPrice", value)}
              placeholder="e.g. 100"
            />
          </FormField>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#182435" }}>
                Taxes included in price
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: "#7a736f" }}>
                Turn this on if your nightly rate already includes taxes and
                fees.
              </div>
            </div>
            <Toggle
              checked={Boolean(data.taxesIncluded)}
              onChange={(value) => set("taxesIncluded", value)}
            />
          </div>
          <FormField label="Discount (optional)">
            <TextInput
              type="text"
              value={data.discount}
              onChange={(value) => set("discount", value)}
              placeholder="e.g. 10%"
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

        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingTop: 14,
            borderTop: "1px solid #f0ece6",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#182435" }}>
              Taxes included in price
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: "#7a736f" }}>
              Turn this on if your nightly rate already includes taxes and fees.
            </div>
          </div>
          <Toggle
            checked={Boolean(data.taxesIncluded)}
            onChange={(value) => set("taxesIncluded", value)}
          />
        </div>
      </Card>
      <InfoBox>
        Guests will see this as your base current price before taxes and any
        extra charges are applied.
      </InfoBox>
    </div>
  );
}
