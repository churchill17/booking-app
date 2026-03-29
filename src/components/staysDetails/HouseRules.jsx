import React from "react";
import "./HouseRules.css";

const HouseRules = ({ houseRules }) => {
  const {
    checkIn, checkOut, cancellation, children, cotPolicy,
    ageRestriction, pets, paymentMethods, parties, finePrint
  } = houseRules;

  const rules = [
    { icon: "→", label: "Check-in", value: checkIn },
    { icon: "←", label: "Check-out", value: checkOut },
    { icon: "ℹ", label: "Cancellation / Prepayment", value: cancellation },
    { icon: "👨‍👩‍👧", label: "Children and beds", value: `${children}\n${cotPolicy}` },
    { icon: "🔞", label: "Age restriction", value: ageRestriction },
    { icon: "🐾", label: "Pets", value: pets },
    { icon: "🎉", label: "Parties", value: parties },
  ];

  return (
    <section className="house-rules">
      <div className="house-rules__header">
        <div>
          <h2 className="house-rules__title">House Rules</h2>
          <p className="house-rules__subtitle">Sixteen By Sixteen takes special requests – add in the next step!</p>
        </div>
        <button className="house-rules__see-btn">See availability</button>
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
              <span key={method} className="house-rules__payment-tag">{method}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="house-rules__fine-print">
        <h3 className="house-rules__fine-print-title">The fine print</h3>
        <p className="house-rules__fine-print-text">Need-to-know information for guests at this property</p>
        <div className="house-rules__fine-print-box">{finePrint}</div>
      </div>
    </section>
  );
};

export default HouseRules;
