import React from "react";
import "./HouseRules.css";

const HouseRules = ({ houseRules, propertyName }) => {
  const {
    checkInFrom,
    checkInUntil,
    checkOutFrom,
    checkOutUntil,
    cancellation,
    childrenPolicy,
    cotPolicy,
    ageRestriction,
    petsPolicy,
    paymentMethods,
    parties,
    finePrint,
  } = houseRules;

  const childrenValue = [childrenPolicy, cotPolicy].filter(Boolean).join(" · ") || "—";

  const rules = [
    {
      icon: "→",
      label: "Check-in",
      value:
        checkInFrom || checkInUntil
          ? `From ${checkInFrom || "—"}${checkInUntil ? ` until ${checkInUntil}` : ""}`
          : "—",
    },
    {
      icon: "→",
      label: "Check-out",
      value:
        checkOutFrom || checkOutUntil
          ? `From ${checkOutFrom || "—"}${checkOutUntil ? ` until ${checkOutUntil}` : ""}`
          : "—",
    },
    { icon: "ℹ", label: "Cancellation / Prepayment", value: cancellation || "—" },
    { icon: "👨‍👩‍👧", label: "Children and beds", value: childrenValue },
    { icon: "🔞", label: "Age restriction", value: ageRestriction || "—" },
    { icon: "🐾", label: "Pets", value: petsPolicy || "—" },
    { icon: "🎉", label: "Parties", value: parties || "—" },
  ];

  return (
    <section className="house-rules">
      <div className="house-rules__header">
        <div>
          <h2 className="house-rules__title">House Rules</h2>
          {propertyName && (
            <p className="house-rules__subtitle">
              {propertyName} takes special requests – add in the next step!
            </p>
          )}
        </div>
        <button
          className="house-rules__see-btn"
          onClick={() => document.getElementById("info-prices")?.scrollIntoView({ behavior: "smooth" })}
        >
          See availability
        </button>
      </div>

      <div className="house-rules__card">
        {rules.map((rule) => (
          <div key={rule.label} className="house-rules__row">
            <div className="house-rules__rule-label">
              <span className="house-rules__rule-icon">{rule.icon}</span>
              <strong>{rule.label}</strong>
            </div>
            <div className="house-rules__rule-value">{rule.value}</div>
          </div>
        ))}

        <div className="house-rules__row">
          <div className="house-rules__rule-label">
            <span className="house-rules__rule-icon">💳</span>
            <strong>Accepted payment methods</strong>
          </div>
          <div className="house-rules__payment-methods">
            {paymentMethods.map((method) => (
              <span key={method} className="house-rules__payment-tag">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="house-rules__fine-print">
        <h3 className="house-rules__fine-print-title">The fine print</h3>
        <p className="house-rules__fine-print-text">
          Need-to-know information for guests at this property
        </p>
        <div className="house-rules__fine-print-box">{finePrint}</div>
      </div>
    </section>
  );
};

export default HouseRules;
