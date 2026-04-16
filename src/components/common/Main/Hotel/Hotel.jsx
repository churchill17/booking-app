import { useRef } from "react";
import { HOTEL_CARD } from "../../data.js";
import HotelCard from "./HotelCard.jsx";
import "./Hotel.css";

export default function Hotel() {
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
    <section className="hotel-deals">
      <h2>Hotels you’ll love</h2>
      <p>You can book any of these hotels</p>
      <div className="scroll-wrapper">
        <button className="scroll-arrow left" onClick={() => scroll("left")}>
          {"<"}
        </button>
        <div className="hotel-card horizontal-scroll" ref={scrollRef}>
          {HOTEL_CARD.map((hotelCard) => (
            <HotelCard key={hotelCard.title} {...hotelCard} />
          ))}
        </div>
        <button className="scroll-arrow right" onClick={() => scroll("right")}>
          {">"}
        </button>
      </div>
    </section>
  );
}
