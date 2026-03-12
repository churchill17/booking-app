import GuestCard from "./GuestCard.jsx";
import { GUEST_CARD } from "../../data.js";
import "./Guest.css";

export default function Guest() {
  return (
    <section className="guest-favorite">
      <h2>Guest-favorite homes</h2>
      <p>
        Discover the homes our guests love most, handpicked for comfort and
        exceptional experiences.
      </p>

      <div>
        <div className="guest-card">
          {GUEST_CARD.map((guestCard) => (
            <GuestCard key={guestCard.title} {...guestCard} />
          ))}
        </div>
      </div>
    </section>
  );
}
