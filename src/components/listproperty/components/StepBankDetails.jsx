import { Card, StepHeading, FormField, TextInput, InfoBox } from "../ui.jsx";
 const NIGERIAN_BANKS = [
    { name: "Access Bank", code: "044" },
    { name: "Citibank Nigeria", code: "023" },
    { name: "Ecobank Nigeria", code: "050" },
    { name: "Fidelity Bank", code: "070" },
    { name: "First Bank of Nigeria", code: "011" },
    { name: "First City Monument Bank (FCMB)", code: "214" },
    { name: "Guaranty Trust Bank (GTBank)", code: "058" },
    { name: "Heritage Bank", code: "030" },
    { name: "Keystone Bank", code: "082" },
    { name: "Kuda Bank", code: "090267" },
    { name: "OPay", code: "100004" },
    { name: "Palmpay", code: "100033" },
    { name: "Polaris Bank", code: "076" },
    { name: "Stanbic IBTC Bank", code: "221" },
    { name: "Standard Chartered Bank", code: "068" },
    { name: "Sterling Bank", code: "232" },
    { name: "Union Bank of Nigeria", code: "032" },
    { name: "United Bank for Africa (UBA)", code: "033" },
    { name: "Unity Bank", code: "215" },
    { name: "Wema Bank", code: "035" },
    { name: "Zenith Bank", code: "057" },
  ];

export function StepBankDetails({ data, set }) {
  return (
    <div className="animate-in">
      <StepHeading
        title="Where should we send your earnings?"
        subtitle="Your payout will be sent here after each completed booking. Only you can see these details."
      />
      <Card>
        <FormField label="Bank name" required>
          <select
            value={data.bankName || ""}
            onChange={(e) => {
              const selected = NIGERIAN_BANKS.find(b => b.name === e.target.value);
              set("bankName", e.target.value);
              set("bankCode", selected?.code || "");
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: `1.5px solid var(--border, #dde3ec)`,
              borderRadius: 8,
              fontSize: 15,
              fontFamily: "inherit",
              background: "#fff",
              color: data.bankName ? "#1a1a2e" : "#9ca3af",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="">Select your bank</option>
            {NIGERIAN_BANKS.map(bank => (
              <option key={bank.code} value={bank.name}>{bank.name}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Account number" required>
          <TextInput
            value={data.accountNumber || ""}
            onChange={(v) => {
              // Only allow digits, max 10
              const digits = v.replace(/\D/g, "").slice(0, 10);
              set("accountNumber", digits);
            }}
            placeholder="10-digit NUBAN account number"
            inputMode="numeric"
          />
        </FormField>

        <FormField label="Account name" required>
          <TextInput
            value={data.accountName || ""}
            onChange={(v) => set("accountName", v)}
            placeholder="As it appears on your bank account"
          />
        </FormField>
      </Card>

      <InfoBox>
        <strong>🔒 Your bank details are secure.</strong>
        <ul style={{ marginTop: 6, paddingLeft: 18, lineHeight: 2 }}>
          <li>Details are encrypted and stored securely</li>
          <li>Only used for payout transfers after bookings</li>
          <li>Guests never see this information</li>
          <li>You can update these at any time from your dashboard</li>
        </ul>
      </InfoBox>
    </div>
  );
}