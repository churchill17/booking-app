import { useRef } from "react";
import ExploreCard from "./ExploreCard.jsx";
import { EXPLORE_CARD } from "../../data.js";
import "./Unique.css";

export default function Unique() {
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
    <section className="unique-stays">
      <h2>Discover our finest unique stays</h2>
      <p>Explore everything from luxury villas to unique igloos and boats.</p>
      <div className="scroll-wrapper">
        <button className="scroll-arrow left" onClick={() => scroll("left")}>
          {"<"}
        </button>
        <div className="unique-card horizontal-scroll" ref={scrollRef}>
          {EXPLORE_CARD.map((exploreCard) => (
            <ExploreCard key={exploreCard.title} {...exploreCard} />
          ))}
        </div>
        <button className="scroll-arrow right" onClick={() => scroll("right")}>
          {">"}
        </button>
      </div>
    </section>
  );
}
