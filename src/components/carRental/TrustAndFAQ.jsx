import { useState } from "react";
import "./TrustAndFAQ.css";

const faqs = [
  {
    id: 1,
    question: "Which pick-up locations in Nigeria are the most popular?",
    answer:
      "The most popular pick-up locations in Nigeria include Murtala Muhammed International Airport in Lagos, Nnamdi Azikiwe International Airport in Abuja, and Port Harcourt International Airport. These locations offer the widest selection of rental vehicles and competitive pricing.",
  },
  {
    id: 2,
    question: "Can I pick up the car in one location and return it to a different one in Nigeria?",
    answer:
      "Yes, most car rental companies in Nigeria offer one-way rentals. This allows you to pick up the car in one city and return it to another. Additional fees may apply for this service.",
  },
  {
    id: 3,
    question: "Why should I book a car rental in Nigeria with Booking.com?",
    answer:
      "Booking.com offers a wide selection of vehicles from trusted suppliers in Nigeria, transparent pricing with no hidden fees, free cancellation on most bookings, and 24/7 customer support in over 30 languages.",
  },
  {
    id: 4,
    question: "What do I need to rent a car?",
    answer:
      "To rent a car you will typically need a valid driver's licence held for at least 1 year, a credit or debit card in the main driver's name, a passport or ID card, and sometimes an International Driving Permit (IDP).",
  },
  {
    id: 5,
    question: "Am I old enough to rent a car?",
    answer:
      "Most car rental companies require drivers to be at least 21 years old. Drivers aged 21–24 may incur a Young Driver surcharge. Some vehicle categories (premium, large SUVs) require drivers to be at least 25.",
  },
  {
    id: 6,
    question: "Can I book a car for my partner, friend, colleague, etc.?",
    answer:
      "Yes, you can book a car for someone else. However, the main driver must present their own valid driving licence and a credit card in their name at pick-up. Make sure to enter the correct driver's details during booking.",
  },
  {
    id: 7,
    question: "Any tips on choosing the right car?",
    answer:
      "Consider the number of passengers, luggage space needed, and road conditions at your destination. Economy cars are great for city driving, SUVs are ideal for off-road or large families, and convertibles suit coastal or scenic routes.",
  },
  {
    id: 8,
    question: "Is the rental price all inclusive?",
    answer:
      "The rental price usually includes basic insurance and standard mileage allowance. However, extras like GPS, child seats, full insurance coverage, or additional drivers are typically charged separately.",
  },
];

export default function TrustAndFAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const leftFaqs = faqs.filter((_, i) => i % 2 === 0);
  const rightFaqs = faqs.filter((_, i) => i % 2 === 1);

  return (
    <section className="trust-faq-section">
      {/* Trust Features */}
      <div className="trust-features">
        <div className="trust-item">
          <div className="trust-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Support agent"
              className="trust-img"
            />
          </div>
          <div className="trust-text">
            <h3 className="trust-heading">We're here for you</h3>
            <p className="trust-desc">Customer support in over 30 languages</p>
          </div>
        </div>

        <div className="trust-divider" />

        <div className="trust-item">
          <div className="trust-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1584/1584961.png"
              alt="Free cancellation"
              className="trust-img"
            />
          </div>
          <div className="trust-text">
            <h3 className="trust-heading">Free cancellation</h3>
            <p className="trust-desc">Up to 48 hours before pick-up, on most bookings</p>
          </div>
        </div>

        <div className="trust-divider" />

        <div className="trust-item">
          <div className="trust-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
              alt="Reviews"
              className="trust-img"
            />
          </div>
          <div className="trust-text">
            <h3 className="trust-heading">5 million+ reviews</h3>
            <p className="trust-desc">By real, verified customers</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="faq-main-title">Frequently asked questions</h2>
        <div className="faq-columns">
          <div className="faq-col">
            {leftFaqs.map((faq) => (
              <div
                key={faq.id}
                className={`faq-item ${openFaq === faq.id ? "faq-open" : ""}`}
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="faq-row">
                  <span className="faq-question">{faq.question}</span>
                  <span className="faq-chevron">{openFaq === faq.id ? "▲" : "▼"}</span>
                </div>
                {openFaq === faq.id && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
          <div className="faq-col">
            {rightFaqs.map((faq) => (
              <div
                key={faq.id}
                className={`faq-item ${openFaq === faq.id ? "faq-open" : ""}`}
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="faq-row">
                  <span className="faq-question">{faq.question}</span>
                  <span className="faq-chevron">{openFaq === faq.id ? "▲" : "▼"}</span>
                </div>
                {openFaq === faq.id && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
