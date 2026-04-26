import React, { useState } from "react";
import "./PaymentForm.css";

const PaymentForm = ({ onComplete, submitting = false, submitError = null }) => {
  const [form, setForm] = useState({
    cardName: "Churchill Amaechi",
    cardNumber: "",
    expiry: "",
    promo: "",
    marketing: true,
    saveCard: false,
  });

  const [errors, setErrors] = useState({});

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.cardName.trim()) errs.cardName = "Cardholder name is required";

    const rawCard = form.cardNumber.replace(/\s/g, "");
    if (!rawCard) errs.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(rawCard)) errs.cardNumber = "Enter a valid 16-digit card number";

    if (!form.expiry.trim()) {
      errs.expiry = "Expiry date is required";
    } else {
      const [mm, yy] = form.expiry.split("/").map((s) => s.trim());
      const month = parseInt(mm, 10);
      const year = parseInt(`20${yy}`, 10);
      const now = new Date();
      if (!mm || !yy || month < 1 || month > 12) {
        errs.expiry = "Enter a valid expiry date (MM/YY)";
      } else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        errs.expiry = "This card has expired";
      }
    }
    return errs;
  };

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardNum = (e) => {
    setForm((prev) => ({ ...prev, cardNumber: formatCard(e.target.value) }));
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleExpiry = (e) => {
    setForm((prev) => ({ ...prev, expiry: formatExpiry(e.target.value) }));
  };

  return (
    <div className="pf">
      <div className="pf__pay-info">
        <div className="pf__pay-badge">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 8h14" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="5.5" cy="11.5" r="1" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <p className="pf__pay-title">Pay when you stay</p>
          <p className="pf__pay-desc">Your card won't be charged now. We need your details to secure the reservation.</p>
        </div>
      </div>

      <h2 className="pf__section-title">
        <span className="pf__title-accent">01</span>
        Payment Method
      </h2>

      <div className="pf__card-brands">
        <div className="pf__brand pf__brand--amex" title="American Express">AMEX</div>
        <div className="pf__brand pf__brand--union" title="UnionPay">UP</div>
        <div className="pf__brand pf__brand--master" title="Mastercard">
          <span className="pf__brand-circles">
            <span className="pf__circle pf__circle--red" />
            <span className="pf__circle pf__circle--orange" />
          </span>
        </div>
        <div className="pf__brand pf__brand--visa" title="Visa">VISA</div>
      </div>

      <div className="pf__field">
        <label className="pf__label">Cardholder's Name <span className="pf__required">*</span></label>
        <input
          className={`pf__input${errors.cardName ? " pf__input--error" : ""}`}
          type="text"
          name="cardName"
          value={form.cardName}
          onChange={handle}
          placeholder="Name on card"
        />
        {errors.cardName && <p className="pf__error">{errors.cardName}</p>}
      </div>

      <div className="pf__field">
        <label className="pf__label">Card Number <span className="pf__required">*</span></label>
        <div className="pf__card-input-wrapper">
          <svg className="pf__card-icon" width="18" height="14" viewBox="0 0 18 14" fill="none">
            <rect x="1" y="1" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M1 5h16" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          <input
            className={`pf__input pf__input--card${errors.cardNumber ? " pf__input--error" : ""}`}
            type="text"
            inputMode="numeric"
            value={form.cardNumber}
            onChange={handleCardNum}
            placeholder="0000 0000 0000 0000"
          />
        </div>
        {errors.cardNumber && <p className="pf__error">{errors.cardNumber}</p>}
      </div>

      <div className="pf__grid">
        <div className="pf__field">
          <label className="pf__label">Expiry Date <span className="pf__required">*</span></label>
          <input
            className={`pf__input${errors.expiry ? " pf__input--error" : ""}`}
            type="text"
            inputMode="numeric"
            value={form.expiry}
            onChange={handleExpiry}
            placeholder="MM / YY"
          />
          {errors.expiry && <p className="pf__error">{errors.expiry}</p>}
        </div>
        <div className="pf__field pf__field--save-card">
          <label className="pf__toggle-label">
            <div className="pf__toggle-content">
              <span className="pf__toggle-title">Save card for future</span>
              <span className="pf__toggle-desc">Quickly complete future bookings</span>
            </div>
            <div className={`pf__toggle ${form.saveCard ? "pf__toggle--on" : ""}`}>
              <input type="checkbox" name="saveCard" checked={form.saveCard} onChange={handle} />
              <span className="pf__toggle-thumb" />
            </div>
          </label>
        </div>
      </div>

      <div className="pf__divider" />

      <div className="pf__checkbox-field">
        <label className="pf__checkbox-label">
          <div className={`pf__checkbox ${form.marketing ? "pf__checkbox--checked" : ""}`}>
            <input type="checkbox" name="marketing" checked={form.marketing} onChange={handle} />
            {form.marketing && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span>
            I'd like to receive personalised travel deals and updates.{" "}
            <span className="pf__hint-inline">Unsubscribe anytime.</span>
          </span>
        </label>
      </div>

      <div className="pf__legal">
        By completing this booking you agree to the{" "}
        <a href="#" className="pf__link">booking conditions</a>,{" "}
        <a href="#" className="pf__link">general terms</a>,{" "}
        <a href="#" className="pf__link">privacy policy</a> and{" "}
        <a href="#" className="pf__link">wallet terms</a>.
      </div>

      {submitError && (
        <p style={{ color: "#e07b3f", fontSize: "0.82rem", margin: 0, textAlign: "center" }}>
          {submitError}
        </p>
      )}

      <button
        className="pf__complete-btn"
        disabled={submitting}
        style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
        onClick={() => {
          if (submitting) return;
          const errs = validate();
          if (Object.keys(errs).length) { setErrors(errs); return; }
          onComplete && onComplete(form);
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M6 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {submitting ? "Processing…" : "Complete Booking"}
      </button>

    </div>
  );
};

export default PaymentForm;
