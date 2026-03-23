import { useRef } from "react";
import { WEEKEND_CARD } from "../../data.js";
import WeekendCard from "./WeekendCard";
import "./Weekend.css";

export default function Weekend() {
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
    <section className="weekend-deals">
      <h2>Weekend deals you’ll love</h2>
      <p>Save on stays for 7 March - 9 March</p>
      <div className="scroll-wrapper">
        <button className="scroll-arrow left" onClick={() => scroll("left")}>
          {"<"}
        </button>
        <div className="weekend-card horizontal-scroll" ref={scrollRef}>
          {WEEKEND_CARD.map((weekendCard) => (
            <WeekendCard key={weekendCard.title} {...weekendCard} />
          ))}
        </div>
        <button className="scroll-arrow right" onClick={() => scroll("right")}>
          {">"}
        </button>
      </div>
    </section>
  );
}
