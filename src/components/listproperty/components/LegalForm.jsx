import { useState } from "react";
import { C } from "../ui.constants.js";
import {
  Card,
  StepHeading,
  FormField,
  TextInput,
  SelectInput,
  Checkbox,
  PrimaryBtn,
} from "../ui.jsx";
import "./LegalForm.css";

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

const FAQ_ITEMS = [
  {
    icon: "📅",
    q: "Can I decide when I get bookings?",
    a: "Yes. The best way to do this is to keep your calendar up-to-date. Close any dates you don't want a booking on. If you have bookings on other sites, close these dates as well.",
  },
  {
    icon: "✅",
    q: "Are bookings confirmed straight away?",
    a: "Yes. They're confirmed as soon as a guest makes a booking.",
  },
  {
    icon: "👥",
    q: "Can I choose who stays at my place?",
    a: "No. If a date is open in your calendar, all guests using our site can book it.",
  },
];

export default function LegalForm({ onBack, onSubmit }) {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipCode: "",
  });
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!form.country) e.country = "Required";
    if (!form.addressLine1.trim()) e.addressLine1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!agree1) e.agree1 = "You must certify this information";
    if (!agree2) e.agree2 = "You must accept the terms";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        agreements: {
          informationCertified: agree1,
          termsAccepted: agree2,
        },
      });
    } catch (error) {
      setSubmitError(
        error?.message || "Could not submit your listing. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lp-legal">
      <div className="lp-legal__inner">
        <form onSubmit={handleSubmit} noValidate>
          <StepHeading
            title="Legal information"
            subtitle="This information is required to create your contract with us."
          />

          <Card>
            <h2 className="lp-legal__section-title">
              Personal information of the contracting party
            </h2>
            <FormField
              label="First name as stated on ID"
              required
              error={errors.firstName}
            >
              <TextInput
                value={form.firstName}
                onChange={(v) => set("firstName", v)}
              />
            </FormField>
            <FormField label="Middle name(s) as stated on ID">
              <TextInput
                value={form.middleName}
                onChange={(v) => set("middleName", v)}
              />
            </FormField>
            <FormField
              label="Last name as stated on ID"
              required
              error={errors.lastName}
            >
              <TextInput
                value={form.lastName}
                onChange={(v) => set("lastName", v)}
              />
            </FormField>
            <FormField label="Email" required error={errors.email}>
              <TextInput
                value={form.email}
                onChange={(v) => set("email", v)}
                type="email"
              />
            </FormField>
            <FormField label="Phone number" required>
              <div className="lp-legal__phone-wrapper">
                <div className="lp-legal__phone-prefix">
                  🇳🇬 <span style={{ color: C.warmGray }}>▾</span>
                </div>
                <input
                  className="lp-legal__phone-input"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+234"
                />
              </div>
            </FormField>
          </Card>

          <Card>
            <h2 className="lp-legal__section-title">
              Primary residence of the contracting party
            </h2>
            <FormField label="Country / Region" required error={errors.country}>
              <SelectInput
                value={form.country}
                onChange={(v) => set("country", v)}
                options={COUNTRIES}
                placeholder="Select"
              />
            </FormField>
            <FormField
              label="Address line 1"
              required
              error={errors.addressLine1}
            >
              <TextInput
                value={form.addressLine1}
                onChange={(v) => set("addressLine1", v)}
              />
            </FormField>
            <FormField label="Address line 2">
              <TextInput
                value={form.addressLine2}
                onChange={(v) => set("addressLine2", v)}
              />
            </FormField>
            <div className="lp-legal__address-grid">
              <FormField label="City" required error={errors.city}>
                <TextInput value={form.city} onChange={(v) => set("city", v)} />
              </FormField>
              <FormField label="Post code / Zip code">
                <TextInput
                  value={form.zipCode}
                  onChange={(v) => set("zipCode", v)}
                />
              </FormField>
            </div>
          </Card>

          <Card>
            <p style={{ color: C.warmGray, fontSize: 13, marginBottom: 20 }}>
              Some important information before you list your property on
              Staylist
            </p>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="lp-legal__faq-item">
                <div className="lp-legal__faq-icon">{item.icon}</div>
                <div>
                  <div className="lp-legal__faq-q">{item.q}</div>
                  <p className="lp-legal__faq-a">{item.a}</p>
                </div>
              </div>
            ))}

            <div className="lp-legal__agreements">
              <div>
                <Checkbox
                  checked={agree1}
                  onChange={setAgree1}
                  label="I certify that this is a legitimate accommodation business with all necessary licenses and permits, which can be shown upon first request. Staylist reserves the right to verify and investigate any details provided in this registration."
                />
                {errors.agree1 && (
                  <span className="lp-legal__agreement-error">
                    {errors.agree1}
                  </span>
                )}
              </div>
              <div>
                <Checkbox checked={agree2} onChange={setAgree2}>
                  I have read, accepted, and agreed to the{" "}
                  <a href="#" style={{ color: C.teal }}>
                    General Delivery Terms
                  </a>
                  .
                </Checkbox>
                {errors.agree2 && (
                  <span className="lp-legal__agreement-error">
                    {errors.agree2}
                  </span>
                )}
              </div>
            </div>

            <div className="lp-legal__actions">
              <PrimaryBtn
                disabled={submitting}
                fullWidth
                style={{
                  fontSize: "var(--lp-submit-btn-font-size, 16px)",
                  padding: "var(--lp-submit-btn-padding, 16px)",
                }}
              >
                {submitting ? "Submitting..." : "Open for bookings"}
              </PrimaryBtn>
              <button
                className="lp-legal__not-ready"
                type="button"
                onClick={onBack}
              >
                I'm not ready
              </button>
              {submitError ? (
                <span className="lp-legal__submit-error">{submitError}</span>
              ) : null}
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
