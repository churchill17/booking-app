import { useState } from "react";

import "./CurrencySelector.css";

const currencies = [
  // Suggested
  { name: "Euro", code: "EUR" },
  { name: "Indian Rupee", code: "INR" },
  { name: "United States Dollar", code: "USD" },
  { name: "Pound Sterling", code: "GBP" },
  { name: "South African Rand", code: "ZAR" },
  { name: "UAE Dirham", code: "AED" },
  { name: "Egyptian Pound", code: "EGP" },
  // All currencies
  { name: "Nigerian Naira", code: "NGN" },
  { name: "Argentine Peso", code: "ARS" },
  { name: "Australian Dollar", code: "AUD" },
  { name: "Azerbaijani Manat", code: "AZN" },
  { name: "Bahraini Dinar", code: "BHD" },
  { name: "Brazilian Real", code: "BRL" },
  { name: "Canadian Dollar", code: "CAD" },
  { name: "Chilean Peso", code: "CLP" },
  { name: "Chinese Yuan", code: "CNY" },
  { name: "Danish Krone", code: "DKK" },
  { name: "Georgian Lari", code: "GEL" },
  { name: "Hong Kong Dollar", code: "HKD" },
  { name: "Hungarian Forint", code: "HUF" },
  { name: "Icelandic Króna", code: "ISK" },
  { name: "Indonesian Rupiah", code: "IDR" },
  { name: "Israeli New Shekel", code: "ILS" },
  { name: "Japanese Yen", code: "JPY" },
  { name: "Jordanian Dinar", code: "JOD" },
  { name: "Kazakhstani Tenge", code: "KZT" },
  { name: "Kuwaiti Dinar", code: "KWD" },
  { name: "Malaysian Ringgit", code: "MYR" },
  { name: "Mexican Peso", code: "MXN" },
  { name: "Norwegian Krone", code: "NOK" },
  { name: "New Zealand Dollar", code: "NZD" },
  { name: "Polish Złoty", code: "PLN" },
  { name: "Qatari Riyal", code: "QAR" },
  { name: "Romanian Leu", code: "RON" },
  { name: "Russian Rouble", code: "RUB" },
  { name: "Saudi Arabian Riyal", code: "SAR" },
  { name: "Singapore Dollar", code: "SGD" },
  { name: "South Korean Won", code: "KRW" },
  { name: "Swedish Krona", code: "SEK" },
  { name: "Swiss Franc", code: "CHF" },
  { name: "Thai Baht", code: "THB" },
  { name: "Turkish Lira", code: "TRY" },
  { name: "Ukrainian Hryvnia", code: "UAH" },
  { name: "West African CFA Franc", code: "XOF" },
];

const suggested = ["EUR", "INR", "USD", "GBP", "ZAR", "AED", "EGP"];

function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("NGN");

  const handleSelect = (code) => {
    setSelected(code);
    setIsOpen(false);
  };

  return (
    <>
      <button className="currency-trigger" onClick={() => setIsOpen(true)}>
        {selected}
      </button>
      {isOpen && (
        <div className="currency-overlay" onClick={() => setIsOpen(false)}>
          <div className="currency-modal" onClick={(e) => e.stopPropagation()}>
            <div className="currency-modal-header">
              <h2>Select your currency</h2>
              <p>
                Where applicable prices will be converted to, and shown in, the
                currency you select.
              </p>
              <div
                className="currency-close-btn"
                role="button"
                tabIndex={0}
                aria-label="Close"
                onClick={() => setIsOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsOpen(false);
                  }
                }}
              >
                ×
              </div>
            </div>

            <div className="currency-modal-content">
              <h4>Suggested for you</h4>
              <div className="currency-grid">
                {currencies
                  .filter((c) => suggested.includes(c.code))
                  .map((c) => (
                    <div
                      key={c.code}
                      className={
                        "currency-item" +
                        (selected === c.code ? " selected-suggested" : "")
                      }
                      onClick={() => handleSelect(c.code)}
                    >
                      <div className="currency-name">{c.name}</div>
                      <div className="currency-code">{c.code}</div>
                    </div>
                  ))}
              </div>

              <h4>All currencies</h4>
              <div className="currency-grid">
                {currencies
                  .filter((c) => !suggested.includes(c.code))
                  .map((c) => (
                    <div
                      key={c.code}
                      className={
                        "currency-item" +
                        (selected === c.code ? " selected-all" : "")
                      }
                      onClick={() => handleSelect(c.code)}
                    >
                      <div className="currency-name">{c.name}</div>
                      <div className="currency-code">{c.code}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CurrencySelector;
