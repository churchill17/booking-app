import React from "react";
import "./WeveGotYouCovered.css";

const FEATURES = [
  {
    id: 1,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#008009" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l3 3 5-5" />
        <path d="M12 2a10 10 0 0 1 0 20" strokeDasharray="3 3" />
      </svg>
    ),
    title: "Explore top attractions",
    desc: "Experience the best of your destination, with attractions, tours, activities and more",
  },
  {
    id: 2,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#008009" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
    title: "Fast and flexible",
    desc: "Book tickets online in minutes, with free cancellation on many attractions",
  },
  {
    id: 3,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#008009" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="10" r="1" />
        <circle cx="8" cy="10" r="1" />
        <circle cx="16" cy="10" r="1" />
      </svg>
    ),
    title: "Support when you need it",
    desc: "Booking.com's global Customer Service team is here to help 24/7",
  },
];

export default function WeveGotYouCovered() {
  return (
    <section className="covered">
      <div className="covered__container">
        <h2 className="covered__heading">We've got you covered</h2>
        <div className="covered__grid">
          {FEATURES.map((f) => (
            <div key={f.id} className="covered__item">
              <span className="covered__icon">{f.icon}</span>
              <div className="covered__text">
                <p className="covered__title">{f.title}</p>
                <p className="covered__desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
