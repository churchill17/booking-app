import React, { useState } from "react";
import "./PriceInfoPanel.css";

const PriceInfoPanel = ({ priceInfo }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pip">
      <button
        className="pip__toggle"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <span className="pip__toggle-label">
          <span className="pip__toggle-icon">💰</span>
          Price Breakdown
        </span>
        <span className={`pip__toggle-chevron ${expanded ? "pip__toggle-chevron--open" : ""}`}>
          ▾
        </span>
      </button>

      {expanded && (
        <div className="pip__body">
          <div className="pip__taxes">
            <p className="pip__taxes-title">Taxes &amp; Charges</p>
            <div className="pip__taxes-grid">
              {priceInfo.taxes.map((t) => (
                <React.Fragment key={t.label}>
                  <span className="pip__tax-label">{t.label}</span>
                  <span className="pip__tax-amount">{t.amount}</span>
                </React.Fragment>
              ))}
              <span className="pip__tax-label pip__tax-total">Total included taxes</span>
              <span className="pip__tax-amount pip__tax-total">{priceInfo.totalTaxes}</span>
            </div>
          </div>

          <div className="pip__note pip__note--currency">
            <span className="pip__note-icon">🔄</span>
            <span>
              Price is converted to show approximate cost in NGN. You'll pay in{" "}
              <strong>USD or NGN</strong>. Exchange rate may change before payment.
            </span>
          </div>

          <div className="pip__note pip__note--fx">
            <span className="pip__note-icon">⚠️</span>
            <span>Your card issuer may charge a foreign transaction fee.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceInfoPanel;
