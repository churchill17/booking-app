import React, { useState } from "react";
import "./StaysDetailsFAQ.css";

const StaysDetailsFAQ = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="stays-details-faq">
      <h2 className="stays-details-faq__title">FAQs about Sixteen By Sixteen</h2>
      <div className="stays-details-faq__grid">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`stays-details-faq__item ${openIndex === i ? "stays-details-faq__item--open" : ""}`}
            onClick={() => toggle(i)}
          >
            <div className="stays-details-faq__question">
              <span>{faq}</span>
              <span className="stays-details-faq__chevron">{openIndex === i ? "∧" : "∨"}</span>
            </div>
            {openIndex === i && (
              <div className="stays-details-faq__answer">
                Please contact the property directly for the most accurate and up-to-date information about this question.
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="stays-details-faq__best-of">
        <div className="stays-details-faq__best-of-header">
          <span>The best of Lagos</span>
          <span>Click here to see more hotels and accommodation near popular landmarks in Lagos</span>
          <span className="stays-details-faq__best-of-chevron">∧</span>
        </div>
        <div className="stays-details-faq__best-of-links">
          <div>
            <h5>Cities</h5>
            <a href="#">Lagos</a>
            <a href="#">Ikeja</a>
            <a href="#">Ojota</a>
          </div>
          <div>
            <h5>Airports</h5>
            <a href="#">Murtala Muhammed International Airport</a>
          </div>
          <div>
            <h5>Landmarks</h5>
            <a href="#">US Embassy</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaysDetailsFAQ;
