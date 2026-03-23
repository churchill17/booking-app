import { useRef } from "react";
import { GUEST_CARD } from "../../data";
import GuestCard from "./GuestCard";
import "./Guest.css";

export default function Guest() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };
  return (
    <section className="guest-favorite">
      <h2>Guest-favorite homes</h2>
      <p>
        Discover the homes our guests love most, handpicked for comfort and
        exceptional experiences.
      </p>
      <div className="scroll-wrapper">
        <button className="scroll-arrow left" onClick={() => scroll("left")}>
          {"<"}
        </button>
        <div className="guest-card horizontal-scroll" ref={scrollRef}>
          {GUEST_CARD.map((guestCard) => (
            <GuestCard key={guestCard.title} {...guestCard} />
          ))}
        </div>
        <button className="scroll-arrow right" onClick={() => scroll("right")}>
          {">"}
        </button>
      </div>
    </section>
  );
}
