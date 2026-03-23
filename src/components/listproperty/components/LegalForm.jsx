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

const NOT_READY_OPTIONS = [
  "My property isn't ready to accept guests",
  "I want to connect my channel manager",
  "I want to update my calendar",
  "I have more details to add (photos, facilities, pricing, etc.)",
  "Something else",
];

const ERROR_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  country: "Country / Region",
  addressLine1: "Address line 1",
  city: "City",
  agree1: "Business certification agreement",
  agree2: "General Delivery Terms agreement",
};

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
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showNotReadyModal, setShowNotReadyModal] = useState(false);
  const [notReadyReasons, setNotReadyReasons] = useState([]);

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

  const validationSummaryItems = Object.entries(errors).map(
    ([key, message]) => {
      const label = ERROR_LABELS[key] || key;
      return `${label}: ${message}`;
    },
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) {
      setShowValidationSummary(true);
      return;
    }

    setShowValidationSummary(false);

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

  const toggleNotReadyReason = (reason) => {
    setNotReadyReasons((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason],
    );
  };

  const handleContinueRegistering = () => {
    setShowNotReadyModal(false);
    onBack();
  };

  return (
    <div className="lp-legal">
      <div className="lp-legal__inner">
        <form onSubmit={handleSubmit} noValidate>
          {showValidationSummary && validationSummaryItems.length ? (
            <div className="lp-legal__validation-summary" role="alert">
              <strong>Please complete the required fields to continue.</strong>
              <ul className="lp-legal__validation-list">
                {validationSummaryItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

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
                onClick={() => setShowNotReadyModal(true)}
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

      {showNotReadyModal ? (
        <div
          className="lp-legal__modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lp-not-ready-title"
        >
          <div className="lp-legal__modal-card">
            <button
              type="button"
              className="lp-legal__modal-close"
              onClick={() => setShowNotReadyModal(false)}
              aria-label="Close not ready form"
            >
              x
            </button>

            <h2 id="lp-not-ready-title" className="lp-legal__modal-title">
              Is there any reason you don't want to open for bookings?
            </h2>

            <div className="lp-legal__modal-options">
              {NOT_READY_OPTIONS.map((reason) => (
                <Checkbox
                  key={reason}
                  checked={notReadyReasons.includes(reason)}
                  onChange={() => toggleNotReadyReason(reason)}
                  label={reason}
                />
              ))}
            </div>

            <PrimaryBtn
              onClick={handleContinueRegistering}
              fullWidth
              style={{
                fontSize: "var(--lp-submit-btn-font-size, 16px)",
                padding: "var(--lp-submit-btn-padding, 16px)",
              }}
            >
              Submit and continue registering
            </PrimaryBtn>
          </div>
        </div>
      ) : null}
    </div>
  );
}
