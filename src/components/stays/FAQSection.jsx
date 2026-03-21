import React, { useState } from "react";

const ChevronIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function FAQSection({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="faq">
      <h2 className="faq__title">FAQs about hotels on Booking.com</h2>
      <div className="faq__grid">
        {faqs.map((faq, i) => (
          <div className="faq-item" key={i}>
            <div className="faq-item__header" onClick={() => toggle(i)}>
              <p className="faq-item__question">{faq.q}</p>
              <span
                className={`faq-item__toggle${openIndex === i ? " faq-item__toggle--open" : ""}`}
              >
                <ChevronIcon />
              </span>
            </div>
            {openIndex === i && <div className="faq-item__body">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
