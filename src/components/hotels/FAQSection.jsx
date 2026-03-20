import React, { useState } from 'react';
import './FAQSection.css';

const faqs = [
  {
    q: 'How do I find cheap hotels on Booking.com?',
    a: 'There are a number of ways to find cheap hotels on Booking.com. You can filter hotels by price to show only those that match your budget, or you can sort by price to display the cheapest hotels first. If you\'re a member of our Genius loyalty programme, you can also enjoy discounted rates at select hotels and other properties.',
  },
  {
    q: 'How do I search for a hotel on Booking.com?',
    a: 'To search for a hotel on Booking.com, all you need to enter are your destination, dates of travel and the number of people travelling in your group. Don\'t know yet where or when you want to travel? You can also browse our site to get inspiration and find your perfect hotel that way, instead.',
  },
  {
    q: 'Where can I find hotel deals on Booking.com?',
    a: 'We have a range of different hotel deals and promotions running throughout the year, all of which can be found on our dedicated deals page. If you\'re a member of our Genius loyalty programme, you can also sign in to your account to see discounted rates at select hotels and other properties.',
  },
  {
    q: 'How do I find cheap last minute hotels on Booking.com?',
    a: 'To look for a cheap last minute hotel on Booking.com, enter your upcoming dates to search for a hotel and then use the budget filters to find a hotel within your price range.',
  },
  {
    q: 'How many hotels are listed on Booking.com?',
    a: 'There are currently 21,936,990 hotel room listings on Booking.com, so you\'ll always be able to find the perfect hotel – wherever it is you\'re going!',
  },
  {
    q: 'Why can I trust Booking.com\'s hotel reviews?',
    a: 'You can trust Booking.com hotel reviews because guests can only leave a review once they have stayed at a hotel. This means you get verified reviews written by real Booking.com guests.',
  },
];

const ChevronIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function FAQSection() {
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
              <span className={`faq-item__toggle${openIndex === i ? ' faq-item__toggle--open' : ''}`}>
                <ChevronIcon />
              </span>
            </div>
            {openIndex === i && (
              <div className="faq-item__body">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
