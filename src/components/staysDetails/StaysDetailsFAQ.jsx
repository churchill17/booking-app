import React, { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import "./StaysDetailsFAQ.css";

const StaysDetailsFAQ = ({ faqs, propertyName }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return (
    <section className="stays-details-faq">
      <h2 className="stays-details-faq__title">
        FAQs about {propertyName || "this property"}
      </h2>
      <div className="stays-details-faq__grid">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`stays-details-faq__item ${openIndex === i ? "stays-details-faq__item--open" : ""}`}
            onClick={() => toggle(i)}
          >
            <div className="stays-details-faq__question">
              <span>{faq.question}</span>
              <span className="stays-details-faq__chevron">
                {openIndex === i ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
              </span>
            </div>
            {openIndex === i && (
              <div className="stays-details-faq__answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StaysDetailsFAQ;
